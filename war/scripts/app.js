var Application = (function () {
    function Application() {
        var that = this;
        this.leagueService = new LeagueService();
        this.leagueGroupTableControl = new LeagueGroupTableControl();
        this.leagueGroupTableControl.onMatchCellClicked = function (a, b, c) { that.handleOnGroupMatchCellClicked(a, b, c); };
        this.leagueGroupTableControl.onPlayerCellClicked = function (a, b) { that.handleOnGroupPlayerCellClicked(a, b); };
        this.leagueGroupResultListControl = new LeagueResultListControl();
        this.leagueGroupGameListControl = new LeagueGameListControl();
        this.leagueEliminationsTableControl = new LeagueEliminationsTableControl();
        this.leagueEliminationsTableControl.onCellClicked = function (a, b) { that.handleOnEliminationsTableCellClicked(a, b); };
        this.leagueEliminationsResultListControl = new LeagueResultListControl();
        this.leagueMatchControl = new LeagueMatchControl();
        this.laeguePlayerControl = new PlayerControl();
        this.leaguePointsControl = new LeaguePointsControl();
        document.getElementById('group').appendChild(this.leagueGroupTableControl.getElement());
        document.getElementById('group-results').appendChild(this.leagueGroupResultListControl.getElement());
        document.getElementById('group-plan').appendChild(this.leagueGroupGameListControl.getElement());
        document.getElementById('eliminations').appendChild(this.leagueEliminationsTableControl.getElement());
        document.getElementById('eliminations-results').appendChild(this.leagueEliminationsResultListControl.getElement());
    }
    Application.prototype.addNotification = function (message) {
        var datetime = new Date();
        var time = datetime.getHours() + ':' + datetime.getMinutes() + ':' + datetime.getSeconds();
        var notificationElement = document.createElement('div');
        notificationElement.textContent = time + ": " + message;
        notificationElement.onclick = function (e) { var t = e.target; t.parentElement.removeChild(t); };
        document.getElementById('notifications').appendChild(notificationElement);
    };
    Application.prototype.addNotificationXHR = function (message, jqXHR) {
        try {
            var matches = $(jqXHR.responseText).text().match(/.*Error:(.*)/);
            App.addNotification(message + ': ' + decodeURIComponent(matches[1]));
        }
        catch (e) {
            App.addNotification(message);
        }
    };
    Application.prototype.addNotificationHTML = function (message) {
        var notificationElement = document.createElement('div');
        notificationElement.innerHTML = message;
        notificationElement.onclick = function (e) { var t = e.target; t.parentElement.removeChild(t); };
        document.getElementById('notifications').appendChild(notificationElement);
    };
    Application.prototype.loadViewJoin = function () {
        var _this = this;
        var that = this;
        this.lockScreen();
        this.leagueService.GetData(function (league) {
            $('#joined-players-list').html('');
            var players = league.getPlayersJoinedToEliminations();
            for (var i = 0; i < players.length; i++) {
                $('#joined-players-list').append('<li>' + players[i] + '</li>');
            }
            _this.showView('join');
            _this.unlockScreen();
        });
    };
    Application.prototype.loadViewGroup = function (season, groupName) {
        var _this = this;
        var that = this;
        this.lockScreen();
        this.leagueService.GetData(function (league) {
            _this.league = league;
            if (season == 0 || league.getCurrentSeason() == season) {
                _this.showViewGroup(league, league.getGroup(league.getCurrentSeason(), groupName));
                _this.unlockScreen();
            }
            else {
                _this.leagueService.GetGroupData(season + '-' + groupName, function (group) {
                    _this.showViewGroup(null, group);
                    _this.unlockScreen();
                });
            }
        });
    };
    //public showGroupA()
    //{
    //    this.lockScreen();
    //
    //    this.leagueService.GetData((league: League) =>
    //    {
    //        this.showGroup(league, league.getGroup(league.getCurrentSeason(), 'a'));
    //        this.unlockScreen();
    //    });
    //}
    //
    //public showGroupB()
    //{
    //    this.leagueService.GetData((league: League) =>
    //    {
    //        this.showGroup(league, league.getGroup(league.getCurrentSeason(), 'b'));
    //    });
    //}
    //public showEliminations()
    //{
    //    this.leagueService.GetData((league: League) =>
    //    {
    //        this.showGroup(league, league.getEliminationsGroup(league.getCurrentSeason(), 'e'));
    //    });
    //}
    //public showArchive(groupSignature: string)
    //{
    //    this.leagueService.GetGroupData(groupSignature, (group: Group) =>
    //    {
    //        //this.leagueGroupTableControl.bind(null, <LeagueGroup>group);
    //        //this.leagueGroupResultListControl.bind(data, group);
    //        //document.getElementById('view-group-title').textContent = group.getTitle();
    //        //this.showView('group');
    //        this.showGroup(null, group);
    //    });
    //}
    Application.prototype.showViewGroup = function (league, group) {
        if (group instanceof LeagueGroup) {
            this.leagueGroupTableControl.bind(league, group);
            this.leagueGroupResultListControl.bind(league, group);
            this.leagueGroupGameListControl.bind(league, group);
            document.getElementById('view-group-title').textContent = group.getTitle();
            this.showView('group');
        }
        else if (group instanceof EliminationsGroup) {
            this.leagueEliminationsTableControl.bind(league, group);
            document.getElementById('view-eliminations-title').textContent = group.getTitle();
            this.showView('eliminations');
        }
    };
    Application.prototype.showPrizes = function () {
        var _this = this;
        if (this.league) {
            var group = this.league.getGroup(this.league.getCurrentSeason(), "a");
            this.leaguePointsControl.update(group);
            this.showView('prizes');
        }
        else {
            var that = this;
            this.lockScreen();
            this.leagueService.GetData(function (league) {
                var group = league.getGroup(league.getCurrentSeason(), "a");
                _this.league = league;
                _this.leaguePointsControl.update(group);
                _this.showView('prizes');
                _this.unlockScreen();
            });
        }
    };
    Application.prototype.showSignIn = function () {
        this.showView('signin');
    };
    Application.prototype.isAdmin = function () {
        return ['papapishu', 'Siasio', 'higaki94', 'Coorchac', 'Maek'].indexOf(this.currentUser()) >= 0;
    };
    Application.prototype.currentUser = function () {
        return Utilities.Cookie.Get('LoginName');
    };
    Application.prototype.joinToEliminations = function () {
        var that = this;
        this.lockScreen();
        $.ajax({
            method: 'POST',
            url: this.leagueService.getServiceUrl() + '/joinToEliminations',
            data: '',
            success: function (data, textStatus, jqXHR) {
                that.loadViewJoin();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                App.addNotificationXHR('Błąd podczas zapisywania. Spróbuj ponownie', jqXHR);
                that.unlockScreen();
            }
        });
    };
    Application.prototype.unjoinFromEliminations = function () {
        var that = this;
        this.lockScreen();
        $.ajax({
            method: 'POST',
            url: this.leagueService.getServiceUrl() + '/unjoinFromEliminations',
            data: '',
            success: function (data, textStatus, jqXHR) {
                that.loadViewJoin();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                App.addNotificationXHR('Błąd podczas zapisywania. Spróbuj ponownie', jqXHR);
                that.unlockScreen();
            }
        });
    };
    Application.prototype.signIn = function () {
        try {
            var loginName = document.getElementById('LoginName').value;
            var password = document.getElementById('Password').value;
            //var handler: any = {};
            //
            //handler.onSuccess = function ()
            //{
            //    App.refreshNavigation();
            //    App.showView('home');
            //};
            //
            //handler.onError = function ()
            //{
            //    App.addNotification('Błąd logowania');
            //};
            $.ajax({
                method: 'POST',
                url: this.leagueService.getServiceUrl() + '/signIn',
                data: 'LoginName=' + loginName + '&Password=' + password,
                success: function (data, textStatus, jqXHR) {
                    App.refreshNavigation();
                    App.showView('home');
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    App.addNotificationXHR('Błąd logowania', jqXHR);
                }
            });
        }
        catch (exception) {
        }
        return false;
    };
    Application.prototype.signOut = function () {
        document.cookie = "Session=; expires=0; path=/";
        document.cookie = "LoginName=; expires=0; path=/";
        this.refreshNavigation();
        this.showView('home');
    };
    Application.prototype.refreshNavigation = function () {
        var currentUser = this.currentUser();
        if (currentUser && currentUser != '') {
            $('#join-button').css('display', 'block');
            $('#signin-button').css('display', 'none');
            $('#signout-button').css('display', '');
        }
        else {
            $('#join-button').css('display', 'none');
            $('#signin-button').css('display', '');
            $('#signout-button').css('display', 'none');
        }
        if (this.isAdmin()) {
            document.getElementById('admin-button').style.display = 'block';
        }
        else {
            document.getElementById('admin-button').style.display = 'none';
        }
    };
    Application.prototype.addUser = function () {
        var that = this;
        var data = '&LoginName=' + $('#adduser-login').val() + '&EMail=' + $('#adduser-email').val();
        this.lockScreen();
        $.ajax({
            method: 'POST',
            url: this.leagueService.getServiceUrl() + '/addUser',
            data: data,
            success: function (data, textStatus, jqXHR) {
                $('#adduser-status').text('OK');
                that.unlockScreen();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#adduser-status').text('Błąd');
                that.unlockScreen();
            }
        });
    };
    Application.prototype.sendPassword = function () {
        var that = this;
        var data = '&LoginName=' + $('#sendpassword-login').val() + '&Body=' + $('#sendpassword-body').val();
        this.lockScreen();
        $.ajax({
            method: 'POST',
            url: this.leagueService.getServiceUrl() + '/sendPassword',
            data: data,
            success: function (data, textStatus, jqXHR) {
                $('#sendpassword-status').text('OK');
                that.unlockScreen();
            },
            error: function (jqXHR, textStatus, errorThrown) {
                $('#sendpassword-status').text('Błąd');
                that.unlockScreen();
            }
        });
    };
    Application.prototype.saveMatch = function () {
        var that = this;
        var season = this.leagueMatchControl.league.getCurrentSeason();
        var groupName = this.leagueMatchControl.group.keyName;
        var player1 = this.leagueMatchControl.match.player1;
        var player2 = this.leagueMatchControl.match.player2;
        var currentUser = this.currentUser();
        var isAdmin = this.isAdmin();
        var kind = -1;
        if (isAdmin) {
            kind = 0;
        }
        else if (currentUser == player1) {
            kind = 1;
        }
        else if (currentUser == player2) {
            kind = 2;
        }
        else {
            return;
        }
        if (kind == 0) {
            var date = '';
            var result = this.leagueMatchControl.getResultEditControl().value;
            var url = this.leagueMatchControl.getUrlEditControl().value;
        }
        else if (kind == 1) {
            var date = this.leagueMatchControl.getDateEditControl().value;
            var result = this.leagueMatchControl.getResult1EditControl().value;
            var url = this.leagueMatchControl.getUrl1EditControl().value;
        }
        else if (kind == 2) {
            var date = this.leagueMatchControl.getDateEditControl().value;
            var result = this.leagueMatchControl.getResult2EditControl().value;
            var url = this.leagueMatchControl.getUrl2EditControl().value;
        }
        else {
            return;
        }
        if (date != '' && !date.match(/^\d+\. \d\d:\d\d$/)) {
            this.addNotificationHTML('Nieprawid&#x142;owa data. U&#x17C;yj formatu <i>dzie&#x144;. godzina:minuta</i>, na przyk&#x142;ad: <b>20. 18:00</b>');
            return;
        }
        var matchId = this.leagueMatchControl.match.id;
        var data = '&Group=' + groupName + '&Id=' + matchId + '&Player1=' + player1 + '&Player2=' + player2 + '&Result=' + result + '&Url=' + url + '&Date=' + date;
        //var handler: any = {};
        //
        //handler.onSuccess = function ()
        //{
        //    var season = that.leagueMatchControl.group.getSeason();
        //    var groupName = that.leagueMatchControl.group.getGroupName();
        //    that.loadViewGroup(season, groupName);
        //};
        //
        //handler.onError = function ()
        //{
        //    that.addNotification("Błąd podczas zapisywania");
        //    that.unlockScreen();
        //};
        this.lockScreen();
        //Utilities.Ajax.requestAsync('POST', this.leagueService.getServiceUrl() + '/saveMatch', data, handler);
        $.ajax({
            method: 'POST',
            url: this.leagueService.getServiceUrl() + '/saveMatch',
            data: data,
            success: function (data, textStatus, jqXHR) {
                var season = that.leagueMatchControl.group.getSeason();
                var groupName = that.leagueMatchControl.group.getGroupName();
                that.loadViewGroup(season, groupName);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                App.addNotificationXHR('Błąd podczas zapisywania', jqXHR);
                that.unlockScreen();
            }
        });
    };
    Application.prototype.lockScreen = function () {
        //document.getElementById('body').style.display = 'none';
        document.getElementById('screen-lock').style.display = '';
    };
    Application.prototype.unlockScreen = function () {
        //document.getElementById('body').style.display = '';
        document.getElementById('screen-lock').style.display = 'none';
    };
    Application.prototype.loadItem = function (name) {
        var that = this;
        this.lockScreen();
        this.leagueService.GetItem("king", "name", function (item) {
        });
    };
    Application.prototype.showView = function (name) {
        var allViews = document.getElementById('views').children;
        for (var i = 0; i < allViews.length; i++) {
            allViews[i].style.display = 'none';
        }
        document.getElementById('side').style.display = 'none';
        document.getElementById('view-' + name).style.display = 'block';
    };
    Application.prototype.handleOnEliminationsTableCellClicked = function (sender, matchModel) {
        if (matchModel.ref1.isPlayer() && matchModel.ref2.isPlayer()) {
            var player1 = sender.group.getPlayer(matchModel.ref1);
            var player2 = sender.group.getPlayer(matchModel.ref2);
            //var matches = sender.group.getMatchesBeetwen(player1.nickname, player2.nickname);
            var match = sender.group.getMatchById(matchModel.id);
            if (match != null) {
                this.leagueMatchControl.bind(sender.league, sender.group, match);
            }
            else {
                var match = Match.createFromPlayerNames(matchModel.id, player1.nickname, player2.nickname);
                this.leagueMatchControl.bind(sender.league, sender.group, match);
            }
        }
    };
    Application.prototype.handleOnGroupPlayerCellClicked = function (sender, player) {
        this.laeguePlayerControl.bind(player.nickname);
        document.getElementById('view-player').scrollIntoView();
        this.showView('player');
    };
    Application.prototype.handleOnGroupMatchCellClicked = function (sender, player1, player2) {
        var matches = sender.group.getMatchesBeetwen(player1.nickname, player2.nickname);
        if (matches.length > 0) {
            this.leagueMatchControl.bind(sender.league, sender.group, matches[0]);
        }
        else {
            var match = Match.createFromPlayerNames('', player1.nickname, player2.nickname);
            this.leagueMatchControl.bind(sender.league, sender.group, match);
        }
    };
    return Application;
})();
var App;
window.onload = function () {
    App = new Application();
    App.refreshNavigation();
    App.unlockScreen();
};
//# sourceMappingURL=app.js.map