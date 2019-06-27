package weiqi.models;

import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.Key;
import com.google.appengine.api.datastore.KeyFactory;

public class User extends AbstractEntity
{
	public static Key createKey(String loginName) 
	{
		return KeyFactory.createKey("User", loginName);
	}
	
	public User(Entity entity) 
	{
		super(entity);
	}
	
	public String getLoginName()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.User_LoginName);
	}
	
	public String getPassword()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.User_Password);
	}
	
	public String getEMailAddress()
	{
		return this.getStringPropertyOrEmpty(EntityProperty.User_EMail);
	}
	
	public void setEMailAddress(String eMail)
	{
		this.getEntity().setProperty(EntityProperty.User_EMail, eMail);
	}
	
	public boolean isAdmin()
	{
		return Settings.getGlobal().getAdmins().indexOf(this.getLoginName()) >= 0;
	}
}
