package weiqi.models;

import java.util.LinkedList;
import java.util.List;

public class LeagueData 
{
	public Settings settings;
	public List<Group> groups = new LinkedList<Group>();
	public String[] playersJoinedToEliminations;
}
