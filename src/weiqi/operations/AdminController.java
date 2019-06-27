package weiqi.operations;

import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;
import java.util.Set;

import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

import weiqi.Context;
import weiqi.MainServlet;
import weiqi.ValidationHelper;
import weiqi.models.EntityAlreadyExistsException;
import weiqi.models.EntityManager;
import weiqi.models.EntityManager.EntityReceiver;
import weiqi.models.EntityProperty;
import weiqi.models.Group;
import weiqi.models.Match;
import weiqi.models.Settings;
import weiqi.models.User;

public class AdminController 
{
	private static final Random Random = new Random();
	
	private static String getRandomPassword()
	{
		char[] symbols = "1234567890abcdefghijklmnopqrstuvwxyz".toCharArray();
		char[] password = new char[8];
		
		for (int idx = 0; idx < password.length; ++idx) 
		{
			password[idx] = symbols[AdminController.Random.nextInt(symbols.length)];
		}
		    
		return new String(password);
	}
	
	protected Context context;
	
	public AdminController(Context context) throws IOException 
	{
		String secretCode = context.getParam("SecretCode");

		if (this.isSecretCodeValid(secretCode) == false)
		{
			ValidationHelper.assertSession(context);
			ValidationHelper.assertAdmin(context);
		}
		
		this.context = context;
	}

	public void sendPassword() throws IOException
	{
		String loginName = this.context.getParam("LoginName");
		String bodyTemplate = this.context.getParam("Body");
		ValidationHelper.assertLoginName(loginName);
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
    	User user = EntityManager.getUser(loginName.trim());
    	String recipientMail = user.getEMailAddress();
    	
    	if (recipientMail == null || recipientMail == "")
    	{
    		throw new IOException("User '" + loginName.trim() + "' does not have email.");
    	}

    	this.sendNotification(session, user, "Internetowa Liga PSG", bodyTemplate);
	}

	public void addUser() throws IOException
	{
		String loginName = this.context.getParam("LoginName");
		String eMail = this.context.getParam("EMail");
		ValidationHelper.assertLoginName(loginName);
		ValidationHelper.assertEMail(eMail);
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		User user;
		Key userKey = User.createKey(loginName);

		try
		{
			user = new User(datastore.get(userKey));
			
			if (eMail.equals(user.getEMailAddress()) == false)
			{
				user.setEMailAddress(eMail);
				user.save();
			}
		}
		catch (EntityNotFoundException exception)
		{
			Entity userEntity = new Entity(userKey);
			userEntity.setProperty(EntityProperty.User_LoginName, loginName);
			userEntity.setProperty(EntityProperty.User_EMail, eMail);
			userEntity.setProperty(EntityProperty.User_Password, AdminController.getRandomPassword());
		    datastore.put(userEntity);
		}
	}

	public void addUsers() throws IOException
	{
		String[] loginNames = this.context.getParam("LoginName").split(",");
		
		for (String loginName : loginNames)
		{
			ValidationHelper.assertLoginName(loginName);
		}

		for (final String loginName : loginNames)
		{
			try 
			{
				EntityManager.create(User.createKey(loginName), new EntityReceiver() 
				{
					@Override
					public void onAdding(Entity entity) throws IOException 
					{
						entity.setProperty(EntityProperty.User_LoginName, loginName);
						entity.setProperty(EntityProperty.User_Password, AdminController.getRandomPassword());
					}
				});
			} 
			catch (EntityAlreadyExistsException e) 
			{
				throw new IOException("EntityAlreadyExistsException");
			}
		}
	}

	public void setUserEMail() throws IOException
	{
		final String loginName = this.context.getParam("LoginName");
		final String eMail = this.context.getParam("EMail");
		ValidationHelper.assertLoginName(loginName);
		
		try 
		{
			EntityManager.update(User.createKey(loginName), new EntityReceiver() 
			{
				@Override
				public void onUpdating(Entity entity) throws IOException 
				{
					entity.setProperty(EntityProperty.User_EMail, eMail);
				}
			});
		} 
		catch (EntityNotFoundException e) 
		{
			throw new IOException("EntityNotFoundException");
		}
	}

	public void setUserPassword() throws IOException
	{
		final String loginName = this.context.getParam("LoginName");
		final String password = this.context.getParam("Password");
		ValidationHelper.assertLoginName(loginName);
		
		try 
		{
			EntityManager.update(User.createKey(loginName), new EntityReceiver() 
			{
				@Override
				public void onUpdating(Entity entity) throws IOException 
				{
					entity.setProperty(EntityProperty.User_Password, password);
				}
			});
		} 
		catch (EntityNotFoundException e) 
		{
			throw new IOException("EntityNotFoundException");
		}
	}
	
