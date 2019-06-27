package weiqi.operations;

import java.util.HashMap;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public class ItemControllerGetContext extends ItemControllerContext
{
	private static Pattern RequestUriPattern = Pattern.compile("^/([a-zA-Z]+)(/([a-zA-Z]+))?$");
	
	public static ItemControllerGetContext TryCreate(HttpServletRequest request, HttpServletResponse response)
	{
		return new ItemControllerGetContext(request, response);
	}
	
	protected Map<String, String> parameters = new HashMap<String, String>();
	
	public ItemControllerGetContext(HttpServletRequest request, HttpServletResponse response) 
	{
		super(request, response);

		Matcher matcher = RequestUriPattern.matcher(request.getRequestURI());
		
		if (matcher.matches())
		{
			
		}
	}

	@Override
	public Map<String, String> getRequestParameters() 
	{
		return null;
	}
}
