package weiqi.models;

import java.util.Date;

import com.google.appengine.api.datastore.Entity;

abstract class AbstractEntity
{
	private Entity entity;
	
	public AbstractEntity(Entity entity) 
	{
		this.entity = entity;
	}
	
	public Entity getEntity()
	{
		return this.entity;
	}
	
	public void save()
	{
		EntityManager.updateEntity(this.entity);
	}
	
	public Date lastModified()
	{
		Object propertyValue = this.getEntity().getProperty(EntityProperty.LastModified);
		
		if (propertyValue != null && propertyValue instanceof Date)
		{
			return (Date)propertyValue;
		}
		else
		{
			return null;
		}
	}
	
	public void lastModified(Date date)
	{
		this.getEntity().setProperty(EntityProperty.LastModified, date);
	}
	
	protected String getStringPropertyOrEmpty(String propertyName)
	{
		Object value = this.entity.getProperty(propertyName);
		
		if (value == null)
		{
			return "";
		}
		else
		{
			return value.toString();
		}
	}
	
	protected int getIntegerPropertyOrZero(String propertyName)
	{
		Object value = this.entity.getProperty(propertyName);
		
		if (value == null)
		{
			return 0;
		}
		else
		{
			return (int)value;
		}
	}
}