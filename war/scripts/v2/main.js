
var Utilities = 
{
	GetCookie: function(name)
	{
		var ca = document.cookie.split(';');
		for (var i=0; i < ca.length; i++) 
		{
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1);
			if (c.indexOf((name + "=")) == 0) return c.substring((name + "=").length,c.length);
		}
		return "";
	},
	
	GetElementIndex: function(element)
	{
		for (var i=0; i < element.parentNode.children.length; i++)
		{
			if (element.parentNode.children[i] == element)
			{
				return i;
			}
		}
		return -1;
	},
	
	GetClosest: function(element, name)
	{
		while (element.nodeName.toUpperCase() != name.toUpperCase()) { element = element.parentNode; }
		return element;
	},
	
	SendRequestAsync: function(method, action, data, handler)
	{
		if (window.XMLHttpRequest)
		{
			var request = new XMLHttpRequest();
		}
		else
		{
			var request = new ActiveXObject("Microsoft.XMLHTTP");
		}
		var stateChangeHandler = function () 
		{
			if (this.readyState == 4)
			{
				if (this.status == 200)
				{
					this.Handler.OnSuccess(this);
				}
				else
				{
					this.Handler.OnError(this);
				}
			}
		};
		
		if (method == 'POST')
		{
			request.Handler = handler;
			request.open("POST", action, true);
			request.onreadystatechange = stateChangeHandler;
			request.setRequestHeader("Content-type", "text/plain");
			request.send(data);
		}
		else
		{
			request.Handler = handler;
			request.open("GET", data == null ? action : (action + '?' + data), true);
			request.onreadystatechange = stateChangeHandler;
			request.setRequestHeader("Content-type", "text/plain");
			request.send();
		}
	}
}

function ResultsTable(containerId)
{
	this.Container = document.getElementById(containerId);
	this.Container.ResultsTable = this;
	
	this.SetGroupData = function (group)
	{
		this.Container.Group = group;
	}
	
	this.Render = function ()
	{
		
		//var headerRow = document.createElement("tr");
		//var headerPlace = document.createElement("td");
		//headerPlace.textContent = 'Place';
		//headerRow.appendChild(headerPlace);
		//var headerPlayer = document.createElement("td");
		//headerPlayer.textContent = 'Player';
		//headerRow.appendChild(headerPlayer);
		//var headerScore = document.createElement("td");
		//headerScore.textContent = 'Score';
		//headerRow.appendChild(headerScore);
		//var headerSeparator = document.createElement("td");
		//headerSeparator.setAttribute('class', 'separator');
		//headerRow.appendChild(headerSeparator);
		//
		//for (var j = 0; j < this.Container.Group.Data.Players.length; j++)
		//{
		//	var headerCell = document.createElement("td");
		//	headerCell.innerHTML = '<div>' + this.Container.Group.Data.Players[j].replace(' ', '&nbsp;') + '</div>';
		//	headerCell.setAttribute('class', 'player');
		//	headerRow.appendChild(headerCell);
		//}
		//
		//var header = document.createElement("tbody");
		//header.appendChild(headerRow);
		//var body = document.createElement("tbody");
		//
		var header = document.createElement("tbody");
		var row; //= document.createElement("tr");
		header.innerHTML = '<tr><td>Miejsce</td><td>Gracz</td><td>Punkty</td><td>Mecze</td></tr>';
		var table = document.createElement("table");
		table.appendChild(header);
		
		for (var j = 0; j < this.Container.Group.Data.Players.length; j++)
		{
			row = document.createElement("tr");
			row.innerHTML = '<td>-</td><td>' + this.Container.Group.Data.Players[j] + '</td><td>-</td><td>-</td>';
			table.appendChild(row);
		}
		
		table.setAttribute('class', 'matches');
		//resultsTable.appendChild(header);
		//resultsTable.appendChild(body);
		this.Container.innerHTML = '';
		this.Container.appendChild(table);
		this.Refresh();
	}
	
	this.Refresh = function ()
	{
		for (var i = 0; i < this.Container.Group.Data.Players.length; i++)
		{
			this.Container.Group.Data.Played[i] = 0;
			this.Container.Group.Data.Scores[i] = 0;
		}
		
		for (var i = 0; i < this.Container.Group.Data.Players.length; i++)
		{
			for (var j = i + 1; j < this.Container.Group.Data.Players.length; j++)
			{
				var result = this.Container.Group.GetResult(i, j);
				
				if (result.Value)
				{
					this.Container.Group.Data.Played[i]++;
					this.Container.Group.Data.Played[j]++;
					
					if (result.Value == '1')
					{
						this.Container.Group.Data.Scores[i] += 2;
					}
					else if (result.Value == '2')
					{
						this.Container.Group.Data.Scores[j] += 2;
					}
					else
					{
						this.Container.Group.Data.Scores[i]++;
						this.Container.Group.Data.Scores[j]++;
					}
				}
			}
		}
		
		var table = this.Container.children[0];
		
		for (var i = 0; i < this.Container.Group.Data.Players.length; i++)
		{
			table.children[i + 1].children[2].textContent = this.Container.Group.Data.Scores[i];
			table.children[i + 1].children[3].textContent = this.Container.Group.Data.Played[i];
		//row.innerHTML = '<td>' + this.Container.Group.Data.Places[j] + '</td><td>' + this.Container.Group.Data.Players[j] + '</td><td>' + this.Container.Group.Data.Scores[j] + '</td><td>' + this.Container.Group.Data.Played[j] + '</td>';
				
		}
		
		var rows = [];
		
		while (table.children.length > 1)
		{
			rows.push(table.removeChild(table.children[1]));
		}
		
		var that = this;
		var sortFunction = function (a, b)
		{
			var player1 = that.Container.Group.GetPlayerIndex(a.children[1].textContent);
			var player2 = that.Container.Group.GetPlayerIndex(b.children[1].textContent);
			console.log(player1 + ': ' + that.Container.Group.Data.Scores[player1]);
			console.log(player2 + ': ' + that.Container.Group.Data.Scores[player2]);
			var d = that.Container.Group.Data.Scores[player2] - that.Container.Group.Data.Scores[player1];
			if (d == 0)
			{
				d = (a.children[1].textContent.toUpperCase() > b.children[1].textContent.toUpperCase()) ? 1 : -1;
			}
			return d;
		};
		
		rows.sort(sortFunction);
		
		for (var i = 0; i < rows.length; i++)
		{
			table.appendChild(rows[i]);
		}
	}
}

