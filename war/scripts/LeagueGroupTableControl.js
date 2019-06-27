var LeagueGroupTableControl = (function () {
    function LeagueGroupTableControl() {
        var that = this;
        this.tableElement = document.createElement('table');
        this.tableElement.className = 'group';
        this.tableElement.onmouseout = function (event) { that.handleOnMatchMouseOut(event); };
        document.onmouseover = function (event) { that.handleOnMatchMouseOver(event); };
        this.previewElement = document.getElementById('match-preview');
        //this.previewElement.onmouseover = function (event) { that.handleOnMatchMouseOver(event); };
        //this.previewElement = document.createElement('div');
        this.previewElement.style.position = 'fixed';
        //document.getElementById('body').appendChild(this.previewElement);
    }
    LeagueGroupTableControl.prototype.getElement = function () {
        return this.tableElement;
    };
    LeagueGroupTableControl.prototype.bind = function (league, group) {
        this.league = league;
        this.group = group;
        this.render();
    };
    LeagueGroupTableControl.prototype.handleOnMatchCellClicked = function (event) {
        if (this.onMatchCellClicked) {
            var cellElement = Utilities.DOM.getClosestByTagName(event.target, 'td');
            this.onMatchCellClicked(this, cellElement.player1, cellElement.player2);
        }
    };
    LeagueGroupTableControl.prototype.handleOnPlayerCellClicked = function (event) {
        if (this.onPlayerCellClicked) {
            var cellElement = Utilities.DOM.getClosestByTagName(event.target, 'td');
            this.onPlayerCellClicked(this, cellElement.player);
        }
    };
    LeagueGroupTableControl.prototype.handleOnMatchMouseOver = function (event) {
        if ($(event.target).closest('#match-preview').length > 0) {
            return;
        }
        this.previewElement.style.display = 'none';
        var matchCell = Utilities.DOM.getClosestByTagName(event.target, 'td');
        var visible = false;
        if (matchCell != null) {
            var player1 = matchCell.player1;
            var player2 = matchCell.player2;
            if (typeof player1 != 'undefined') {
                var matches = this.group.getMatchesBeetwen(player1.nickname, player2.nickname);
                if (matches != null && matches.length > 0) {
                    if (matches[0].hasResult()) {
                        if (matches[0].url == '') {
                            this.previewElement.children[0].style.display = 'block';
                            this.previewElement.children[1].style.display = 'none';
                            this.previewElement.children[0].textContent = 'Brak zapisu partii';
                        }
                        else {
                            this.previewElement.children[0].style.display = 'none';
                            this.previewElement.children[1].style.display = 'block';
                            var kifuLink = this.previewElement.children[1].childNodes[0];
                            kifuLink.href = 'http://eidogo.com/#url:' + matches[0].url;
                        }
                        visible = true;
                    }
                    else if (matches[0].hasDate()) {
                        this.previewElement.children[0].style.display = 'block';
                        this.previewElement.children[1].style.display = 'none';
                        this.previewElement.children[0].textContent = 'Zaplanowana data: ' + matches[0].date;
                        visible = true;
                    }
                }
            }
        }
        if (visible) {
            var r = matchCell.getBoundingClientRect();
            this.previewElement.style.top = (r.top + 46) + 'px';
            this.previewElement.style.left = (r.left) + 'px';
            this.previewElement.style.display = 'block';
        }
    };
    LeagueGroupTableControl.prototype.handleOnMatchMouseOut = function (event) {
    };
    LeagueGroupTableControl.prototype.update = function () {
    };
    LeagueGroupTableControl.prototype.render = function () {
        this.group.refreshScores();
        Utilities.DOM.removeChildren(this.tableElement);
        var isAdmin = App.isAdmin();
        var currentUser = App.currentUser();
        var header = document.createElement('thead');
        var body = document.createElement('tbody');
        var row = document.createElement('tr');
        var that = this;
        Utilities.DOM.createChildWithInnerText(row, 'th', 'Miejsce').className = 'place';
        Utilities.DOM.createChildWithInnerText(row, 'th', 'Gracz').className = 'player';
        Utilities.DOM.createChildWithInnerText(row, 'th', 'Punkty').className = 'points';
        Utilities.DOM.createChildWithInnerText(row, 'th', 'SODOS').className = 'sodos';
        for (var i = 0; i < this.group.players.length; i++) {
            var cell = document.createElement('th');
            cell.className = 'opponent';
            Utilities.DOM.createChildWithInnerText(cell, 'div', this.group.players[i].nickname);
            row.appendChild(cell);
        }
        header.appendChild(row);
        for (var i = 0; i < this.group.players.length; i++) {
            row = document.createElement('tr');
            row.player = this.group.players[i];
            Utilities.DOM.createChildWithInnerText(row, 'td', '1').className = 'place';
            var playerCell = Utilities.DOM.createChildWithInnerText(row, 'td', this.group.players[i].nickname);
            playerCell.player = this.group.players[i];
            playerCell.className = 'player';
            playerCell.onclick = function (event) { that.handleOnPlayerCellClicked(event); };
            Utilities.DOM.createChildWithInnerText(row, 'td', this.group.points[this.group.players[i].nickname]).className = 'points';
            Utilities.DOM.createChildWithInnerText(row, 'td', this.group.sodoses[this.group.players[i].nickname]).className = 'sodos';
            for (var j = 0; j < this.group.players.length; j++) {
                var cellContent = document.createElement('div');
                var cell = document.createElement('td');
                cell.appendChild(cellContent);
                row.appendChild(cell);
                cellContent.textContent = '';
                //cell.onmouseover = function (event) { that.handleOnMatchMouseOver(event); };
                if (this.group.players[i] == this.group.players[j]) {
                    cell.className = 'blank';
                }
                else {
                    cell.player1 = this.group.players[i];
                    cell.player2 = this.group.players[j];
                    cell.className = 'match';
                    if (this.league != null) {
                        cell.onclick = function (event) { that.handleOnMatchCellClicked(event); };
                    }
                    var matches = this.group.getMatchesBeetwen(this.group.players[i].nickname, this.group.players[j].nickname);
                    if (matches.length > 0) {
                        if (matches[0].hasResult()) {
                            if (matches[0].getResult() == MatchResult.Won1) {
                                if (matches[0].player1 == this.group.players[i].nickname) {
                                    cell.classList.add('won');
                                }
                                else {
                                    cell.classList.add('lose');
                                }
                            }
                            else {
                                if (matches[0].player1 == this.group.players[i].nickname) {
                                    cell.classList.add('lose');
                                }
                                else {
                                    cell.classList.add('won');
                                }
                            }
                        }
                        else {
                            if (this.group.players[i].nickname == currentUser) {
                                if (matches[0].date != '') {
                                    cell.classList.add('planned');
                                }
                                else if (matches[0].getPlayerDate(this.group.players[j].nickname) != '') {
                                    cell.classList.add('request');
                                }
                            }
                            if (isAdmin) {
                                if (matches[0].result1 != null || matches[0].result2 != null) {
                                    cell.classList.add('to-approve');
                                }
                            }
                            cell.classList.add('empty');
                        }
                    }
                    else {
                        cell.classList.add('empty');
                    }
                }
            }
            body.appendChild(row);
        }
        this.tableElement.appendChild(header);
        this.tableElement.appendChild(body);
        this.sort();
    };
    LeagueGroupTableControl.prototype.sort = function () {
        var table = this.tableElement.children[1];
        var rows = [];
        while (table.children.length > 0) {
            rows.push(table.removeChild(table.children[0]));
        }
        var that = this;
        var sortFunction = function (a, b) {
            var points1 = that.group.points[a.player.nickname];
            var points2 = that.group.points[b.player.nickname];
            //var player1 = that.Group.GetPlayer(a.children[1].textContent);
            //var player2 = that.Group.GetPlayer(b.children[1].textContent);
            //console.log(player1.Name + ': ' + that.Group.Scores[player1.Index]);
            //console.log(player2.Name + ': ' + that.Group.Scores[player2.Index]);
            var d = points2 - points1;
            if (d == 0) {
                var sodos1 = that.group.sodoses[a.player.nickname];
                var sodos2 = that.group.sodoses[b.player.nickname];
                d = sodos2 - sodos1;
                if (d == 0) {
                    d = (a.player.nickname.toUpperCase() > b.player.nickname.toUpperCase()) ? 1 : -1;
                }
            }
            return d;
        };
        rows.sort(sortFunction);
        for (var i = 0; i < rows.length; i++) {
            table.appendChild(rows[i]);
        }
    };
    return LeagueGroupTableControl;
})();
var LeagueGameListControl = (function () {
    function LeagueGameListControl() {
        this.tableElement = document.createElement('table');
        this.tableElement.className = 'results standard';
    }
    LeagueGameListControl.prototype.getElement = function () {
        return this.tableElement;
    };
    LeagueGameListControl.prototype.bind = function (league, group) {
        this.league = league;
        this.group = group;
        this.render();
    };
    LeagueGameListControl.prototype.render = function () {
        Utilities.DOM.removeChildren(this.tableElement);
        var matches = this.getMatchesForRender();
        var header = document.createElement('thead');
        var body = document.createElement('tbody');
        var row = document.createElement('tr');
        Utilities.DOM.createChildWithInnerText(row, 'th', 'Miejsce').className = 'place';
        Utilities.DOM.createChildWithInnerText(row, 'th', 'Gracz').className = 'player';
        Utilities.DOM.createChildWithInnerText(row, 'th', 'Punkty').className = 'points';
        Utilities.DOM.createChildWithInnerText(row, 'th', 'SODOS').className = 'sodos';
        header.appendChild(row);
        for (var i = 0; i < matches.length; i++) {
            row = document.createElement('tr');
            Utilities.DOM.createChildWithInnerText(row, 'td', matches[i].player1).className = 'player';
            Utilities.DOM.createChildWithInnerText(row, 'td', matches[i].player2).className = 'player';
            Utilities.DOM.createChildWithInnerText(row, 'td', matches[i].date).className = 'result-date';
            body.appendChild(row);
        }
        this.tableElement.appendChild(body);
    };
    LeagueGameListControl.prototype.getMatchesForRender = function () {
        var matches = [];
        for (var i = 0; i < this.group.matches.length; i++) {
            if (this.group.matches[i].hasDate()) {
                matches.push(this.group.matches[i]);
            }
        }
        var that = this;
        var sortFunction = function (a, b) {
            return a.compareByDate(b);
        };
        matches.sort(sortFunction);
        return matches;
    };
    return LeagueGameListControl;
})();
var LeagueResultListControl = (function () {
    function LeagueResultListControl() {
        this.tableElement = document.createElement('table');
        this.tableElement.className = 'results standard';
        this.collapsed = true;
    }
    LeagueResultListControl.prototype.getElement = function () {
        return this.tableElement;
    };
    LeagueResultListControl.prototype.bind = function (league, group) {
        this.league = league;
        this.group = group;
        this.render();
    };
    LeagueResultListControl.prototype.getMatchesForRender = function () {
        var matches = [];
        for (var i = 0; i < this.group.matches.length; i++) {
            if (this.group.matches[i].hasResult()) {
                matches.push(this.group.matches[i]);
            }
        }
        var that = this;
        var sortFunction = function (a, b) {
            return a.compareByResultDate(b);
            //var player1 = that.Group.GetPlayer(a.children[1].textContent);
            //var player2 = that.Group.GetPlayer(b.children[1].textContent);
            ////console.log(player1.Name + ': ' + that.Group.Scores[player1.Index]);
            ////console.log(player2.Name + ': ' + that.Group.Scores[player2.Index]);
            //var d = that.Group.Points[player2.Index] - that.Group.Points[player1.Index];
            //
            //if (d == 0)
            //{
            //    d = that.Group.SODOSes[player2.Index] - that.Group.SODOSes[player1.Index];
            //
            //    if (d == 0)
            //    {
            //        d = (a.children[1].textContent.toUpperCase() > b.children[1].textContent.toUpperCase()) ? 1 : -1;
            //    }
            //}
            //return d;
        };
        matches.sort(sortFunction);
        return matches;
    };
    LeagueResultListControl.prototype.toggle = function () {
        this.collapsed = !this.collapsed;
        this.setState(this.collapsed);
    };
    LeagueResultListControl.prototype.setState = function (collapsed) {
        this.collapsed = collapsed;
        var display = this.collapsed ? 'none' : '';
        var rows = this.tableElement.children[0].children;
        for (var i = 3; i < rows.length - 1; i++) {
            rows[i].style.display = display;
        }
    };
    LeagueResultListControl.prototype.render = function () {
        Utilities.DOM.removeChildren(this.tableElement);
        var matches = this.getMatchesForRender();
        var header = document.createElement('thead');
        var body = document.createElement('tbody');
        var row = document.createElement('tr');
        Utilities.DOM.createChildWithInnerText(row, 'th', 'Miejsce').className = 'place';
        Utilities.DOM.createChildWithInnerText(row, 'th', 'Gracz').className = 'player';
        Utilities.DOM.createChildWithInnerText(row, 'th', 'Punkty').className = 'points';
        Utilities.DOM.createChildWithInnerText(row, 'th', 'SODOS').className = 'sodos';
        header.appendChild(row);
        for (var i = 0; i < matches.length; i++) {
            row = document.createElement('tr');
            Utilities.DOM.createChildWithInnerText(row, 'td', matches[i].player1).className = 'player';
            Utilities.DOM.createChildWithInnerText(row, 'td', matches[i].player2).className = 'player';
            Utilities.DOM.createChildWithInnerText(row, 'td', matches[i].getResultDate()).className = 'result-date';
            if (matches[i].getResult() == MatchResult.Won1) {
                row.className = 'won1';
            }
            else if (matches[i].getResult() == MatchResult.Won2) {
                row.className = 'won2';
            }
            body.appendChild(row);
        }
        row = document.createElement('tr');
        var cell = document.createElement('td');
        var that = this;
        cell.textContent = '...';
        cell.colSpan = 3;
        cell.className = 'toggle';
        cell.onclick = function () { that.toggle(); };
        row.appendChild(cell);
        body.appendChild(row);
        if (matches.length < 4) {
            cell.style.display = 'none';
        }
        this.tableElement.appendChild(body);
        this.setState(true);
    };
    return LeagueResultListControl;
})();
var LeagueMatchControl = (function () {
    function LeagueMatchControl() {
    }
    //private tableElement: HTMLElement;
    //
    //constructor()
    //{
    //    this.tableElement = document.createElement('table');
    //}
    //
    //getElement(): HTMLElement
    //{
    //    return this.tableElement;
    //}
    LeagueMatchControl.prototype.bind = function (league, group, match) {
        this.league = league;
        this.group = group;
        this.match = match;
        var isAdmin = App.isAdmin();
        var currentUser = App.currentUser();
        var matchTable = document.getElementById('match-details');
        if (App.currentUser()) {
        }
        // Players
        document.getElementById('match-details-player1').textContent = match.player1;
        document.getElementById('match-details-player2').textContent = match.player2;
        // Results
        var resultControl = this.getResultEditControl();
        resultControl.value = match.getResultOptionValue();
        document.getElementById('match-details-result-display').children[1].textContent = resultControl.options[resultControl.selectedIndex].text;
        var resultControl = this.getResult1EditControl();
        resultControl.value = match.getResult1OptionValue();
        document.getElementById('match-details-result1-display').children[1].textContent = resultControl.options[resultControl.selectedIndex].text;
        var resultControl = this.getResult2EditControl();
        resultControl.value = match.getResult2OptionValue();
        document.getElementById('match-details-result2-display').children[1].textContent = resultControl.options[resultControl.selectedIndex].text;
        if (isAdmin) {
            document.getElementById('match-details-result-display').style.display = 'none';
            document.getElementById('match-details-result-edit').style.display = '';
        }
        else {
            document.getElementById('match-details-result-display').style.display = '';
            document.getElementById('match-details-result-edit').style.display = 'none';
        }
        document.getElementById('match-details-result1-display').children[0].textContent = match.player1;
        document.getElementById('match-details-result1-edit').children[0].textContent = match.player1;
        if (match.player1 == currentUser) {
            document.getElementById('match-details-result1-display').style.display = 'none';
            document.getElementById('match-details-result1-edit').style.display = '';
        }
        else {
            document.getElementById('match-details-result1-display').style.display = '';
            document.getElementById('match-details-result1-edit').style.display = 'none';
        }
        document.getElementById('match-details-result2-display').children[0].textContent = match.player2;
        document.getElementById('match-details-result2-edit').children[0].textContent = match.player2;
        if (match.player2 == currentUser) {
            document.getElementById('match-details-result2-display').style.display = 'none';
            document.getElementById('match-details-result2-edit').style.display = '';
        }
        else {
            document.getElementById('match-details-result2-display').style.display = '';
            document.getElementById('match-details-result2-edit').style.display = 'none';
        }
        // Urls
        document.getElementById('match-details-url-display').children[1].textContent = match.getUrl();
        document.getElementById('match-details-url-edit').children[1].children[0].value = match.getUrl();
        document.getElementById('match-details-url1-display').children[1].textContent = match.url1;
        document.getElementById('match-details-url1-edit').children[1].children[0].value = match.url1;
        document.getElementById('match-details-url2-display').children[1].textContent = match.url2;
        document.getElementById('match-details-url2-edit').children[1].children[0].value = match.url2;
        document.getElementById('match-details-url1-edit').children[2].children[0].href = ' http://www.gokgs.com/gameArchives.jsp?user=' + match.player1;
        document.getElementById('match-details-url2-edit').children[2].children[0].href = ' http://www.gokgs.com/gameArchives.jsp?user=' + match.player2;
        if (isAdmin) {
            document.getElementById('match-details-url-display').style.display = 'none';
            document.getElementById('match-details-url-edit').style.display = '';
        }
        else {
            document.getElementById('match-details-url-display').style.display = '';
            document.getElementById('match-details-url-edit').style.display = 'none';
        }
        document.getElementById('match-details-url1-display').children[0].textContent = match.player1;
        document.getElementById('match-details-url1-edit').children[0].textContent = match.player1;
        if (match.player1 == currentUser) {
            document.getElementById('match-details-url1-display').style.display = 'none';
            document.getElementById('match-details-url1-edit').style.display = '';
        }
        else {
            document.getElementById('match-details-url1-display').style.display = '';
            document.getElementById('match-details-url1-edit').style.display = 'none';
        }
        document.getElementById('match-details-url2-display').children[0].textContent = match.player2;
        document.getElementById('match-details-url2-edit').children[0].textContent = match.player2;
        if (match.player2 == currentUser) {
            document.getElementById('match-details-url2-display').style.display = 'none';
            document.getElementById('match-details-url2-edit').style.display = '';
        }
        else {
            document.getElementById('match-details-url2-display').style.display = '';
            document.getElementById('match-details-url2-edit').style.display = 'none';
        }
        // Dates
        document.getElementById('match-details-date-display').children[1].textContent = match.date;
        document.getElementById('match-details-date1-display').children[1].textContent = match.date1;
        document.getElementById('match-details-date2-display').children[1].textContent = match.date2;
        document.getElementById('match-details-date1-display').children[0].textContent = match.player1;
        document.getElementById('match-details-date2-display').children[0].textContent = match.player2;
        if (match.player1 == currentUser) {
            document.getElementById('match-details-dateOwn-edit').style.display = '';
            document.getElementById('match-details-dateOpponent-display').style.display = '';
            document.getElementById('match-details-date1-display').style.display = 'none';
            document.getElementById('match-details-date2-display').style.display = 'none';
            document.getElementById('match-details-dateOwn-edit').children[1].children[0].value = match.date1;
            document.getElementById('match-details-dateOpponent-display').children[1].textContent = match.date2;
        }
        else if (match.player2 == currentUser) {
            document.getElementById('match-details-dateOwn-edit').style.display = '';
            document.getElementById('match-details-dateOpponent-display').style.display = '';
            document.getElementById('match-details-date1-display').style.display = 'none';
            document.getElementById('match-details-date2-display').style.display = 'none';
            document.getElementById('match-details-dateOwn-edit').children[1].children[0].value = match.date2;
            document.getElementById('match-details-dateOpponent-display').children[1].textContent = match.date1;
        }
        else {
            document.getElementById('match-details-dateOwn-edit').style.display = 'none';
            document.getElementById('match-details-dateOpponent-display').style.display = 'none';
            document.getElementById('match-details-date1-display').style.display = 'none';
            document.getElementById('match-details-date2-display').style.display = 'none';
        }
        if (isAdmin) {
            document.getElementById('match-details-date1-display').style.display = '';
            document.getElementById('match-details-date2-display').style.display = '';
        }
        document.getElementById('side').style.display = '';
    };
    LeagueMatchControl.prototype.getResultEditControl = function () {
        return document.getElementById('match-details-result-edit').children[1].children[0];
    };
    LeagueMatchControl.prototype.getResult1EditControl = function () {
        return document.getElementById('match-details-result1-edit').children[1].children[0];
    };
    LeagueMatchControl.prototype.getResult2EditControl = function () {
        return document.getElementById('match-details-result2-edit').children[1].children[0];
    };
    LeagueMatchControl.prototype.getUrlEditControl = function () {
        return document.getElementById('match-details-url-edit').children[1].children[0];
    };
    LeagueMatchControl.prototype.getUrl1EditControl = function () {
        return document.getElementById('match-details-url1-edit').children[1].children[0];
    };
    LeagueMatchControl.prototype.getUrl2EditControl = function () {
        return document.getElementById('match-details-url2-edit').children[1].children[0];
    };
    LeagueMatchControl.prototype.getDateEditControl = function () {
        return document.getElementById('match-details-dateOwn-edit').children[1].children[0];
    };
    return LeagueMatchControl;
})();
var PlayerControl = (function () {
    function PlayerControl() {
    }
    PlayerControl.prototype.bind = function (nickname) {
        this.getNameElement().textContent = nickname;
        this.getGraphElement().src = 'http://www.gokgs.com/servlet/graph/' + nickname + '-pl_PL.png';
    };
    PlayerControl.prototype.getNameElement = function () {
        return document.getElementById('view-player-nickname');
    };
    PlayerControl.prototype.getGraphElement = function () {
        return document.getElementById('view-player-graph');
    };
    return PlayerControl;
})();
//# sourceMappingURL=LeagueGroupTableControl.js.map