package weiqi.operations;

import java.io.IOException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

public abstract class ItemControllerContext
{
	protected HttpServletRequest request;
	protected HttpServletResponse response;
	
	public ItemControllerContext(HttpServletRequest request, HttpServletResponse response) 
	{
		this.request = request;
		this.response = response;
	}
	
	public String getRequestParameterRequired(String parameterName) throws IOException
	{
		Map<String, String> parameters = this.getRequestParameters();
		
		if (parameters.containsKey(parameterName))
		{
			return parameters.get(parameterName);
		}
		else
		{
			throw new IOException("Request parameter '" + parameterName + "' is not specified.");
		}
	}
	
	public abstract Map<String, String> getRequestParameters();
}