function GroupData(data)
{
	this.Data = data;
	
	this.GetPlayerIndex = function (player)
	{
		for (var i = 0; i < this.Data.Players.length; i++)
		{
			if (this.Data.Players[i] == player)
			{
				return i;
			}
		}
		
		return -1;
	}
	
	this.GetDate = function(i, j)
	{
		if (this.Data.Matches[i][j - i - 1])
		{
			return this.Data.Matches[i][j - i - 1].Date;
		}
		else
		{
			return '';
		}
	}
	
	this.GetDate1 = function(i, j)
	{
		return this.Data.Matches[i][j - i - 1].Date1;
	}
	
	this.GetResult1 = function(i, j)
	{
		if (this.Data.Matches[i][j - i - 1])
		{
			return this.GetResultInternal(this.Data.Matches[i][j - i - 1].Result1);
		}
		else
		{
			return 'brak';
		}
	}
	
	this.GetResult2 = function(i, j)
	{
		if (this.Data.Matches[i][j - i - 1])
		{
			return this.GetResultInternal(this.Data.Matches[i][j - i - 1].Result2);
		}
		else
		{
			return 'brak';
		}
	}
	
	this.GetResult = function(i, j)
	{
		if (this.Data.Matches[i][j - i - 1])
		{
			var result = this.GetResultInternal(this.Data.Matches[i][j - i - 1].Result);
		}
		else
		{
			var result = null;
		}
		
		if (result)
		{
			return { Value: result, Approved: true };
		}
		else
		{
			var result1 = this.GetResult1(i, j);
			var result2 = this.GetResult2(i, j);
			if (result1 == result2) { result = result1; }
		}
		
		return { Value: result, Approved: false };
	}
	
	this.GetResultInternal = function(result)
	{
		if (result && result.Result)
		{
			return result.Result;
		}
		
		return '';
	}
	
	this.SetResult1 = function(i, j, result)
	{
		if (typeof this.Data.Matches[i][j - i - 1].Result1 != 'object' || this.Data.Matches[i][j - i - 1].Result1 == null)
		{
			this.Data.Matches[i][j - i - 1].Result1 = { Url: "", Result: "" };
		}
		
		this.Data.Matches[i][j - i - 1].Result1.Result = result;
	}
	
	this.SetResult2 = function(i, j, result)
	{
		if (typeof this.Data.Matches[i][j - i - 1].Result2 != 'object' || this.Data.Matches[i][j - i - 1].Result2 == null)
		{
			this.Data.Matches[i][j - i - 1].Result2 = { Url: "", Result: "" };
		}
		
		this.Data.Matches[i][j - i - 1].Result2.Result = result;
	}
	
	this.GetMatchesBeetwen = function (i, j)
	{
		//var matches = [];
		//for (var i = 0; i < this.Data.Matches.length; i++)
		//{
		//	if (this.Data.Matches[i].Black == player1 && this.Data.Matches[i].White == player2)
		//	{
		//		matches.push(this.Data.Matches[i]);
		//	}
		//	else if (this.Data.Matches[i].Black == player2 && this.Data.Matches[i].White == player1)
		//	{
		//		matches.push(this.Data.Matches[i]);
		//	}
		//}
		//return matches;
	}

	this.Refresh = function()
	{
	}		
}

