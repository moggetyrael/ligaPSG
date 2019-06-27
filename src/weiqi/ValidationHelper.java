package weiqi;

import java.io.IOException;
import java.util.regex.Pattern;

import weiqi.models.Group;
import weiqi.models.Settings;

public class ValidationHelper
{
	public static Boolean validateSettings(Settings settings)
	{
		return settings != null;
	}
	
	public static Boolean validateSeason(String season)
	{
		return season != null && Pattern.matches("^\\d+$", season);
	}

	public static Boolean validateGroupName(String groupName)
	{
		return groupName != null && Pattern.matches("^[abeABE]$", groupName);
	}

	public static Boolean validateGroupKeyName(String groupKeyName)
	{
		return groupKeyName != null && Pattern.matches("^\\d+-[abeABE]$", groupKeyName);
	}
	
	public static Boolean validateMatchResult(String result)
	{
		return result != null && Pattern.matches("^[12Dd]?[wW]?$", result);
	}
	
	public static Boolean validateMatchDate(String result)
	{
		return result != null && Pattern.matches("^\\d\\d\\d\\d-\\d\\d-\\d\\d \\d\\d:\\d\\d$", result);
	}
	
	public static Boolean validateLoginName(String opponent)
	{
		return opponent != null && Pattern.matches("^[a-zA-Z0-9]{2,10}$", opponent);
	}
	
	public static Boolean validateEMail(String eMail)
	{
		return eMail != null && Pattern.matches("^.+@.+$", eMail);
	}
	
	public static Boolean validatePlayer(Group group, String opponent)
	{
		String[] players = group.getPlayers();
		return Utilities.indexOf(players, opponent) != -1;
	}
	
	public static void assertSettings(Settings settings) throws IOException
	{
		if (ValidationHelper.validateSettings(settings) == false)
		{
			throw new IOException("Nie uda³o siê pobraæ globalnych ustawieñ witryny.");
		}
	}
	
	public static void assertSeason(String season) throws IOException
	{
		if (ValidationHelper.validateSeason(season) == false)
		{
			throw new IOException("Nieprawid³owy format identyfikatora sezonu '" + season + "'");
		}
	}
	
	public static void assertGroupName(String groupName) throws IOException
	{
		if (ValidationHelper.validateGroupName(groupName) == false)
		{
			throw new IOException("Nieprawid³owy format identyfikatora grupy '" + groupName + "'");
		}
	}
	
	public static void assertGroupKeyName(String groupKeyName) throws IOException
	{
		if (ValidationHelper.validateGroupKeyName(groupKeyName) == false)
		{
			throw new IOException("Nieprawid³owy format klucza grupy '" + groupKeyName + "'");
		}
	}
	
	public static void assertGroup(Group group, String groupSignature) throws IOException
	{
		if (group == null)
		{
			throw new IOException("Nie znaleziono grupy o sygnaturze '" + groupSignature + "'");
		}
	}

	public static void assertMatchResult(String result) throws IOException
	{
		if (ValidationHelper.validateMatchResult(result) == false)
		{
			throw new IOException("Nieprawid³owy format wyniku gry '" + result + "'");
		}
	}

	public static void assertMatchDate(String result) throws IOException
	{
		if (ValidationHelper.validateMatchDate(result) == false)
		{
			throw new IOException("Nieprawid³owy format daty '" + result + "'");
		}
	}

	public static void assertLoginName(String opponent) throws IOException
	{
		if (ValidationHelper.validateLoginName(opponent) == false)
		{
			throw new IOException("Nieprawid³owy format nazwy u¿ytkownika '" + opponent + "'");
		}
	}

	public static void assertEMail(String eMail) throws IOException
	{
		if (ValidationHelper.validateEMail(eMail) == false)
		{
			throw new IOException("Nieprawid³owy format adresu E-Mail '" + eMail + "'");
		}
	}

	public static void assertPlayer(Group group, String opponent) throws IOException
	{
		if (ValidationHelper.validatePlayer(group, opponent) == false)
		{
			throw new IOException("Nie znaleziono u¿ytkownika '" + opponent + "'");
		}
	}
	
	public static void assertAdmin(Context context) throws IOException
	{
		if (context.getUser() == null || context.getUser().isAdmin() == false)
		{
			throw new IOException("Nie jesteœ administratorem");
		}
	}
	
	public static void assertSession(Context context) throws IOException
	{
		if (context.getUser() == null)
		{
			throw new IOException("Nie jesteœ zalogowany");
		}
	}
}