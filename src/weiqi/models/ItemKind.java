package weiqi.models;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

public class ItemKind extends AbstractEntity
{
	public static Key createKey(String kindName) 
	{
		return KeyFactory.createKey("Kind", kindName);
	}
	
	public ItemKind(Entity entity) 
	{
		super(entity);
	}
}
