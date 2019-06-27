package weiqi.operations;

import java.io.IOException;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.TransactionOptions;

import weiqi.Context;
import weiqi.Utilities;
import weiqi.ValidationHelper;
import weiqi.models.EntityProperty;
import weiqi.models.Group;
import weiqi.models.Match;
import weiqi.models.Settings;

public class LeagueController 
{
	protected Context context;
	protected String loginName;

	public LeagueController(Context context) throws IOException 
	{
		ValidationHelper.assertSession(context);
		
		this.context = context;
		this.loginName = context.getUser().getLoginName();
		
		ValidationHelper.assertLoginName(this.loginName);
	}
	
	public void saveMatch() throws IOException
	{
		String matchId = context.getParam("Id");
		String groupKeyName = context.getParam("Group");
		String player1 = context.getParam("Player1");
		String player2 = context.getParam("Player2");
		String result = context.getParam("Result");
		String url = context.getParam("Url");
		String date = context.getParam("Date");

		//ValidationHelper.assertSeason(season);
		ValidationHelper.assertGroupKeyName(groupKeyName);
		ValidationHelper.assertLoginName(player1);
		ValidationHelper.assertLoginName(player2);
		ValidationHelper.assertMatchResult(result);

		if (context.getUser().isAdmin() == false)
		{
			this.assertUserHasPermissionForEditMatch(player1, player2);
		}
		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transcation = datastore.beginTransaction(TransactionOptions.Builder.withXG(true));
		Key groupKey = KeyFactory.createKey("Group", groupKeyName);
		Key matchKey = Match.createKey(groupKey, matchId, player1, player2);
		Entity groupEntity;
		Match match;
		Date transactionDate = new Date();
		
		try 
		{
			try
			{
				groupEntity = datastore.get(groupKey);
			} 
			catch (EntityNotFoundException exception) 
			{
				throw new IOException("Nie znaleziono grupy");
			}

			Group group = new Group(groupEntity);

			try
			{
				match = new Match(datastore.get(matchKey));
			}
			catch (EntityNotFoundException exception)
			{
				match = new Match(group, matchId, player1, player2);
			}
					
			group.lastModified(transactionDate);

			if (context.getUser().isAdmin())
			{
				match.matchResult(result);
				match.matchUrl(url);
			}
			else
			{
				match.matchResult(this.loginName, result);
				match.matchUrl(this.loginName, url);
				match.setMatchDate(this.loginName, date);
			}
			
		    datastore.put(groupEntity);
		    datastore.put(match.getEntity());
		    transcation.commit();

			context.getResponse().getWriter().print(Utilities.Json.toJson(match));
		} 
		finally 
		{
		    if (transcation.isActive()) 
		    {
		    	transcation.rollback();
		    }
		}
	}

	public void removeProposal() throws IOException
	{
		//String season = context.getParam("Season");
		String matchId = context.getParam("Id");
		String groupKeyName = context.getParam("Group");
		String player1 = context.getParam("Player1");
		String player2 = context.getParam("Player2");

		//ValidationHelper.assertSeason(season);
		ValidationHelper.assertGroupKeyName(groupKeyName);
		ValidationHelper.assertLoginName(player1);
		ValidationHelper.assertLoginName(player2);
		
		this.assertUserHasPermissionForEditMatch(player1, player2);
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transcation = datastore.beginTransaction(TransactionOptions.Builder.withXG(true));
		Key groupKey = KeyFactory.createKey("Group", groupKeyName);
		Key matchKey = Match.createKey(groupKey, matchId, player1, player2);
		//Key matchKey = KeyFactory.createKey("Match", groupKeyName + "-" + player1 + "-" + player2);
		Entity groupEntity;
		Match match;
		Date transactionDate = new Date();
		
		try 
		{
			try
			{
				groupEntity = datastore.get(groupKey);
			} 
			catch (EntityNotFoundException exception) 
			{
				throw new IOException("Nie znaleziono grupy");
			}

			Group group = new Group(groupEntity);

			try
			{
				match = new Match(datastore.get(matchKey));
			}
			catch (EntityNotFoundException exception)
			{
				match = new Match(group, matchId, player1, player2);
			}
					
			group.lastModified(transactionDate);
			match.proposedDate(this.loginName, "");
			
		    datastore.put(groupEntity);
		    datastore.put(match.getEntity());
		    transcation.commit();
		} 
		finally 
		{
		    if (transcation.isActive()) 
		    {
		    	transcation.rollback();
		    }
		}
	}

