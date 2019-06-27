package weiqi;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;

public class SessionManager
{
	private static Map<String, String> sessions = new HashMap<String, String>();
	
	public static String getLoginName(HttpServletRequest request)
	{
		String sessionId = Utilities.getCookieValue(request, "Session");
		
		if (sessionId != null && SessionManager.sessions.containsKey(sessionId))
		{
			return SessionManager.sessions.get(sessionId);
		}
		
		return null;
	}

	public static String register(String loginName) 
	{
		String sessionId = UUID.randomUUID().toString();
		SessionManager.sessions.put(sessionId, loginName);
		return sessionId;
	}
}