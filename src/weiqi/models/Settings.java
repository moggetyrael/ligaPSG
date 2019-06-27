package weiqi.models;

import java.util.Arrays;
import java.util.LinkedList;
import java.util.List;

import weiqi.Utilities;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;

public class Settings extends AbstractEntity 
{
	private static List<String> Admins = Arrays.asList(new String[] { "papapishu", "higaki94", "Siasio", "Coorchac", "Maek" });
			
	public static Settings getGlobal()
	{
		Key key = KeyFactory.createKey("Settings", "Global");
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transaction = null;
		Settings settings = null;
		
		try
		{
			transaction = datastore.beginTransaction(TransactionOptions.Builder.withXG(true));
			
			try
			{
				settings = new Settings(datastore.get(key));
			}
			catch (EntityNotFoundException exception)
			{
				settings = new Settings(new Entity(key));
				settings.setCurrentSeason("1");
			}

		    datastore.put(settings.getEntity());
			transaction.commit();
		}
		catch (Exception exception)
		{
		    if (transaction != null && transaction.isActive()) 
		    {
		    	transaction.rollback();
		    }
		}
		
		return settings;
	}
	
	public Settings(Entity entity) 
	{
		super(entity);
	}

	public String getCurrentSeason()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Settings_CurrentSeason);
	}

	public void setCurrentSeason(String value)
	{
		this.getEntity().setProperty(EntityProperty.Settings_CurrentSeason, value);
	}
	
	public List<String> getAdmins()
	{
		return Settings.Admins;
	}

	public String[] getPlayersJoinedToEliminations() 
	{
		String propertyValue = this.getStringPropertyOrEmpty(EntityProperty.Settings_PlayersJoinedToEliminations);
		return propertyValue.equals("") ? new String[] {} : propertyValue.split(",");
	}

	public void setPlayersJoinedToEliminations(String[] players) 
	{
		this.getEntity().setProperty(EntityProperty.Settings_PlayersJoinedToEliminations, Utilities.Text.join(players, ","));
	}
}