function MatchList(containerId)
{
	this.Container = document.getElementById(containerId);
	this.Container.MatchList = this;
	
	this.SetGroupData = function (group)
	{
		this.Container.Group = group;
	}
	
	this.EditProposal = function(sender)
	{
		Utilities.GetClosest(sender, 'td').children[0].setAttribute('style', 'display: none;');
		Utilities.GetClosest(sender, 'td').children[1].setAttribute('style', 'display: none;');
		Utilities.GetClosest(sender, 'td').children[2].setAttribute('style', 'display: none;');
		Utilities.GetClosest(sender, 'td').children[3].setAttribute('style', '');
	}
	
	this.RemoveProposal = function(sender)
	{
		var match = this.GetMatchFromElement(sender);
		if (match.Player1 == this.Username) { match.Date1 = ''; }
		else if (match.Player2 == this.Username) { match.Date2 = ''; }
		this.UpdateRow(Utilities.GetClosest(sender, 'tr'));
	}
	
	this.SaveProposal = function(sender)
	{
		var date = Utilities.GetClosest(sender, 'div').children[0].value;
		var match = this.GetMatchFromElement(sender);
		if (match.Player1 == this.Username) { match.Date1 = date; }
		else if (match.Player2 == this.Username) { match.Date2 = date; }
		this.UpdateRow(Utilities.GetClosest(sender, 'tr'));
		Utilities.GetClosest(sender, 'td').setAttribute('class', 'proposal');
	}
	
	this.AcceptProposal = function(sender)
	{
		var row = Utilities.GetClosest(sender, 'tr');
		var match = this.GetMatchFromElement(sender);
		var player1 = this.Container.Group.GetPlayerIndex(match.Player1);
		var player2 = this.Container.Group.GetPlayerIndex(match.Player2);
		if (match.Player1 == this.Username)
		{
			match.Date = match.Date2;
			match.Date2 = '';
		}
		else
		{
			match.Date = match.Date1;
			match.Date1 = '';
		}
		this.UpdateRow(row);
		Utilities.GetClosest(sender, 'td').setAttribute('class', 'proposal');
	}
	
	this.EditMatchResult = function (sender)
	{
		sender.parentNode.children[0].setAttribute('style', 'display: none;');
		sender.parentNode.children[1].setAttribute('style', 'display: block;');
	}
	
	this.SaveMatchResult = function (sender)
	{
		var row = Utilities.GetClosest(sender, 'tr');
		var cell = Utilities.GetClosest(sender, 'td');
		//var player1 = row.children[0].textContent;
		//var player2 = row.children[1].textContent;
		var player1 = this.Container.Group.GetPlayerIndex(this.GetPlayer1Name(row));
		var player2 = this.Container.Group.GetPlayerIndex(this.GetPlayer2Name(row));
		
		if (Utilities.GetElementIndex(cell) == 1)
		{
			this.Container.Group.SetResult1(player1, player2, cell.children[1].children[0].value);
		}
		else
		{
			this.Container.Group.SetResult2(player1, player2, cell.children[1].children[0].value);
		}
		
		this.UpdateRow(row);
		//cell.setAttribute('class', 'result display');
		cell.children[0].setAttribute('style', 'display: block;');
		cell.children[1].setAttribute('style', 'display: none;');
	}
	
	this.ShowAll = function ()
	{
		var table = this.Container.children[0].children[1];
		this.Sort();
		
		for (var i = 0; i < table.children.length; i++)
		{
			table.children[i].setAttribute('style', 'display: table-row;');
		}
	}
	
	this.ShowMy = function ()
	{
		var table = this.Container.children[0].children[1];
		this.Sort();
		
		for (var i = 0; i < table.children.length; i++)
		{
			var player1Name = this.GetPlayer1Name(table.children[i]);
			var player2Name = this.GetPlayer2Name(table.children[i]);
			
			if (this.Username == player1Name || this.Username == player2Name)
			{
				table.children[i].setAttribute('style', 'display: table-row;');
			}
			else
			{
				table.children[i].setAttribute('style', 'display: none;');
			}
		}
	}
	
	this.Sort = function ()
	{
		var table = this.Container.children[0].children[1];
		var rows = [];
		
		while (table.children.length)
		{
			rows.push(table.removeChild(table.children[0]));
		}
		
		var that = this;
		var sortFunction = function (a, b)
		{
			if (that.HasResult(a))
			{
				return -1;
			}
			else if (that.HasResult(b))
			{
				return 1;
			}
			else if (that.HasDate(a))
			{
				return -1;
			}
			else if (that.HasDate(b))
			{
				return 1;
			}
			else
			{
				return 1;
			}
		};
		
		rows.sort(sortFunction);
		
		for (var i = 0; i < rows.length; i++)
		{
			table.appendChild(rows[i]);
		}
	}
	
	this.HasResult = function (row)
	{
		var player1Name = this.GetPlayer1Name(row);
		var player2Name = this.GetPlayer2Name(row);
		var player1 = this.Container.Group.GetPlayerIndex(player1Name);
		var player2 = this.Container.Group.GetPlayerIndex(player2Name);
		var result = this.Container.Group.GetResult(player1, player2);
		
		return result.Value;
	}
	
	this.HasDate = function (row)
	{
		var player1Name = this.GetPlayer1Name(row);
		var player2Name = this.GetPlayer2Name(row);
		var player1 = this.Container.Group.GetPlayerIndex(player1Name);
		var player2 = this.Container.Group.GetPlayerIndex(player2Name);
		return this.Container.Group.GetDate(player1, player2);
	}
		
	this.GetPlayer1Name = function (row)
	{
		return row.children[0].textContent;
	}
	
	this.GetPlayer2Name = function (row)
	{
		return row.children[2].textContent;
	}
		
	this.UpdateRow = function (row)
	{
		var player1Name = this.GetPlayer1Name(row);
		var player2Name = this.GetPlayer2Name(row);
		var player1 = this.Container.Group.GetPlayerIndex(player1Name);
		var player2 = this.Container.Group.GetPlayerIndex(player2Name);
		var result = this.Container.Group.GetResult(player1, player2);
		
		if (result.Approved)
		{
			if (result.Value == '1') { row.setAttribute('class', 'played approved won1'); }
			else if (result.Value == '2') { row.setAttribute('class', 'played approved won2'); }
			else if (result.Value == 'D') { row.setAttribute('class', 'played approved draw'); }
		}
		else
		{
			if (result.Value == '1') { row.setAttribute('class', 'played won1'); }
			else if (result.Value == '2') { row.setAttribute('class', 'played won2'); }
			else if (result.Value == 'D') { row.setAttribute('class', 'played draw'); }
		}
		
		//row.children[2].textContent = League.UI.Text.GetResultText(result.Value);
		
		if (result.Approved)
		{
			row.children[1].children[0].textContent = '';
			row.children[3].children[0].textContent = '';
			//row.children[5].textContent = '';
		}
		else
		{
			var result1 = this.Container.Group.GetResult1(player1, player2);
			row.children[1].children[0].textContent = League.UI.Text.GetPlayerResultText(result1, 1, player1Name == this.Username);
			var result2 = this.Container.Group.GetResult2(player1, player2);
			row.children[3].children[0].textContent = League.UI.Text.GetPlayerResultText(result2, 2, player2Name == this.Username);
			var date = this.Container.Group.GetDate(player1, player2);
			row.children[4].textContent = date;
						
			if (date && !result.Value)
			{
				row.setAttribute('class', 'scheduled');
			}
			
			if (player1Name == this.Username || player2Name == this.Username)
			{
				if (player1Name == this.Username)
				{
					var opponentDate = this.Container.Group.Data.Matches[player1][player2 - player1 - 1].Date2;
				}
				else
				{
					var opponentDate = this.Container.Group.Data.Matches[player1][player2 - player1 - 1].Date1;
				}
				if (opponentDate)
				{
					//row.children[6].children[0].setAttribute('class', 'set');
					row.children[5].children[0].children[0].textContent = opponentDate;
				}
				else
				{
					row.children[5].children[0].setAttribute('style', 'display: none;');
					//row.children[6].children[0].children[0].textContent = opponentDate;
				}
				if (player1Name == this.Username)
				{
					var ownDate = this.Container.Group.Data.Matches[player1][player2 - player1 - 1].Date1;
				}
				else
				{
					var ownDate = this.Container.Group.Data.Matches[player1][player2 - player1 - 1].Date2;
				}
				if (ownDate)
				{
					//row.children[6].children[1].setAttribute('class', 'set');
					//row.children[6].children[2].setAttribute('class', '');
					row.children[5].children[1].children[0].textContent = ownDate;
					row.children[5].children[1].setAttribute('style', '');
					row.children[5].children[2].setAttribute('style', 'display: none;');
				}
				else
				{
					//row.children[6].children[1].setAttribute('class', '');
					//row.children[6].children[2].setAttribute('class', 'set');
					//row.children[6].children[1].children[0].textContent = ownDate;
					row.children[5].children[1].setAttribute('style', 'display: none;');
					row.children[5].children[2].setAttribute('style', '');
				}
					
				row.children[5].children[3].setAttribute('style', 'display: none;');
			}
		}	
	}
	
	this.GetMatchFromElement = function (sender)
	{
		var row = Utilities.GetClosest(sender, 'tr');
		var player1 = this.Container.Group.GetPlayerIndex(this.GetPlayer1Name(row));
		var player2 = this.Container.Group.GetPlayerIndex(this.GetPlayer2Name(row));
		return this.Container.Group.Data.Matches[player1][player2 - player1 - 1];
	}
	
	this.Render = function ()
	{
		try
		{
			this.Username = Utilities.GetCookie('LoginName');
			var header = document.createElement("tbody");
			var headerRow = document.createElement("tr");
			headerRow.innerHTML = '<td>Gracz 1</td><td></td><td>Gracz 2</td><td></td><td>Uzgodniona data</td><td></td>';
			header.appendChild(headerRow);
			var body = document.createElement("tbody");
			
			for (var i = 0; i < this.Container.Group.Data.Players.length; i++)
			{
				for (var j = i + 1; j < this.Container.Group.Data.Players.length; j++)
				{
					body.appendChild(this.RenderRow(i, j));
				}
			}
			
			var resultsTable = document.createElement("table");
			resultsTable.setAttribute('class', 'matches');
			resultsTable.appendChild(header);
			resultsTable.appendChild(body);
			this.Container.innerHTML = '';
			this.Container.appendChild(resultsTable);
		}
		catch (exception)
		{
			alert('Błąd przy renderowaniu listy gier. ' + exception);
		}
	}
	
	this.RenderRow = function (i, j)
	{
		var row = document.createElement("tr");
		var cell;
		cell = document.createElement("td");
		cell.textContent = this.Container.Group.Data.Players[i];
		row.appendChild(cell);
		row.appendChild(this.RenderResultEditCell(i, j, i));
		cell = document.createElement("td");
		cell.textContent = this.Container.Group.Data.Players[j];
		row.appendChild(cell);
		row.appendChild(this.RenderResultEditCell(i, j, j));
		row.appendChild(document.createElement("td"));
		row.appendChild(this.RenderDateEditCell(i, j, j));
		//row.appendChild(League.UI.CreateMatchListResultCell(group, i, j, username));
		this.UpdateRow(row);
		return row;
	}
	
	this.RenderResultEditCell = function (i, j, k)
	{
		var cell = document.createElement("td");
		if (this.Container.Group.Data.Players[k] == this.Username)
		{
			cell.innerHTML = '<div class="editable" onclick="League.UI.Handlers.OnClickEditMatchResult(this);">brak</div><div style="display: none;"><select><option value=""></option><option value="1">Gracz 1</option><option value="2">Gracz 2</option><option value="D">Remis</option></select>&nbsp;<input type="button" value="Zapisz" onclick="League.UI.Handlers.OnClickSaveMatchResult(this);" /></div>';
		}
		else
		{
			cell.innerHTML = '<div>brak</div>';
		}
		return cell;
	}
	
	this.RenderDateEditCell = function (i, j, k)
	{
		var cell = document.createElement("td");
		cell.setAttribute('class', 'proposal display');
		var row;
		
		if (this.Container.Group.Data.Players[i] == this.Username || this.Container.Group.Data.Players[j] == this.Username)
		{
			//if (i == k)
			//{
			//	var ownDate = this.Container.Group.Data.Matches[i][j - i - 1].Date1;
			//	var opponentDate = this.Container.Group.Data.Matches[i][j - i - 1].Date2;
			//}
			//else
			//{
			//	var ownDate = this.Container.Group.Data.Matches[i][j - i - 1].Date2;
			//	var opponentDate = this.Container.Group.Data.Matches[i][j - i - 1].Date1;
			//}
			
			row = document.createElement("div");
			row.innerHTML = '<span></span> <a href="#" onclick="League.UI.Handlers.OnClickAcceptProposal(this); return false;">Akceptuj</a>';
			cell.appendChild(row);
			row = document.createElement("div");
			row = document.createElement("div");
			row.innerHTML = '<span></span> <a href="#gt" onclick="League.UI.Handlers.OnClickRemoveProposal(this); return false;">Usuń</a>';
			cell.appendChild(row);
			row = document.createElement("div");
			row = document.createElement("div");
			row.innerHTML = '<span></span> <a href="#" onclick="League.UI.Handlers.OnClickEditProposal(this); return false;">Zaproponuj</a>';
			cell.appendChild(row);
			row = document.createElement("div");
			row = document.createElement("div");
			row.innerHTML = '<input />&nbsp;<input type="button" value="Zapisz" onclick="League.UI.Handlers.OnClickSaveProposal(this);">';
			row.setAttribute('style', 'display: none;');
			cell.appendChild(row);
			//row = document.createElement("div");
		}
		return cell;
	}
};

