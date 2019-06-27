package weiqi;

import java.io.BufferedReader;
import java.io.IOException;
import java.net.URLDecoder;
import java.util.Arrays;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import weiqi.models.Group;
import weiqi.models.LeagueData;
import weiqi.models.Match;

public class Utilities
{
	public static String getCookieValue(HttpServletRequest request, String name)
	{
		Cookie[] cookies = request.getCookies();
		
		if (cookies != null)
		{
			for (Cookie cookie : cookies)
			{
				if (cookie.getName().equals(name))
				{
					return cookie.getValue();
				}
			}
		}
		
		return null;
	}

	public static String readPostDataAsString(HttpServletRequest request)
	{
		StringBuffer builder = new StringBuffer();
		String line = null;
		
		try 
		{
			BufferedReader reader = request.getReader();
	    
			while ((line = reader.readLine()) != null)
			{
				builder.append(line);
			}
		} 
		catch (Exception e) 
		{ 
			/*report an error*/ 
		}
		
		return builder.toString();
	}
	
	public static Map<String, String> readPostDataAsMap(HttpServletRequest request)
	{
		Map<String, String> map = new HashMap<String, String>();
		String postData = Utilities.readPostDataAsString(request);
		
		for (String keyValuePair : postData.split("&"))
		{
			int index = keyValuePair.indexOf('=');
			
			if (index > 0)
			{
				map.put(keyValuePair.substring(0, index), keyValuePair.substring(index + 1));
			}
		}
		
		return map;
	}
	
	public static Map<String, String> parseQueryString(HttpServletRequest request) throws IOException 
	{
	    Map<String, String> query_pairs = new LinkedHashMap<String, String>();
	    String query = request.getQueryString();
	    String[] pairs = query.split("&");
	    
	    for (String pair : pairs) 
	    {
	        int idx = pair.indexOf("=");
	        query_pairs.put(URLDecoder.decode(pair.substring(0, idx), "UTF-8"), URLDecoder.decode(pair.substring(idx + 1), "UTF-8"));
	    }
	    
	    return query_pairs;
	}

	public static <T> int indexOf(T[] array, T element) 
	{
		if (element == null)
		{
			
		}
		else
		{
			for (int i = 0; i < array.length; i++) 
			{
				if (element.equals(array[i]))
				{
					return i;
				}
			}
		}
		
		return -1;
	}
	
	public static class Text
	{
		public interface Stringifier<T>
		{
			void stringify(StringBuilder builder, T object);
		}
		
		public static Stringifier<String> StringifierString = new Stringifier<String>()
		{
			public void stringify(StringBuilder builder, String value) 
			{
				if (value != null)
				{
					builder.append(value);
				}
			}
		};
		
		public static String join(String[] array, String separator) 
		{
			StringBuilder builder = new StringBuilder();
			Utilities.Text.join(array, separator, builder);
			return builder.toString();
		}
	
		public static <T> void join(String[] array, String separator, StringBuilder builder)
		{
			Utilities.Text.join(array, separator, builder, Text.StringifierString);
		}
		
		public static <T> void join(T[] array, String separator, StringBuilder builder, Stringifier<T> stringifier)
		{
			if (array != null)
			{
				if (array.length > 0)
				{
					stringifier.stringify(builder, array[0]);
					
					for (int i = 1; i < array.length; i++) 
					{
						builder.append(separator);
						stringifier.stringify(builder, array[i]);
					}
				}
			}
		}
	}
	
	public static class Json
	{
		public static Text.Stringifier<String> StringifierString = new Text.Stringifier<String>()
		{
			@Override
			public void stringify(StringBuilder builder, String value)
			{
				Utilities.Json.toJson(builder, value);
			}
		};
		
		public static Text.Stringifier<Match> StringifierMatch = new Text.Stringifier<Match>()
		{
			@Override
			public void stringify(StringBuilder builder, Match value)
			{
				Utilities.Json.toJson(builder, value);
			}
		};
		
		public static Text.Stringifier<Group> StringifierGroup = new Text.Stringifier<Group>()
		{
			@Override
			public void stringify(StringBuilder builder, Group value)
			{
				Utilities.Json.toJson(builder, value);
			}
		};

