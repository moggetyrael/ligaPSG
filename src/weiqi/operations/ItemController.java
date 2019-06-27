package weiqi.operations;

import java.io.IOException;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weiqi.models.Group;
import weiqi.models.ItemKind;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.Query;

public class ItemController 
{
	protected ItemControllerContext context;
	//protected String loginName;

	public ItemController(ItemControllerContext context) 
	{
		//ValidationHelper.assertSession(context);
		this.context = context;
		//this.loginName = context.getUser().getLoginName();
		
		//ValidationHelper.assertLoginName(this.loginName);
	}

	public void get() throws IOException 
	{
		String itemKindName = this.context.getRequestParameterRequired("kind");
		String itemKeyName;
		//KeyFactory.createKey("Group", Group.getKeyName(season, groupName));
		Key key;
		Entity e;
		ItemKind itemKind = this.getItemKind(itemKindName);

		//key.
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		//datastore.g
		Query q = new Query("person");
		
		for (Entity entity : datastore.prepare(q).asIterable()) {
		    // do something with this entity
		}
	}
	
	protected ItemKind getItemKind(String itemKindName)
	{
		// [TODO] validate permissions
		return null;
	}
}