	public void addGroup() throws IOException
	{
		final String season = this.context.getParam("Season");
		final String groupName = this.context.getParam("GroupName");
		ValidationHelper.assertSeason(season);
		ValidationHelper.assertGroupName(groupName);
		
		try 
		{
			EntityManager.create(Group.createKey(season, groupName), new EntityReceiver() 
			{
				@Override
				public void onAdding(Entity entity) throws IOException 
				{
					//entity.setProperty(EntityProperty.Group, loginName);
				}
			});
		} 
		catch (EntityAlreadyExistsException e) 
		{
			throw new IOException("EntityAlreadyExistsException");
		}
	}

	public void setGroupPlayers() throws IOException
	{
		final String season = this.context.getParam("Season");
		final String groupName = this.context.getParam("GroupName");
		final String players = this.context.getParam("Players");
		ValidationHelper.assertSeason(season);
		ValidationHelper.assertGroupName(groupName);
		
		try 
		{
			EntityManager.update(Group.createKey(season, groupName), new EntityReceiver() 
			{
				@Override
				public void onUpdating(Entity entity) throws IOException 
				{
					Group group = new Group(entity);
					group.setPlayers(players.split(","));
				}
			});
		} 
		catch (EntityNotFoundException e) 
		{
			throw new IOException("EntityNotFoundException");
		}
	}

	public void setCurrentSeason() throws IOException
	{
		final String currentSeason = this.context.getParam("CurrentSeason");
		ValidationHelper.assertSeason(currentSeason);
		Settings settings = Settings.getGlobal();
		settings.setCurrentSeason(currentSeason);
		settings.save();
	}

	public void sendNotification() throws IOException
	{
		String recipients = this.context.getParam("Recipients");
		String title = this.context.getParam("Title", true);
		String bodyTemplate = this.context.getParam("Body", true);

        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);
        ArrayList<User> recipientsEmails = new ArrayList<User>();
        
        for (String recipient : recipients.split(","))
        {
        	User user = EntityManager.getUser(recipient.trim());
        	String recipientMail = user.getEMailAddress();
        	
        	if (recipientMail == null || recipientMail == "")
        	{
        		throw new IOException("User '" + recipient.trim() + "' does not have email.");
        	}
        	
        	recipientsEmails.add(user);
        }
		
        for (User user : recipientsEmails)
        {
        	this.sendNotification(session, user, title, bodyTemplate);
        }
	}
	
	public void sendNotification(Session session, User user, String title, String bodyTemplate) throws IOException
	{
		String body = bodyTemplate;
		String loginName = user.getLoginName();
		String password = user.getPassword();
		String eMail = user.getEMailAddress();
		
		try 
		{
			body = body.replace("[username]", loginName);
			body = body.replace("[password]", password);
			
			Message message = new MimeMessage(session);
			message.setFrom(new InternetAddress("noreply@liga-go.appspotmail.com", "iLigaGo"));
			message.addRecipient(Message.RecipientType.TO, new InternetAddress(eMail, loginName));
			message.setSubject(title);
	        message.setContent(body, "text/html; charset=utf-8");
	        Transport.send(message);
	        MainServlet.Log.info("Email sent to :" + loginName + ".");
		} 
		catch (MessagingException e) 
		{
	        MainServlet.Log.severe("Error while sending email to :" + loginName + ".");
		}
	}
	
	public void setGroupModel() throws IOException
	{
		final String groupSignature = this.context.getParam("Group");
		final String model = this.context.getParam("Model");
		ValidationHelper.assertGroupKeyName(groupSignature);
		//ValidationHelper.assertGroupName(groupName);
		
		try 
		{
			EntityManager.update(KeyFactory.createKey("Group", groupSignature), new EntityReceiver() 
			{
				@Override
				public void onUpdating(Entity entity) throws IOException 
				{
					Group group = new Group(entity);
					group.setModel(model);
				}
			});
		} 
		catch (EntityNotFoundException e) 
		{
			throw new IOException("EntityNotFoundException");
		}
	}
	
	protected Boolean isSecretCodeValid(String secretCode)
	{
		return "L!6a".equals(secretCode);
	}
}
