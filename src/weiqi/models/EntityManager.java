package weiqi.models;

import java.io.IOException;
import java.lang.reflect.Array;
import java.util.LinkedList;

import weiqi.Context;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.EntityNotFoundException;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;
import com.google.appengine.api.datastore.PreparedQuery;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Transaction;
import com.google.appengine.api.datastore.Query.Filter;
import com.google.appengine.api.datastore.Query.FilterOperator;
import com.google.appengine.api.datastore.Query.FilterPredicate;

public class EntityManager
{
	public static User getUser(String loginName)
	{
		if (loginName == null)
		{
			return null;
		}
		else
		{
			Key userKey = User.createKey(loginName);
			return EntityManager.getSingleEntity(User.class, "User", EntityProperty.User_LoginName, userKey);
		}
	}

	public static String getUserRole(String loginName)
	{
		if (loginName != null && loginName.equals("") == false)
		{
			User user = EntityManager.getUser(loginName);
		}
		
		return "";
	}
	
	public static Group getGroup(String season, String groupName) 
	{
		Key groupKey = Group.createKey(season, groupName);
		return EntityManager.getSingleEntity(Group.class, "Group", EntityProperty.Group_Signature, groupKey);
	}
	
	public static Group getGroup(String signature) 
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();

		try 
		{
			Entity groupEntity = datastore.get(KeyFactory.createKey("Group", signature.toLowerCase()));
			return new Group(groupEntity);
		} 
		catch (EntityNotFoundException e) 
		{
			return null;
		}
	}

//	public static void setMatchResult(String loginName, String season, String groupName, String player1, String player2, String result) //(Context context, String loginName, String season, String groupName, String player1, String player2, String result) 
//	{
//		Key matchKey = Match.createKey(season, groupName, player1, player2);
//		
//		if (loginName.equals(player1))
//		{
//			EntityManager.getOrCreateEntity(matchKey, new TransactionOperation() 
//			{
//				@Override
//				public void doOperation(Entity entity) 
//				{
//					entity.setProperty(EntityProperty.Match_Player1, player1);
//					entity.setProperty(EntityProperty.Match_Player2, player2);
//					entity.setProperty(EntityProperty.Match_Result1, result);
//				}
//			});
//		}
//		else if (loginName.equals(player2))
//		{
//		}
//		
//		//Entity entity = new Entity(key);
//		//entity.setProperty("Player2", player2);
//		//DatastoreServiceFactory.getDatastoreService().put(entity);
//		//DatastoreServiceFactory.getDatastoreService().
//		//KeyFactory.
//		//KeyFactory.createKey(kind, keyName));
//		//lock
//	}
	
	public abstract static class EntityReceiver
	{
		public void onAdding(Entity entity) throws IOException
		{
		}
		
		public void onUpdating(Entity entity) throws IOException
		{
		}
		
		public void onDeleting(Entity entity) throws IOException
		{
		}
	}

	public static void createOrUpdate(Key key, EntityReceiver receiver) throws IOException
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transcation = datastore.beginTransaction();
		Entity entity;
		
		try 
		{
			try
			{
				entity = datastore.get(key);
				receiver.onUpdating(entity);
			}
			catch (EntityNotFoundException exception)
			{
				entity = new Entity(key);
				receiver.onAdding(entity);
			}
			
		    datastore.put(entity);
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
	
	public static void create(Key key, EntityReceiver receiver) throws IOException, EntityAlreadyExistsException
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transcation = datastore.beginTransaction();
		Entity entity;
		
		try 
		{
			try
			{
				entity = datastore.get(key);
				throw new EntityAlreadyExistsException();
			}
			catch (EntityNotFoundException exception)
			{
				entity = new Entity(key);
				receiver.onAdding(entity);
			    datastore.put(entity);
			    transcation.commit();
			}
		} 
		finally 
		{
		    if (transcation.isActive()) 
		    {
		    	transcation.rollback();
		    }
		}
	}

	public static void update(Key key, EntityReceiver receiver) throws EntityNotFoundException, IOException
	{
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		Transaction transcation = datastore.beginTransaction();
		Entity entity;
		
		try 
		{
			entity = datastore.get(key);
			receiver.onUpdating(entity);
		    datastore.put(entity);
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
	

	public static void updateEntity(Entity entity)
	{
		DatastoreServiceFactory.getDatastoreService().put(entity);
	}
	

	@SuppressWarnings("unchecked")
	public static <T extends AbstractEntity> T[] getEntities(Class<T> entityClass, String kind, String propertyName, String value)
	{
		LinkedList<T> entities = new LinkedList<T>();

		Filter filter = new FilterPredicate(propertyName, FilterOperator.EQUAL, value);
		Query query = new Query(kind);
		query.setFilter(filter);
		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
		
		PreparedQuery preparedQuery = datastore.prepare(query);
		
		for (Entity entity : preparedQuery.asIterable())
		{
			try
			{
				entities.add(entityClass.getDeclaredConstructor(Entity.class).newInstance(entity));
			} 
			catch (Exception e) 
			{
				e.printStackTrace();
			}
		}
		
		return entities.toArray((T[])Array.newInstance(entityClass, 0));
	}
	
	public static <T extends AbstractEntity> T getSingleEntity(Class<T> entityClass, String kind, String propertyName, Key key)
	{
		try 
		{
			Entity entity = DatastoreServiceFactory.getDatastoreService().get(key);
			
			try 
			{
				return entityClass.getDeclaredConstructor(Entity.class).newInstance(entity);
			} 
			catch (Exception e) 
			{
				return null;
			}
		} 
		catch (EntityNotFoundException e1) 
		{
			return null;
		}
//		Filter filter = new FilterPredicate(propertyName, FilterOperator.EQUAL, value);
//		Query query = new Query(kind);
//		query.setFilter(filter);
//		DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
//		PreparedQuery preparedQuery = datastore.prepare(query);
//		Entity entity = preparedQuery.asSingleEntity();
	}
}