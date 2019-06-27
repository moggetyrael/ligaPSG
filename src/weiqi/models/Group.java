package weiqi.models;

import java.util.Date;

import weiqi.Utilities;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

public class Group extends AbstractEntity
{
	public static String getKeyName(String season, String groupName)
	{
		return season.toLowerCase() + "-" + groupName.toLowerCase();
	}
	
	public static Key createKey(String season, String groupName)
	{
		return KeyFactory.createKey("Group", Group.getKeyName(season, groupName));
	}
	
	public Group(Entity entity) 
	{
		super(entity);
	}

	public void setModel(String model)
	{
		this.getEntity().setProperty(EntityProperty.Group_Model, model);
	}
	
	public String getModel() 
	{
		String result = this.getStringPropertyOrEmpty(EntityProperty.Group_Model);
		
		if (result == null || result == "")
		{
			result = "null";
		}
		
		return result;
	}

	public void setPlayers(String[] players) 
	{
		for (int i = 0; i < players.length; i++) 
		{
			players[i] = players[i].trim();
		}
		
		this.getEntity().setProperty(EntityProperty.Group_Players, Utilities.Text.join(players, ","));
	}

	public String[] getPlayers() 
	{
		return this.getStringPropertyOrEmpty(EntityProperty.Group_Players).split(",");
	}

	public Match[] getMatches() 
	{
		return EntityManager.getEntities(Match.class, "Match", EntityProperty.Match_Group, this.getEntity().getKey().getName());
	}
}