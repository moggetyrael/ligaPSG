package weiqi;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.Map;

import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import weiqi.models.EntityManager;
import weiqi.models.User;

public class Context
{
	private HttpServletRequest request;
	private HttpServletResponse response;
	private User user;
	private Map<String, String> postData;
	
	public Context(HttpServlet servlet, HttpServletRequest request, HttpServletResponse response) 
	{
		String loginName = SessionManager.getLoginName(request);
		
		this.response = response;
		this.request = request;
		this.user = EntityManager.getUser(loginName);
		this.postData = Utilities.readPostDataAsMap(this.request);
	}
	
	public HttpServletRequest getRequest() 
	{
		return this.request;
	}
	
	public HttpServletResponse getResponse() 
	{
		return this.response;
	}

	public User getUser()
	{
		return this.user;
	}
	
	public String getParam(String name)
	{
		return this.postData.get(name);
	}
	
	public String getParam(String name, boolean decode) throws UnsupportedEncodingException
	{
		if (decode)
		{
			return URLDecoder.decode(this.postData.get(name), "UTF-8");
		}
		else
		{
			return this.postData.get(name);
		}
	}
}