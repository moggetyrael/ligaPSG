package weiqi;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.logging.Logger;

import javax.servlet.http.*;

import weiqi.models.EntityManager;
import weiqi.models.Group;
import weiqi.models.LeagueData;
import weiqi.models.Match;
import weiqi.models.Settings;
import weiqi.operations.AdminController;
import weiqi.operations.ItemController;
import weiqi.operations.ItemControllerGetContext;
import weiqi.operations.LeagueController;
import weiqi.operations.SignInOperation;

@SuppressWarnings("serial")
public class MainServlet extends HttpServlet 
{
	public static final Logger Log = Logger.getLogger(MainServlet.class.getName());

	private static Pattern GroupUriPattern = Pattern.compile("^/season/(\\d+)/group/([a-zA-Z])$");
	private static Pattern DataUriCallbackNamePattern = Pattern.compile("^[a-zA-Z_]+[0-9_]+$");
	
	public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException 
	{
		Context context = new Context(this, request, response);
		ItemControllerGetContext itemContext;
		
		try
		{
			Matcher matcher = GroupUriPattern.matcher(request.getRequestURI());
			
			if (matcher.matches())
			{
				this.getGroup(matcher, request, response);
			}
			else if (request.getRequestURI().startsWith("/getData"))
			{
				this.getData(request, response);
			}
			else if (request.getRequestURI().startsWith("/getGroupData"))
			{
				this.getGroupData(request, response);
			}
			else if ((itemContext = ItemControllerGetContext.TryCreate(request, response)) != null)
			{
				new ItemController(itemContext).get();
			}
			else
			{
				response.getWriter().println(request.getRequestURI());
				response.setStatus(HttpServletResponse.SC_NOT_FOUND);
			}
		}
		catch (Exception exception)
		{
			this.sendException(response, exception);
		}
	}

	public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException 
	{
		Context context = new Context(this, request, response);
		response.setContentType("text/plain");
		response.setCharacterEncoding("UTF-8");
		
		try
		{
			switch (request.getRequestURI())
			{
				case "/saveMatch":
					new LeagueController(context).saveMatch();
					break;
				case "/saveProposal":
					new LeagueController(context).saveProposal();
					break;
				case "/removeProposal":
					new LeagueController(context).removeProposal();
					break;
				case "/acceptProposal":
					new LeagueController(context).acceptProposal();
					break;
				case "/signIn":
					new SignInOperation(context).execute();
					break;
				case "/addUser":
					new AdminController(context).addUser();
					break;
				case "/sendPassword":
					new AdminController(context).sendPassword();
					break;
				case "/addUsers":
					new AdminController(context).addUsers();
					break;
				case "/setUserPassword":
					new AdminController(context).setUserPassword();
					break;
				case "/setUserEMail":
					new AdminController(context).setUserEMail();
					break;
				case "/addGroup":
					new AdminController(context).addGroup();
					break;
				case "/setGroupPlayers":
					new AdminController(context).setGroupPlayers();
					break;
				case "/setCurrentSeason":
					new AdminController(context).setCurrentSeason();
					break;
				case "/setGroupModel":
					new AdminController(context).setGroupModel();
					break;
				case "/sendNotification":
					new AdminController(context).sendNotification();
					break;
				case "/joinToEliminations":
					new LeagueController(context).joinToEliminations();
					break;
				case "/unjoinFromEliminations":
					new LeagueController(context).unjoinFromEliminations();
					break;
				default:
					response.getWriter().println(request.getRequestURI());
					response.setStatus(HttpServletResponse.SC_NOT_FOUND);
					break;
			}
		}
		catch (Exception exception)
		{
			this.sendException(response, exception);
		}
	}
	
	protected void sendException(HttpServletResponse response, Exception exception) throws IOException
	{
		String errorMessage = exception.getMessage();
		
		if (errorMessage == null)
		{
			errorMessage = "";
		}
		else
		{
			errorMessage = URLEncoder.encode(exception.getMessage(), "UTF-8").replace("+", "%20");
		}

		response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR, errorMessage);
	}

	private void getData(HttpServletRequest request, HttpServletResponse response) throws IOException 
	{
		String loginName = SessionManager.getLoginName(request);
		LeagueData data = new LeagueData();
		data.settings = Settings.getGlobal();
		//data.userRole = EntityManager.getUserRole(loginName);
		//String season = matcher.group(1);
		//String groupName = matcher.group(2);
		
		ValidationHelper.assertSettings(data.settings);
		
		data.groups.add(EntityManager.getGroup(data.settings.getCurrentSeason(), "a"));
		data.groups.add(EntityManager.getGroup(data.settings.getCurrentSeason(), "b"));
		data.groups.add(EntityManager.getGroup(data.settings.getCurrentSeason(), "e"));
		data.playersJoinedToEliminations = data.settings.getPlayersJoinedToEliminations();

		String callbackName = request.getParameter("callback");

		if (callbackName != null && DataUriCallbackNamePattern.matcher(callbackName).matches())
		{
			response.setContentType("text/javascript");
			response.getWriter().print(callbackName + "(" + Utilities.Json.toJson(data) + ")");
		}
		else
		{
			response.getWriter().print(Utilities.Json.toJson(data));
		}
	}

	private void getGroupData(HttpServletRequest request, HttpServletResponse response) throws IOException 
	{
		String groupSignature = request.getParameter("Group");

		ValidationHelper.assertGroupKeyName(groupSignature);
		
		Group group = EntityManager.getGroup(groupSignature);
		
		if (group != null)
		{
			response.getWriter().print(Utilities.Json.toJson(group));
		}
	}
	
	private void getGroup(Matcher matcher, HttpServletRequest request, HttpServletResponse response) throws IOException 
	{
		String season = matcher.group(1);
		String groupName = matcher.group(2);
		
		ValidationHelper.assertSeason(season);
		ValidationHelper.assertGroupName(groupName);

		Group group = EntityManager.getGroup(season, groupName);
		ValidationHelper.assertGroup(group, Group.getKeyName(season, groupName));
		
		/*String modifiedSince = request.getHeader("If-Modified-Since");
		Date modified = group.lastModified();
		long modifiedSinceTicks;
		
		if (modified != null && modifiedSince != null)
		{
			try
			{
				modifiedSinceTicks = Long.parseLong(modifiedSince);
			}
			catch (Exception e)
			{
				modifiedSinceTicks = 0;
			}
	
			if (modifiedSinceTicks >= modified.getTime())
			{
				response.setHeader("Last-Modified", String.valueOf(modified.getTime()));
				response.setStatus(HttpServletResponse.SC_NOT_MODIFIED);
				return;
			}
		}*/
		
		//Match[] matches = group.getMatches();
		//response.getWriter().print(Utilities.Json.toJson(group));
		
		/*if (modified != null)
		{
			response.setHeader("Last-Modified", String.valueOf(modified.getTime()));
		}*/
	}
	
	private static SimpleDateFormat DateFormat = new SimpleDateFormat("EEE MMM dd HH:mm:ss zzz yyyy");
	
	private static Map<String, String> Cache = new HashMap<String, String>();
	
}
