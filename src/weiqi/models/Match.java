package weiqi.models;

import java.util.Date;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

public class Match extends AbstractEntity
{
	public static Key createKey(Key groupKey, String matchId, String player1, String player2) 
	{
		String matchKeyName;
		String groupKeyName = groupKey.getName();
		
		if (matchId == null || "".equals(matchId))
		{
			matchKeyName = groupKeyName + "-" + player1 + "-" + player2;
		}
		else
		{
			matchKeyName = groupKeyName + "-" + matchId;
		}
		
		return KeyFactory.createKey("Match", matchKeyName);
	}
	
	public static Key createKey(Group group, String matchId, String player1, String player2) 
	{
		return Match.createKey(group.getEntity().getKey(), matchId, player1, player2);
		//String keyName = group.getEntity().getKey().getName() + "-" + player1 + "-" + player2;
		//return KeyFactory.createKey("Match", keyName);
	}
	
	public Match(Entity entity) 
	{
		super(entity);
	}
	
	public Match(Group group, String matchId, String player1, String player2) 
	{
		super(new Entity(Match.createKey(group, matchId, player1, player2)));

		this.getEntity().setProperty(EntityProperty.Match_Id, matchId);
		this.getEntity().setProperty(EntityProperty.Match_Player1, player1);
		this.getEntity().setProperty(EntityProperty.Match_Player2, player2);
		this.getEntity().setProperty(EntityProperty.Match_Group, group.getEntity().getKey().getName());
	}
	
	public String getId()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Id);
	}
	
	public void acceptDate(String player)
	{
		if (player.equals(this.getPlayer1()))
		{
			String date = this.getStringPropertyOrEmpty(EntityProperty.Match_Date2);
			this.getEntity().setProperty(EntityProperty.Match_Date, date);
		}
		else if (player.equals(this.getPlayer2()))
		{
			String date = this.getStringPropertyOrEmpty(EntityProperty.Match_Date1);
			this.getEntity().setProperty(EntityProperty.Match_Date, date);
		}
	}
	
	public void proposedDate(String player, String date)
	{
		if (player.equals(this.getPlayer1()))
		{
			this.getEntity().setProperty(EntityProperty.Match_Date1, date);
		}
		else if (player.equals(this.getPlayer2()))
		{
			this.getEntity().setProperty(EntityProperty.Match_Date2, date);
		}
	}

	public void matchResult(String result)
	{
		this.getEntity().setProperty(EntityProperty.Match_Result, result);
	}
	
	public void matchResult(String player, String result)
	{
		if (player.equals(this.getPlayer1()))
		{
			this.getEntity().setProperty(EntityProperty.Match_Result1, result);
		}
		else if (player.equals(this.getPlayer2()))
		{
			this.getEntity().setProperty(EntityProperty.Match_Result2, result);
		}
	}

	public void matchUrl(String url)
	{
		this.getEntity().setProperty(EntityProperty.Match_Url, url);
	}
	
	public void matchUrl(String player, String url)
	{
		if (player.equals(this.getPlayer1()))
		{
			this.getEntity().setProperty(EntityProperty.Match_Url1, url);
		}
		else if (player.equals(this.getPlayer2()))
		{
			this.getEntity().setProperty(EntityProperty.Match_Url2, url);
		}
	}

	public void setMatchDate(String date)
	{
		this.getEntity().setProperty(EntityProperty.Match_Date, date);
	}
	
	public void setMatchDate(String player, String date)
	{
		if (player.equals(this.getPlayer1()))
		{
			String opponentDate = this.getStringPropertyOrEmpty(EntityProperty.Match_Date2);
			
			if (opponentDate.equals(date))
			{
				this.getEntity().setProperty(EntityProperty.Match_Date, date);
				this.getEntity().setProperty(EntityProperty.Match_Date1, "");
				this.getEntity().setProperty(EntityProperty.Match_Date2, "");
			}
			else
			{
				this.getEntity().setProperty(EntityProperty.Match_Date1, date);
			}
		}
		else if (player.equals(this.getPlayer2()))
		{
			String opponentDate = this.getStringPropertyOrEmpty(EntityProperty.Match_Date1);
			
			if (opponentDate.equals(date))
			{
				this.getEntity().setProperty(EntityProperty.Match_Date, date);
				this.getEntity().setProperty(EntityProperty.Match_Date1, "");
				this.getEntity().setProperty(EntityProperty.Match_Date2, "");
			}
			else
			{
				this.getEntity().setProperty(EntityProperty.Match_Date2, date);
			}
		}
	}
	
	public String getPlayer1()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Player1);
	}
	
	public String getPlayer2()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Player2);
	}
	
	public String getResult()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Result);
	}
	
	public String getResult1()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Result1);
	}
	
	public String getResult2()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Result2);
	}
	
	public String getUrl()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Url);
	}
	
	public String getUrl1()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Url1);
	}
	
	public String getUrl2()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Url2);
	}
	
	public String getDate()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Date);
	}
	
	public String getDate1()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Date1);
	}
	
	public String getDate2()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Match_Date2);
	}
}