MatchList.FromElement = function(element)
{
	while (typeof element.MatchList != 'object') { element = element.parentNode }
	return element.MatchList;
};

var League = 
{
	Services:
	{
		SignIn: function (loginName, password, succesCallback, errorCallback)
		{
			var handler = {
				SuccessCallback: succesCallback,
				ErrorCallback: errorCallback,
				Action: '/getGroup',
				OnSuccess: function (request) 
				{
					this.SuccessCallback();
				},
				OnError: function (request) 
				{
					this.ErrorCallback('Wystąpił błąd podczas logowania: ' + request.statusText);
				},
			};
			Utilities.SendRequestAsync('POST', '/signIn', 'LoginName=' + loginName + '&Password=' + password, handler);
			//document.cookie = "SessionId=abc; expires=0; path=/";
			//document.cookie = "Username=" + username + "; expires=0; path=/";
			//document.cookie = "SessionId=abc";
			//document.cookie = "Username=" + username + ";";
			//return true;
		},
		GetGroup: function (season, groupName, succesCallback, errorCallback)
		{
			var handler = {
				SuccessCallback: succesCallback,
				ErrorCallback: errorCallback,
				Season: season,
				GroupName: groupName,
				Action: '/getGroup',
				OnSuccess: function (request) 
				{
					var data = JSON.parse(request.responseText);
					data.Season = this.Season;
					data.GroupName = this.GroupName;
					data.Places = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
					data.Scores = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
					data.Played = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
					var matches = [[null,null,null,null,null,null,null], [null,null,null,null,null,null], [null,null,null,null,null], [null,null,null,null], [null,null,null], [null,null], [null]];
					for (var i = 0; i < data.Matches.length; i++)
					{
						var index1 = data.Players.indexOf(data.Matches[i].Player1);
						var index2 = data.Players.indexOf(data.Matches[i].Player2);
						
						if (index1 == -1 || index2 == -1)
						{
						}
						else
						{
							matches[index1][index2 - index1 - 1] = data.Matches[i];
						}
					}					
					for (var i = 0; i < data.Players.length; i++)
					{
						for (var j = i + 1; j < data.Players.length; j++)
						{
							if (matches[i][j - i - 1] == null)
							{
								matches[i][j - i - 1] = {Player1: data.Players[i], Player2: data.Players[j], Result: "", Result1: "", Result2: "", Date: "", Date1: "", Date2: "", Link: ""};
							}
						}
					}
					data.Matches = matches;
					this.SuccessCallback(data);
				},
				OnError: function (request) 
				{
					this.ErrorCallback('Wystąpił błąd podczas pobierania danych: ' + request.statusText);
				},
			};
			Utilities.SendRequestAsync('GET', '/group/' + season + '/' + groupName, null, handler);
		},
		SaveMatchResult: function(season, groupName, player1, player2, result, succesCallback, errorCallback)
		{
			var handler = { 
				SuccessCallback: succesCallback,
				ErrorCallback: errorCallback,
				Action: '/saveMatchResult',
				OnSuccess: function (request) {
					this.SuccessCallback();
				},
				OnError: function (request) {
					this.ErrorCallback('Wystąpił błąd podczas zapisywania wyniku: ' + request.statusText);
				}
			};
			Utilities.SendRequestAsync('POST', '/saveMatchResult', 'Season=' + season + '&Group=' + groupName + '&Player1=' + player1 + '&Player2=' + player2 + '&Result=' + result, handler);
		},
		DoProposalOperation: function(action, data, succesCallback, errorCallback)
		{
			var handler = { 
				SuccessCallback: succesCallback,
				ErrorCallback: errorCallback,
				Action: action,
				OnSuccess: function (request) {
					this.SuccessCallback();
				},
				OnError: errorCallback
			};
			Utilities.SendRequestAsync('POST', action, data, handler);
		}
	},
	UI:
	{
		Controls:
		{
			ResultsTable: null,
			MatchList: null,
			CurrentView: null
		},
		Validation:
		{
			ValidateProposalDate: function(value)
			{
				return value.match(/^\d\d\d\d-\d\d-\d\d \d\d:\d\d$/);
			}
		},
		Handlers:
		{
			OnClickNotification: function(sender)
			{
				sender.parentNode.removeChild(sender);
			},
			OnClickEditMatchResult: function(sender)
			{
				MatchList.FromElement(sender).EditMatchResult(sender);
			},
			OnClickSaveMatchResult: function(sender)
			{
				League.UI.LockScreen();
				var matchList = MatchList.FromElement(sender);
				var row = Utilities.GetClosest(sender, 'tr');
				var cell = Utilities.GetClosest(sender, 'td');
				var player1 = matchList.GetPlayer1Name(row);
				var player2 = matchList.GetPlayer2Name(row);
				League.Services.SaveMatchResult('1', 'A', player1, player2, cell.children[1].children[0].value, function ()
				{
					matchList.SaveMatchResult(sender);
					League.UI.UnlockScreen();
				}, 
				League.UI.Handlers.OnServiceFail);
			},
			OnClickEditProposal: function(sender)
			{
				MatchList.FromElement(sender).EditProposal(sender);
			},
			OnClickRemoveProposal: function(sender)
			{
				League.UI.LockScreen();
				var matchList = MatchList.FromElement(sender);
				var match = matchList.GetMatchFromElement(sender);
				var data = 'Season=' + matchList.Container.Group.Data.Season
					+ '&Group=' + matchList.Container.Group.Data.GroupName 
					+ '&Player1=' + match.Player1 + '&Player2=' + match.Player2;
				League.Services.DoProposalOperation('/removeProposal', data, function ()
				{
					MatchList.FromElement(sender).RemoveProposal(sender);
					League.UI.UnlockScreen();
				},
				function (request) {
					League.UI.Actions.ShowNotification('Wystąpił błąd podczas usuwania daty: ' + decodeURIComponent(request.statusText));
					League.UI.UnlockScreen();
				});
			},			
			OnClickSaveProposal: function(sender)
			{
				var date = Utilities.GetClosest(sender, 'div').children[0].value;
				if (League.UI.Validation.ValidateProposalDate(date))
				{
					League.UI.LockScreen();
					var matchList = MatchList.FromElement(sender);
					var match = matchList.GetMatchFromElement(sender);
					var data = 'Season=' + matchList.Container.Group.Data.Season
						+ '&Group=' + matchList.Container.Group.Data.GroupName 
						+ '&Player1=' + match.Player1 + '&Player2=' + match.Player2 + '&Date=' + date;
					League.Services.DoProposalOperation('/saveProposal', data, function ()
					{
						MatchList.FromElement(sender).SaveProposal(sender);
						League.UI.UnlockScreen();
					}, 
					function (request) {
						League.UI.Actions.ShowNotification('Wystąpił błąd podczas zapisywania daty: ' + decodeURIComponent(request.statusText));
						League.UI.UnlockScreen();
					});
				}
				else
				{
					League.UI.Actions.ShowNotification("Data musi być wpisany w formacie 2015-01-01 09:30");
				}
			},
			OnClickAcceptProposal: function(sender)
			{
				League.UI.LockScreen();
				var matchList = MatchList.FromElement(sender);
				var match = matchList.GetMatchFromElement(sender);
				var data = 'Season=' + matchList.Container.Group.Data.Season
					+ '&Group=' + matchList.Container.Group.Data.GroupName 
					+ '&Player1=' + match.Player1 + '&Player2=' + match.Player2;
				League.Services.DoProposalOperation('/acceptProposal', data, function ()
				{
					MatchList.FromElement(sender).AcceptProposal(sender);
					League.UI.UnlockScreen();
				},
				function (request) {
					League.UI.Actions.ShowNotification('Wystąpił błąd podczas akceptowania daty: ' + decodeURIComponent(request.statusText));
					League.UI.UnlockScreen();
				});
			},
			OnServiceFail: function(errorMessage)
			{
				League.UI.Actions.ShowNotification(decodeURIComponent(errorMessage));
				League.UI.UnlockScreen();
			},
		
			OnClickSignIn: function(sender)
			{
				League.UI.LockScreen();
				League.Services.SignIn(document.getElementById('username').value, document.getElementById('password').value, League.UI.Handlers.OnSignInSuccess, League.UI.Handlers.OnSignInFail);
			},
			OnSignInSuccess: function ()
			{
				League.UI.RefreshUserMenu();
				League.UI.SwitchView('profile');
				League.UI.UnlockScreen();
			},
			OnSignInFail: function (errorMessage)
			{
				League.UI.Actions.ShowNotification(decodeURIComponent(errorMessage));
				League.UI.UnlockScreen();
			},
			OnClickSignOut: function(sender)
			{
				document.cookie = "Session=; expires=0; path=/";
				document.cookie = "LoginName=; expires=0; path=/";
				League.UI.RefreshUserMenu();
			}
		},
		Actions:
		{		
			ShowNotification: function(message)
			{
				var element = document.createElement('div');
				element.setAttribute('onclick', 'League.UI.Handlers.OnClickNotification(this);');
				element.textContent = message;
				document.getElementById('notifications').appendChild(element);
			},
			ShowView: function(name)
			{
				switch (name)
				{
					case 'group-A':
						League.UI.LoadGroupView(League.UI.GetCurrentSeason(), 'A');
						break;
					case 'group-B':
						League.UI.LoadGroupView(League.UI.GetCurrentSeason(), 'B');
						break;
					case 'eliminations':
						League.UI.SwitchView('eliminations');
						break;
					case 'archive':
						League.UI.SwitchView('archive');
						break;
					case 'signIn':
						League.UI.SwitchView('signIn');
						break;
					case 'home':
						League.UI.SwitchView('home');
						break;
				}
			},		
		},
		Text:
		{
			GetResultText: function(result)
			{
				if (result == "1")
				{
					return "Wygrał gracz 1";
				}
				else if (result == "2")
				{
					return "Wygrał gracz 2";
				}
				else if (result == "D")
				{
					return "Remis";
				}
				
				return "";
			},
			GetPlayerResultText: function(result, player, isOwn)
			{
				if (result == "1")
				{
					return player == 1 ? "O" : "X";
				}
				else if (result == "2")
				{
					return player == 1 ? "X" : "O";
				}
				else if (result == "D")
				{
					return "--";
				}
				
				return isOwn ? "?" : "";
			}
			
		},
		
		GetCurrentSeason: function ()
		{
			return '1';
		},
		Initialize: function ()
		{
			League.UI.Controls.ResultsTable = new ResultsTable('resultsTable');
			League.UI.Controls.MatchList = new MatchList('matchesTable');
			League.UI.RefreshUserMenu();
			League.UI.UnlockScreen();
		},
		LockScreen: function()
		{
			document.getElementById('screenLock').style.display = 'table';
		},
		UnlockScreen: function()
		{
			document.getElementById('screenLock').style.display = 'none'; 
		},
		LoadGroupView: function(season, group)
		{
			League.UI.LockScreen();
			League.Services.GetGroup(season, group, function (rawData) 
			{
				var groupData = new GroupData(rawData);
				League.UI.Controls.ResultsTable.SetGroupData(groupData);
				League.UI.Controls.ResultsTable.Render();
				League.UI.Controls.MatchList.SetGroupData(groupData);
				League.UI.Controls.MatchList.Render();
				League.UI.Controls.MatchList.ShowAll();
				League.UI.SwitchView('results');
				League.UI.UnlockScreen();
			}, 
			League.UI.Handlers.OnServiceFail);
		},		
		SwitchView: function(viewName)
		{
			if (League.UI.Controls.CurrentView)
			{
				League.UI.Controls.CurrentView.setAttribute('class', '');
			}
			//League.UI.RenderResults();
			League.UI.Controls.CurrentView = document.getElementById(viewName);
			League.UI.Controls.CurrentView.setAttribute('class', 'selected');
		},
		
		
		
		
		
		SignOut: function ()
		{
			if (League.Services.SignOut())
			{
				League.UI.RefreshUserMenu();
			}
		},

		RefreshUserMenu: function ()
		{
			if (Utilities.GetCookie('Session'))
			{
				document.getElementById('profileLink').textContent = Utilities.GetCookie('LoginName');
				document.getElementById('nav').setAttribute("class", "signedIn");
			}
			else
			{
				document.getElementById('nav').setAttribute("class", "signedOut");
			}
		},
		ShowHome: function()
		{
			League.UI.ShowView('home');
		},

		ShowGroupB: function()
		{
			League.UI.RenderResultsView('1', 'B');
			League.UI.ShowView('results');
		},

		ShowSignInView: function()
		{
			League.UI.ShowView('signIn');
		},
		RenderResultsTableCellContent: function(group, cell, player1, player2)
		{
			var results = group.GetMatchesBeetwen(group.Data.Players[player1], group.Data.Players[player2]);
			var username = Utilities.GetCookie('LoginName');
			if (results.length == 0)
			{
				if (group.Data.Players[player1] == username)
				{
				}

				cell.innerHTML = '<div onclick="">&nbsp;</div>';
			}
			else
			{
				if (results[0].Result != '')
				{
					var won = (results[0].Result == 'B' && results[0].Black == group.Data.Players[player1]) || (results[0].Result == 'W' && results[0].White == group.Data.Players[player1]);
					
					if (won)
					{
						cell.setAttribute("class", "won");
						//cell.innerHTML = '<div class="won" onclick="">&#x25EF;</div>';
						cell.innerHTML = '<div><b>+</b></div>';
					}
					else
					{
						cell.setAttribute("class", "lose");
						//cell.innerHTML = '<div class="lose" onclick="">&#10005;</div>';
						cell.innerHTML = '<div><b>-</b></div>';
					}
				}
				else
				{
					var result = '';
					if (results[0].Black == group.Data.Players[player1])
					{
						if (results[0].BlackResult == 'B') result = 'W';
						else if (results[0].BlackResult == 'W') result = 'L';
					}
					else
					{
						if (results[0].BlackResult == 'B') result = 'L';
						else if (results[0].BlackResult == 'W') result = 'W';
					}
					//if (group.Data.Players[player1] == username)
					//{
						if (result == 'W') 
						{
							cell.setAttribute("class", "won");
							cell.innerHTML = '<div><b>+</b></div>';
							//cell.innerHTML = '<div class="won" onclick="">&#x25EF;</div>';
							//cell.innerHTML = '<select><option></option><option selected="selected">Won</option><option>Lose</option></select>';
						}
						else if (result == 'L')
						{
							cell.setAttribute("class", "lose");
							cell.innerHTML = '<div><b>-</b></div>';
							//cell.innerHTML = '<div class="lose" onclick="">&#10005;</div>';
							//cell.innerHTML = '<select><option></option><option>Won</option><option selected="selected">Lose</option></select>';
						}
						else
						{
							cell.innerHTML = '<div onclick=""></div>';
							//cell.innerHTML = '<select><option></option><option>Won</option><option>Lose</option></select>';
						}
					/*}
					else
					{
						if (result == 'W') 
						{
							cell.innerHTML = 'Won';
						}
						else if (result == 'L')
						{
							cell.innerHTML = 'Lose';
						}
					}/*/
				}
			}
			//cell.textContent = results.length;
		},
		RenderResultsTable: function(group)
		{
			var headerRow = document.createElement("tr");
			var headerPlace = document.createElement("td");
			headerPlace.textContent = 'Place';
			headerRow.appendChild(headerPlace);
			var headerPlayer = document.createElement("td");
			headerPlayer.textContent = 'Player';
			headerRow.appendChild(headerPlayer);
			var headerScore = document.createElement("td");
			headerScore.textContent = 'Score';
			headerRow.appendChild(headerScore);
			var headerSeparator = document.createElement("td");
			headerSeparator.setAttribute('class', 'separator');
			headerRow.appendChild(headerSeparator);
			
			for (var j = 0; j < group.Data.Players.length; j++)
			{
				var headerCell = document.createElement("td");
				headerCell.innerHTML = '<div>' + group.Data.Players[j].replace(' ', '&nbsp;') + '</div>';
				headerCell.setAttribute('class', 'player');
				headerRow.appendChild(headerCell);
			}
			
			var header = document.createElement("tbody");
			header.appendChild(headerRow);
			var body = document.createElement("tbody");

			for (var i = 0; i < group.Data.Players.length; i++)
			{
				var row = document.createElement("tr");
				var playerPositionCell = document.createElement("td");
				playerPositionCell.textContent = group.Data.Places[i];
				row.appendChild(playerPositionCell);
				var playerNameCell = document.createElement("td");
				playerNameCell.setAttribute("class", "player");
				playerNameCell.innerHTML = group.Data.Players[i].replace(' ', '&nbsp;');
				row.appendChild(playerNameCell);
				var playerScoreCell = document.createElement("td");
				playerScoreCell.textContent = group.Data.Scores[i];
				row.appendChild(playerScoreCell);
				var separatorCell = document.createElement("td");
				separatorCell.setAttribute('class', 'separator');
				row.appendChild(separatorCell);
				
				for (var j = 0; j < group.Data.Players.length; j++)
				{
					var resultCell = document.createElement("td");
					if (i == j)
					{
						resultCell.setAttribute('class', 'void');
					}
					else
					{
						this.RenderResultsTableCellContent(group, resultCell, i, j);
					}
					row.appendChild(resultCell);
				}

				body.appendChild(row);
			}

			var resultsTable = document.createElement("table");
			resultsTable.setAttribute('class', 'results');
			resultsTable.appendChild(header);
			resultsTable.appendChild(body);
			document.getElementById('resultsTable').innerHTML = '';
			document.getElementById('resultsTable').appendChild(resultsTable);
		},
		RenderMatchList_ResultCell: function(group, i, result, username)
		{
			var cell;
			
			if (group.Data.Players[i] == username)
			{
				var table = document.createElement("table");
				table.innerHTML = '<tr><td>Wynik:</td><td><select><option></option><option>Wygrał gracz 1</option><option>Wygrał gracz 2</option><option>Remis</option></select></td></tr><tr><td>Zapis partii:</td><td><input type="text" value="http://" /></td></tr><tr><td></td><td><input type="button" value="Zapisz" /></td></tr>';
				cell = document.createElement("td");
				cell.appendChild(table);
				return cell;
			}
			else
			{
				cell = document.createElement("td");
				if ((typeof result != 'object') || result.Result == '')
				{
					cell.textContent = '';
				}
				else if (result.Result == '1')
				{
					cell.textContent = 'Wygrał gracz 1';
				}
				else if (result.Result == '2')
				{
					cell.textContent = 'Wygrał gracz 2';
				}
				else
				{
					cell.textContent = 'Remis';
				}
				return cell;
			}
		},
		RenderMatchList_DateCell: function(group, i, j, username)
		{	
			var isEdit = false;
			var ownDate = '';
			var opponentDate = '';
			
			if (group.Data.Players[i] == username)
			{
				isEdit = true;
				ownDate = group.Data.Matches[i][j - i - 1].Date1;
				opponentDate = group.Data.Matches[i][j - i - 1].Date2;
			}
			
			if (group.Data.Players[j] == username)
			{
				isEdit = true;
				ownDate = group.Data.Matches[i][j - i - 1].Date2;
				opponentDate = group.Data.Matches[i][j - i - 1].Date1;
			}
			
			var cell;
			var row;
			var table = document.createElement("table");
			
			if (group.Data.Matches[i][j - i - 1].Date == '')
			{
				row = document.createElement("tr");
				cell = document.createElement("td");
				cell.textContent = 'Uzgodniona data:';
				row.appendChild(cell);
				cell = document.createElement("td");
				cell.textContent = 'brak';
				row.appendChild(cell);
				table.appendChild(row);
			}
			else
			{
				row = document.createElement("tr");
				cell = document.createElement("td");
				cell.textContent = 'Uzgodniona data:';
				row.appendChild(cell);
				cell = document.createElement("td");
				cell.textContent = group.Data.Matches[i][j - i - 1].Date;
				row.appendChild(cell);
				table.appendChild(row);
			}
			
			if (isEdit)
			{
				row = document.createElement("tr");
				row.innerHTML = '<td>Twoja propozycja:</td><td><input type="text" value="' + ownDate + '"/></td><td><input type="button" value="Zapisz" /></td>';
				table.appendChild(row);
				
				if (opponentDate != '')
				{
					row = document.createElement("tr");
					row.innerHTML = '<td>Propozycja przeciwnika:</td><td><input type="text" value="' + opponentDate + '"/></td><td><input type="button" value="Zaakceptuj" /></td>';
					table.appendChild(row);
				}
			}
			
			cell = document.createElement("td");
			cell.appendChild(table);
			return cell;
		},
		EditMatchResult: function(sender)
		{
		},
		SaveMatchResult: function(sender)
		{
			sender.parentNode.parentNode.setAttribute('class', 'display');
		},
		CreateMatchListResultCell: function(group, i, j, username)
		{
		},
		CreateMatchListResultEditCell: function(group, i, j, k, username)
		{
			var cell = document.createElement("td");
			cell.innerHTML = '<div class="editable" onclick="League.UI.EditMatchResult(this);">brak</div><div><select><option></option><option>Gracz 1</option><option>Gracz 2</option><option>Remis</option></select>&nbsp;<input type="button" value="Zapisz" onclick="League.UI.SaveMatchResult(this);" /></div>';
			cell.setAttribute('class', 'display');
			return cell;
		},
		UpdateMatchListRow: function(group, i, j, username)
		{
			
		},
		CreateMatchListRow: function(group, i, j, username)
		{
		},
		RenderMatchList: function(group)
		{
			var username = Utilities.GetCookie('LoginName');
			var header = document.createElement("tbody");
			var headerRow = document.createElement("tr");
			headerRow.innerHTML = '<td>Gracz 1</td><td>Gracz 2</td><td>Wynik</td><td>Zgłoszenie gracza 1</td><td>Zgłoszenie gracza 2</td><td>Uzgodniona data</td>';
			header.appendChild(headerRow);
			var body = document.createElement("tbody");
			
			for (var i = 0; i < group.Data.Players.length; i++)
			{
				for (var j = i + 1; j < group.Data.Players.length; j++)
				{
					body.appendChild(League.UI.CreateMatchListRow(group, i, j, username));
					continue;
					var row = document.createElement("tr");
					var cell;
					cell = document.createElement("td");
					cell.textContent = group.Data.Players[i];
					row.appendChild(cell);
					cell = document.createElement("td");
					cell.textContent = group.Data.Players[j];
					row.appendChild(cell);
					
					if (group.Data.Matches[i][j - i - 1].Result == "")
					{
						cell = document.createElement("td");
						row.appendChild(cell);
						cell = League.UI.RenderMatchList_ResultCell(group, i, group.Data.Matches[i][j - i - 1].Result1, username);
						row.appendChild(cell);
						cell = League.UI.RenderMatchList_ResultCell(group, j, group.Data.Matches[i][j - i - 1].Result2, username);
						row.appendChild(cell);
						cell = League.UI.RenderMatchList_DateCell(group, i, j, username);
						row.appendChild(cell);
					}
					else
					{
						cell = document.createElement("td");
						
						if (typeof group.Data.Matches[i][j - i - 1].Result.Result == 'undefined')
						{
						}
						else if (cell.textContent = group.Data.Matches[i][j - i - 1].Result.Result == '1')
						{
							cell.textContent = 'Wygrał gracz 1';
							row.setAttribute('class', 'played won1');
						}
						else if (cell.textContent = group.Data.Matches[i][j - i - 1].Result.Result == '2')
						{
							cell.textContent = 'Wygrał gracz 2';
							row.setAttribute('class', 'played won2');
						}
						else
						{
							cell.textContent = 'Remis';
							row.setAttribute('class', 'played');
						}
						
						row.appendChild(cell);
						cell = document.createElement("td");
						row.appendChild(cell);
						cell = document.createElement("td");
						row.appendChild(cell);
						cell = document.createElement("td");
						row.appendChild(cell);
					}
					
					body.appendChild(row);
				}
			}
			
			var resultsTable = document.createElement("table");
			resultsTable.setAttribute('class', 'matches');
			resultsTable.appendChild(header);
			resultsTable.appendChild(body);
			document.getElementById('matchesTable').innerHTML = '';
			document.getElementById('matchesTable').appendChild(resultsTable);
		},
	},

};
