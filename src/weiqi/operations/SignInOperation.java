package weiqi.operations;

import java.io.IOException;

import javax.servlet.http.Cookie;

import weiqi.Context;
import weiqi.SessionManager;
import weiqi.models.EntityManager;
import weiqi.models.User;

public class SignInOperation 
{
	protected Context context;
	
	public SignInOperation(Context context) throws IOException 
	{
		this.context = context;
	}
	
	public void execute() throws IOException 
	{
		String loginName = context.getParam("LoginName");
		String password = context.getParam("Password");
		
		if (context.getUser() != null)
		{
			throw new IOException("Jesteœ ju¿ zalogowany.");
		}
		
		if (loginName == null || password == null)
		{
			throw new IOException("Nieprawid³owy login lub has³o.");
		}
		
		User user = EntityManager.getUser(loginName);
		
		if (user == null)
		{
			throw new IOException("Nieprawid³owy login lub has³o.");
		}
		
		if (user.getPassword().equals(password))
		{
			String sessionId = SessionManager.register(loginName);
            context.getResponse().addCookie(new Cookie("LoginName", loginName)); 
            context.getResponse().addCookie(new Cookie("Session", sessionId)); 
    		context.getResponse().getWriter().println(sessionId);
		}
		else
		{
			throw new IOException("Nieprawid³owy login lub has³o.");
		}
	}
}