	public void acceptProposal() throws IOException 
	{
		//String season = context.getParam("Season");
		String matchId = context.getParam("Id");
		String groupKeyName = context.getParam("Group");
		String player1 = context.getParam("Player1");
		String player2 = context.getParam("Player2");

		//ValidationHelper.assertSeason(season);
		ValidationHelper.assertGroupKeyName(groupKeyName);
		ValidationHelper.assertLoginName(player1);
		ValidationHelper.assertLoginName(player2);
		
		if (context.getUser().isAdmin() == false)
		{
			this.assertUserHasPermissionForEditMatch(player1, player2);
		}
		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transcation = datastore.beginTransaction(TransactionOptions.Builder.withXG(true));
		Key groupKey = KeyFactory.createKey("Group", groupKeyName);
		Key matchKey = Match.createKey(groupKey, matchId, player1, player2);
		//Key matchKey = KeyFactory.createKey("Match", groupKeyName + "-" + player1 + "-" + player2);
		Entity groupEntity;
		Match match;
		Date transactionDate = new Date();
		
		try 
		{
			try
			{
				groupEntity = datastore.get(groupKey);
			} 
			catch (EntityNotFoundException exception) 
			{
				throw new IOException("Nie znaleziono grupy");
			}

			Group group = new Group(groupEntity);

			try
			{
				match = new Match(datastore.get(matchKey));
			}
			catch (EntityNotFoundException exception)
			{
				match = new Match(group, matchId, player1, player2);
			}
					
			group.lastModified(transactionDate);
			match.acceptDate(this.loginName);
			
		    datastore.put(groupEntity);
		    datastore.put(match.getEntity());
		    transcation.commit();
		} 
		finally 
		{
		    if (transcation.isActive()) 
		    {
		    	transcation.rollback();
		    }
		}
	}

	public void saveProposal() throws IOException 
	{
		String matchId = context.getParam("Id");
		//String season = context.getParam("Season");
		String groupKeyName = context.getParam("Group");
		String player1 = context.getParam("Player1");
		String player2 = context.getParam("Player2");
		String date = context.getParam("Date");

		//ValidationHelper.assertSeason(season);
		ValidationHelper.assertGroupKeyName(groupKeyName);
		ValidationHelper.assertLoginName(player1);
		ValidationHelper.assertLoginName(player2);
		ValidationHelper.assertMatchDate(date);
		
		this.assertUserHasPermissionForEditMatch(player1, player2);
		
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transcation = datastore.beginTransaction(TransactionOptions.Builder.withXG(true));
		Key groupKey = KeyFactory.createKey("Group", groupKeyName);
		Key matchKey = Match.createKey(groupKey, matchId, player1, player2);
		//Key matchKey = KeyFactory.createKey("Match", groupKeyName + "-" + player1 + "-" + player2);
		Entity groupEntity;
		Match match;
		Date transactionDate = new Date();
		
		try 
		{
			try
			{
				groupEntity = datastore.get(groupKey);
			} 
			catch (EntityNotFoundException exception) 
			{
				throw new IOException("Nie znaleziono grupy");
			}

			Group group = new Group(groupEntity);

			try
			{
				match = new Match(datastore.get(matchKey));
			}
			catch (EntityNotFoundException exception)
			{
				match = new Match(group, matchId, player1, player2);
			}
					
			group.lastModified(transactionDate);
			match.proposedDate(this.loginName, date);
			
		    datastore.put(groupEntity);
		    datastore.put(match.getEntity());
		    transcation.commit();
		} 
		finally 
		{
		    if (transcation.isActive()) 
		    {
		    	transcation.rollback();
		    }
		}
	}

	public void joinToEliminations() throws IOException 
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transcation = null;
		Key settingsKey = KeyFactory.createKey("Settings", "Global");
		String currentUserLogin = this.context.getUser().getLoginName();

		try 
		{
			transcation = datastore.beginTransaction(TransactionOptions.Builder.withXG(true));
			Entity settingsEntity = datastore.get(settingsKey);
			Settings settings = new Settings(settingsEntity);
			List<String> players = new LinkedList<String>();
			players.addAll(Arrays.asList(settings.getPlayersJoinedToEliminations()));
			
			if (players.contains(currentUserLogin) == false)
			{
				players.add(currentUserLogin);
				settings.setPlayersJoinedToEliminations(players.toArray(new String[] {}));
				settings.save();
			}

		    transcation.commit();
		}
		catch (Exception exception)
		{
			throw new IOException(exception);
		}
		finally 
		{
			if (transcation != null)
			{
			    if (transcation.isActive()) 
			    {
			    	transcation.rollback();
			    }
			}
		}
	}

	public void unjoinFromEliminations() throws IOException 
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transcation = null;
		Key settingsKey = KeyFactory.createKey("Settings", "Global");
		String currentUserLogin = this.context.getUser().getLoginName();

		try 
		{
			transcation = datastore.beginTransaction(TransactionOptions.Builder.withXG(true));
			Entity settingsEntity = datastore.get(settingsKey);
			Settings settings = new Settings(settingsEntity);
			List<String> players = new LinkedList<String>();
			players.addAll(Arrays.asList(settings.getPlayersJoinedToEliminations()));
			
			if (players.contains(currentUserLogin))
			{
				players.remove(currentUserLogin);
				settings.setPlayersJoinedToEliminations(players.toArray(new String[] {}));
				settings.save();
			}

		    transcation.commit();
		}
		catch (Exception exception)
		{
			throw new IOException(exception);
		}
		finally 
		{
			if (transcation != null)
			{
			    if (transcation.isActive()) 
			    {
			    	transcation.rollback();
			    }
			}
		}
	}
	
	protected void assertUserHasPermissionForEditMatch(String player1, String player2) throws IOException
	{
		if (this.loginName.equals(player1) == false && this.loginName.equals(player2) == false)
		{
			throw new IOException("Nie mo¿esz edytowaæ gry której nie jesteœ uczestnikiem.");
		}
	}
}