		public static String toJson(Match match)
		{
			StringBuilder builder = new StringBuilder();
			Utilities.Json.toJson(builder, match);
			return builder.toString();
		}

		public static String toJson(LeagueData league)
		{
			StringBuilder builder = new StringBuilder();
			builder.append("{");
			builder.append("\"CurrentSeason\": \"").append(league.settings.getCurrentSeason()).append("\", \r\n");
			builder.append("\"Groups\": ");
			Utilities.Json.toJson(builder, league.groups.toArray(new Group[] { }), Utilities.Json.StringifierGroup);
			//Utilities.Json.toJson(builder, match);
			builder.append(", \r\n");
			builder.append("\"PlayersJoinedToEliminations\": ");
			Utilities.Json.toJson(builder, league.playersJoinedToEliminations);
			builder.append("}");
			return builder.toString();
		}

		public static String toJson(Group group)
		{
			StringBuilder builder = new StringBuilder();
			Utilities.Json.toJson(builder, group);
			return builder.toString();
		}

		public static void toJson(StringBuilder builder, Group group)
		{
			if (group == null)
			{
				builder.append("null");
			}
			else
			{
				String[] players = group.getPlayers();
				Match[] matches = group.getMatches();
				
				builder.append("{");
				builder.append("\"KeyName\": \"").append(group.getEntity().getKey().getName()).append("\", \r\n");
				builder.append("\"Players\": ");
				Utilities.Json.toJson(builder, players);
				builder.append(",\r\n");
				builder.append("\"Model\": ").append(group.getModel()).append(", \r\n");
				builder.append("\"Matches\": \r\n");
				Utilities.Json.toJson(builder, matches);
				builder.append("\r\n");
				builder.append("}");
			}
		}
		
		public static void toJson(StringBuilder builder, String[] values)
		{
			Utilities.Json.toJson(builder, values, Utilities.Json.StringifierString);
		}
		
		public static void toJson(StringBuilder builder, Match[] values)
		{
			Utilities.Json.toJson(builder, values, Utilities.Json.StringifierMatch);
		}

//		private static String matchResultToJson(String matchResult)
//		{
//			if (matchResult == "")
//			{
//				return "null";
//			}
//			else
//			{
//				return "{\"Result\": \"" + matchResult + "\"}";
//			}
//		}
		
		public static void toJson(StringBuilder builder, Match value)
		{
			builder.append("{ ");
			builder.append("\"Id\": \"").append(value.getId()).append("\", ");
			builder.append("\"Player1\": \"").append(value.getPlayer1()).append("\", ");
			builder.append("\"Player2\": \"").append(value.getPlayer2()).append("\", ");
			builder.append("\"Result\": \"").append(value.getResult()).append("\", ");
			builder.append("\"Result1\": \"").append(value.getResult1()).append("\", ");
			builder.append("\"Result2\": \"").append(value.getResult2()).append("\", ");
			builder.append("\"Url\": \"").append(value.getUrl()).append("\", ");
			builder.append("\"Url1\": \"").append(value.getUrl1()).append("\", ");
			builder.append("\"Url2\": \"").append(value.getUrl2()).append("\", ");
			builder.append("\"Date\": \"").append(value.getDate()).append("\", ");
			builder.append("\"Date1\": \"").append(value.getDate1()).append("\", ");
			builder.append("\"Date2\": \"").append(value.getDate2()).append("\" ");
			builder.append(" }");
		}
		
		public static void toJson(StringBuilder builder, String value)
		{
			if (value == null)
			{
				builder.append("null");
			}
			else
			{
				builder.append("\"").append(value.replace("\"", "\\\"")).append("\"");
			}
		}

		public static <T> void toJson(StringBuilder builder, T[] values, Text.Stringifier<T> stringifier)
		{
			if (values == null)
			{
				builder.append("null");
			}
			else
			{
				builder.append("[ ");
				Text.join(values, ", ", builder, stringifier);
				builder.append(" ]");
			}
		}
	}
}
