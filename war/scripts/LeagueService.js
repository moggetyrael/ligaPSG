var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var LeagueService = (function () {
    function LeagueService() {
    }
    LeagueService.prototype.getServiceUrl = function () {
        if ((window.location.hostname == 'localhost' && window.location.port != '8888') || window.location.hostname == 'localhost.pl') {
            return 'http://localhost:8888';
        }
        else {
            return '';
        }
    };
    LeagueService.prototype.GetGroupData = function (groupSignature, callback) {
        var handler = {};
        handler.callback = callback;
        handler.onSuccess = function (request) {
            this.callback(League.loadGroupDataFromJson(JSON.parse(request.responseText)));
        };
        handler.onError = function (request) {
            //alert('Błąd: ' + request.statusText);
            //alert('Błąd: ' + request.responseText);
        };
        Utilities.Ajax.requestAsync('GET', this.getServiceUrl() + '/getGroupData', 'Group=' + groupSignature, handler);
    };
    LeagueService.prototype.GetData = function (callback) {
        if (window.location.hostname == 'localhost' && window.location.port != '8888') {
        }
        else {
        }
        //window['jQuery'].ajax(
        //{
        //    url: this.getServiceUrl() + '/getData',
        //    type: 'get',
        //    dataType: 'json',
        //    success: function (data)
        //    {
        //        var league = new League();
        //        league.loadDataFromJson(data);
        //        callback(league);
        //    },
        //    error: function (e, msg)
        //    {
        //        alert(msg);
        //    }
        //});
        var handler = {};
        handler.callback = callback;
        handler.onSuccess = function (request) {
            var league = new League();
            league.loadDataFromJson(JSON.parse(request.responseText));
            this.callback(league);
        };
        handler.onError = function (request) {
            //alert('Błąd: ' + request.statusText);
            //alert('Błąd: ' + request.responseText);
        };
        Utilities.Ajax.requestAsync('GET', this.getServiceUrl() + '/getData', null, handler);
    };
    LeagueService.prototype.GetItem = function (kind, name, callback) {
        var handler = {};
        handler.callback = callback;
        handler.onSuccess = function (request) {
            this.callback(League.loadGroupDataFromJson(JSON.parse(request.responseText)));
        };
        handler.onError = function (request) {
            //alert('Błąd: ' + request.statusText);
            //alert('Błąd: ' + request.responseText);
        };
        Utilities.Ajax.requestAsync('GET', this.getServiceUrl() + '/getItem', 'kind=' + kind + '&name=' + name, handler);
    };
    return LeagueService;
})();
var League = (function () {
    function League() {
        this.groups = new Array();
    }
    League.loadGroupDataFromJson = function (data) {
        var group;
        if (data.KeyName.toLowerCase().match(/^.*-e$/)) {
            group = new EliminationsGroup();
            group.keyName = data.KeyName.toLowerCase();
            group.players = [];
            group.matches = [];
            group.model = [];
            for (var j = 0; j < data.Model.length; j++) {
                group.model.push(MatchModel.createFromJson(data.Model[j]));
            }
            for (var j = 0; j < data.Players.length; j++) {
                group.players.push(Player.create(data.Players[j]));
            }
            for (var j = 0; j < data.Matches.length; j++) {
                group.matches.push(Match.createFromJson(data.Matches[j]));
            }
            return group;
        }
        else {
            group = new LeagueGroup();
            group.keyName = data.KeyName.toLowerCase();
            group.players = [];
            group.matches = [];
            for (var j = 0; j < data.Players.length; j++) {
                group.players.push(Player.create(data.Players[j]));
            }
            for (var j = 0; j < data.Matches.length; j++) {
                group.matches.push(Match.createFromJson(data.Matches[j]));
            }
            return group;
        }
    };
    League.prototype.loadDataFromJson = function (data) {
        //this.data = JSON.parse(data);
        this.data = data;
        for (var i = 0; i < this.data.Groups.length; i++) {
            if (this.data.Groups[i]) {
                var group = League.loadGroupDataFromJson(this.data.Groups[i]);
                if (group != null) {
                    this.groups.push(group);
                }
            }
        }
    };
    League.prototype.getPlayersJoinedToEliminations = function () {
        return this.data.PlayersJoinedToEliminations;
    };
    League.prototype.getCurrentSeason = function () {
        return this.data.CurrentSeason;
    };
    League.prototype.getEliminationsGroup = function (season, name) {
        return this.getGroupBySignature(season + '-' + name.toLowerCase());
        //group.model.push(MatchModel.create('1-w-a', '0', '11'));
        //group.model.push(MatchModel.create('1-w-b', '7', '12'));
        //group.model.push(MatchModel.create('1-w-c', '4', '8'));
        //group.model.push(MatchModel.create('1-w-d', '3', ''));
        //group.model.push(MatchModel.create('1-w-e', '2', ''));
        //group.model.push(MatchModel.create('1-w-f', '5', '9'));
        //group.model.push(MatchModel.create('1-w-g', '6', '10'));
        //group.model.push(MatchModel.create('1-w-h', '1', ''));
        //
        //group.model.push(MatchModel.create('2-w-a', '1-w-a', '1-w-b'));
        //group.model.push(MatchModel.create('2-w-b', '1-w-c', '1-w-d'));
        //group.model.push(MatchModel.create('2-w-c', '1-w-e', '1-w-f'));
        //group.model.push(MatchModel.create('2-w-d', '1-w-g', '1-w-h'));
        //
        //group.model.push(MatchModel.create('3-w-a', '2-w-a', '2-w-b'));
        //group.model.push(MatchModel.create('3-w-b', '2-w-c', '2-w-d'));
        //group.model.push(MatchModel.create('3-l-a', '2-w-a', '2-w-b'));
        //group.model.push(MatchModel.create('3-l-b', '2-w-c', '2-w-d'));
        //
        //group.model.push(MatchModel.create('4-w-a', '3-w-a', '3-w-b'));
        //group.model.push(MatchModel.create('4-l-a', '3-l-a', '3-w-a'));
        //group.model.push(MatchModel.create('4-l-b', '3-l-b', '3-w-b'));
        //
        //group.model.push(MatchModel.create('5-l-a', '4-l-a', '4-l-b'));
        //
        //group.model.push(MatchModel.create('6-l-a', '4-w-a', '5-l-a'));
        //
        //var match;
        //group.matches = [];
        //match = Match.createFromPlayerNames('Lilek', 'urtok');
        //match.id = '1-w-a';
        //match.result = MatchResult.Won1;
        //group.matches.push(match);
        //match = Match.createFromPlayerNames('sailent', 'lotysz');
        //match.id = '1-w-b';
        //match.result = MatchResult.Won2;
        //group.matches.push(match);
        //match = Match.createFromPlayerNames('Lilek', 'lotysz');
        //match.id = '2-w-a';
        //match.result = MatchResult.Won1;
        //group.matches.push(match);
        //
        //return group;
    };
    League.prototype.getGroup = function (season, name) {
        return this.getGroupBySignature(season + '-' + name.toLowerCase());
    };
    League.prototype.getGroupBySignature = function (siganture) {
        for (var i = 0; i < this.groups.length; i++) {
            if (this.groups[i].keyName == siganture) {
                return this.groups[i];
            }
        }
        return null;
    };
    return League;
})();
var Player = (function () {
    function Player() {
    }
    Player.create = function (nickname) {
        var player = new Player();
        player.nickname = nickname;
        return player;
    };
    return Player;
})();
var Group = (function () {
    function Group() {
    }
    Group.prototype.getTitle = function () {
        var matches = this.keyName.match(/^(\d+)-(.*)$/);
        if (matches != null && matches.length == 3) {
            var seasonNumber = parseInt(matches[1]);
            var month = Utilities.Text.getMonthName((seasonNumber + 8) % 12);
            var year = (2015 + Math.floor((seasonNumber + 8) / 12));
            var groupName = matches[2] == 'e' ? 'Eliminacje' : ('Grupa ' + matches[2].toUpperCase());
            return month + ' ' + year + ' - ' + groupName;
        }
        return this.keyName;
    };
    Group.prototype.getSeason = function () {
        var matches = this.keyName.match(/^(\d+)-(.*)$/);
        if (matches != null && matches.length == 3) {
            return parseInt(matches[1]);
        }
        return null;
    };
    Group.prototype.getGroupName = function () {
        var matches = this.keyName.match(/^(\d+)-(.*)$/);
        if (matches != null && matches.length == 3) {
            return matches[2];
        }
        return null;
    };
    Group.prototype.getMatchById = function (id) {
        for (var i = 0; i < this.matches.length; i++) {
            if (typeof this.matches[i].id == 'undefined') {
            }
            else if (this.matches[i].id.toLowerCase() == id.toLowerCase()) {
                return this.matches[i];
            }
        }
        return null;
    };
    Group.prototype.getMatchesBeetwen = function (player1, player2) {
        var result = [];
        for (var i = 0; i < this.matches.length; i++) {
            if (this.matches[i].player1 == player1 && this.matches[i].player2 == player2) {
                result.push(this.matches[i]);
            }
            else if (this.matches[i].player1 == player2 && this.matches[i].player2 == player1) {
                result.push(this.matches[i]);
            }
        }
        return result;
    };
    Group.prototype.getPlayerIndex = function (nickname) {
        for (var i = 0; i < this.players.length; i++) {
            if (this.players[i].nickname.toLowerCase() == nickname.trim().toLowerCase()) {
                return i;
            }
        }
        return null;
    };
    return Group;
})();
var LeagueGroup = (function (_super) {
    __extends(LeagueGroup, _super);
    function LeagueGroup() {
        _super.apply(this, arguments);
    }
    LeagueGroup.prototype.refreshScores = function () {
        this.points = {};
        this.sodoses = {};
        for (var i = 0; i < this.players.length; i++) {
            this.points[this.players[i].nickname] = 0;
            this.sodoses[this.players[i].nickname] = 0;
        }
        for (var i = 0; i < this.players.length; i++) {
            for (var j = i + 1; j < this.players.length; j++) {
                var matches = this.getMatchesBeetwen(this.players[i].nickname, this.players[j].nickname);
                if (matches.length > 0) {
                    if (matches[0].hasResult()) {
                        if (matches[0].isWinner(this.players[i].nickname)) {
                            this.points[this.players[i].nickname] += 2;
                            this.points[this.players[j].nickname] += 1;
                        }
                        else {
                            this.points[this.players[i].nickname] += 1;
                            this.points[this.players[j].nickname] += 2;
                        }
                    }
                }
            }
        }
        for (var i = 0; i < this.players.length; i++) {
            for (var j = i + 1; j < this.players.length; j++) {
                var matches = this.getMatchesBeetwen(this.players[i].nickname, this.players[j].nickname);
                if (matches.length > 0) {
                    if (matches[0].hasResult()) {
                        if (matches[0].isWinner(this.players[i].nickname)) {
                            this.sodoses[this.players[i].nickname] += this.points[this.players[j].nickname];
                        }
                        else {
                            this.sodoses[this.players[j].nickname] += this.points[this.players[i].nickname];
                        }
                    }
                }
            }
        }
    };
    return LeagueGroup;
})(Group);
var MatchResult;
(function (MatchResult) {
    MatchResult[MatchResult["Won1"] = 0] = "Won1";
    MatchResult[MatchResult["Won2"] = 1] = "Won2";
    MatchResult[MatchResult["Jigo"] = 2] = "Jigo";
})(MatchResult || (MatchResult = {}));
var Match = (function () {
    function Match() {
    }
    Match.createResultFromJson = function (json) {
        if (json.match(/^1[dDwW!]?$/) != null) {
            return MatchResult.Won1;
        }
        if (json.match(/^2[dDwW!]?$/) != null) {
            return MatchResult.Won2;
        }
        return null;
    };
    Match.createFromPlayerNames = function (id, player1, player2) {
        var match = new Match();
        match.id = id;
        match.player1 = player1;
        match.player2 = player2;
        match.date = '';
        match.date1 = '';
        match.date2 = '';
        match.url = '';
        match.url1 = '';
        match.url2 = '';
        return match;
    };
    Match.createFromJson = function (json) {
        var match = new Match();
        match.id = json.Id;
        match.player1 = json.Player1;
        match.player2 = json.Player2;
        match.result = Match.createResultFromJson(json.Result);
        match.result1 = Match.createResultFromJson(json.Result1);
        match.result2 = Match.createResultFromJson(json.Result2);
        match.url = json.Url;
        match.url1 = json.Url1;
        match.url2 = json.Url2;
        match.date = json.Date;
        match.date1 = json.Date1;
        match.date2 = json.Date2;
        match.walkover = typeof json.Result == 'string' && json.Result.match(/^\d[wW]$/) != null;
        match.id = Utilities.Text.getUndefinedAsEmptyString(match.id);
        match.url = Utilities.Text.getUndefinedAsEmptyString(match.url);
        match.url1 = Utilities.Text.getUndefinedAsEmptyString(match.url1);
        match.url2 = Utilities.Text.getUndefinedAsEmptyString(match.url2);
        match.date = Utilities.Text.getUndefinedAsEmptyString(match.date);
        match.date1 = Utilities.Text.getUndefinedAsEmptyString(match.date1);
        match.date2 = Utilities.Text.getUndefinedAsEmptyString(match.date2);
        return match;
    };
    Match.prototype.getPlayerDate = function (nickname) {
        if (this.player1 == nickname) {
            return this.date1;
        }
        else if (this.player2 == nickname) {
            return this.date2;
        }
        return '';
    };
    Match.prototype.getResultOptionValue = function () {
        if (this.result == null) {
            return '';
        }
        else {
            if (this.result == MatchResult.Won1) {
                return this.walkover ? '1W' : '1';
            }
            else if (this.result == MatchResult.Won2) {
                return this.walkover ? '2W' : '2';
            }
            else if (this.result == MatchResult.Jigo) {
                return this.walkover ? 'dW' : 'd';
            }
        }
    };
    Match.prototype.getResult1OptionValue = function () {
        return this.getResult1OptionValueInternal(this.result1);
    };
    Match.prototype.getResult2OptionValue = function () {
        return this.getResult1OptionValueInternal(this.result2);
    };
    Match.prototype.getResult1OptionValueInternal = function (result) {
        if (result == null) {
            return '';
        }
        else {
            if (result == MatchResult.Won1) {
                return '1';
            }
            else if (result == MatchResult.Won2) {
                return '2';
            }
            else {
                return 'd';
            }
        }
    };
    Match.prototype.hasDate = function () {
        return this.date != null && this.date != '';
    };
    Match.prototype.hasResult = function () {
        return this.getResult() != null;
    };
    Match.prototype.getResult = function () {
        if (this.result != null) {
            return this.result;
        }
        else {
            if (this.result1 != null && this.result2 != null && this.result1 == this.result2) {
                return this.result1;
            }
        }
        return null;
    };
    Match.prototype.isWinner = function (player) {
        var result = this.getResult();
        if (result != null) {
            return (result == MatchResult.Won1 && this.player1 == player)
                || (result == MatchResult.Won2 && this.player2 == player);
        }
        return false;
    };
    Match.prototype.getUrl = function () {
        if (this.url) {
            return this.url;
        }
        else if (this.url1 && this.url2 && this.url1.trim().toLowerCase().localeCompare(this.url2.trim().toLowerCase()) == 0) {
            return this.url1;
        }
        else {
            return '';
        }
    };
    Match.prototype.getResultDate = function () {
        if (this.resultDate) {
            return this.resultDate;
        }
        else if (this.getUrl()) {
            var match = this.getUrl().match(/^.*\/games\/(\d+)\/(\d+)\/(\d+)\/.*$/);
            if (match) {
                this.resultDate = match[1] + '-' + Utilities.Text.pad(match[2], 2) + '-' + Utilities.Text.pad(match[3], 2) + ' 00:00';
                return this.resultDate;
            }
        }
        return '';
    };
    Match.prototype.compareByResultDate = function (match) {
        if (match == null) {
            return -1;
        }
        else {
            if (this.getResultDate()) {
                if (match.getResultDate()) {
                    return -this.getResultDate().localeCompare(match.getResultDate());
                }
                else {
                    return -1;
                }
            }
            else {
                if (match.getResultDate()) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
        }
        return 0;
    };
    Match.prototype.compareByDate = function (match) {
        if (match == null) {
            return -1;
        }
        else {
            if (this.hasDate()) {
                if (match.hasDate()) {
                    return -this.date.localeCompare(match.date);
                }
                else {
                    return -1;
                }
            }
            else {
                if (match.hasDate()) {
                    return 1;
                }
                else {
                    return -1;
                }
            }
        }
        return 0;
    };
    return Match;
})();
var MatchModel = (function () {
    function MatchModel() {
    }
    MatchModel.isUpperGroupMatchId = function (id) {
        var match = id.match(/^\d+-w-.*$/);
        return match != null && match.length > 0;
    };
    MatchModel.create = function (id, ref1, ref2) {
        var match = new MatchModel();
        match.id = id;
        match.ref1 = MatchModelRef.create(ref1);
        match.ref2 = MatchModelRef.create(ref2);
        return match;
    };
    MatchModel.createFromJson = function (json) {
        var match = new MatchModel();
        match.id = json.id;
        match.ref1 = MatchModelRef.create(json.ref1.value);
        match.ref2 = MatchModelRef.create(json.ref2.value);
        return match;
    };
    MatchModel.prototype.resolveReferences = function (group) {
        if (MatchModel.isUpperGroupMatchId(this.id)) {
            this.ref1.resolveReference(group, true);
            this.ref2.resolveReference(group, true);
        }
        else {
            if (this.ref1.isMatchRef()) {
                this.ref1.resolveReference(group, !MatchModel.isUpperGroupMatchId(this.ref1.value));
            }
            if (this.ref2.isMatchRef()) {
                this.ref2.resolveReference(group, !MatchModel.isUpperGroupMatchId(this.ref2.value));
            }
        }
    };
    return MatchModel;
})();
var MatchModelRef = (function () {
    function MatchModelRef() {
    }
    MatchModelRef.create = function (value) {
        var matchRef = new MatchModelRef();
        matchRef.value = value;
        return matchRef;
    };
    MatchModelRef.prototype.isPlayer = function () {
        var match = this.value.match(/^\d+$/);
        return match != null && match.length > 0;
    };
    MatchModelRef.prototype.isMatchRef = function () {
        var match = this.value.match(/^\d+-[wl]-[a-z]+$/);
        return match != null && match.length > 0;
    };
    MatchModelRef.prototype.getLabel = function (group) {
        if (this.isPlayer()) {
            return group.players[parseInt(this.value)].nickname;
        }
        else {
            return this.value;
        }
    };
    MatchModelRef.prototype.resolveReference = function (group, winner) {
        if (this.isMatchRef()) {
            var match = group.getMatchById(this.value);
            if (match == null) {
                var matchModel = group.getMatchModelById(this.value);
                if (matchModel != null) {
                    if (winner) {
                        if (matchModel.ref1.value == '') {
                            this.value = matchModel.ref2.value;
                        }
                        else if (matchModel.ref2.value == '') {
                            this.value = matchModel.ref1.value;
                        }
                    }
                    else {
                        if (matchModel.ref1.value == '' || matchModel.ref2.value == '') {
                            this.value = '';
                        }
                    }
                }
            }
            else {
                var matchResult = match.getResult();
                if (winner && matchResult == MatchResult.Won1 || !winner && matchResult == MatchResult.Won2) {
                    this.value = group.getPlayerIndex(match.player1).toString();
                }
                else if (matchResult == MatchResult.Won1 || matchResult == MatchResult.Won2) {
                    this.value = group.getPlayerIndex(match.player2).toString();
                }
            }
        }
    };
    return MatchModelRef;
})();
var EliminationsGroup = (function (_super) {
    __extends(EliminationsGroup, _super);
    function EliminationsGroup() {
        _super.apply(this, arguments);
    }
    EliminationsGroup.prototype.getPlayer = function (matchRef) {
        var result = null;
        if (matchRef.isPlayer()) {
            result = this.players[parseInt(matchRef.value)];
        }
        return result;
    };
    EliminationsGroup.prototype.getMatchModelById = function (matchId) {
        for (var i = 0; i < this.model.length; i++) {
            if (typeof this.model[i].id == 'undefined') {
            }
            else if (this.model[i].id.toLowerCase() == matchId.toLowerCase()) {
                return this.model[i];
            }
        }
        return null;
    };
    // nie używane i myląca nazwa
    //getMatchesFromModel(matchModel: MatchModel): Match[]
    //{
    //    matchModel.resolveReferences(this);
    //
    //    if (matchModel.ref1.isPlayer() && matchModel.ref2.isPlayer())
    //    {
    //        var player1 = this.getPlayer(matchModel.ref1);
    //        var player2 = this.getPlayer(matchModel.ref2);
    //
    //        if (player1 != null && player2 != null)
    //        {
    //            var matches = this.getMatchesBeetwen(player1.nickname, player2.nickname);
    //
    //            if (matches.length > 0)
    //            {
    //                return matches;
    //            }
    //        }
    //    }
    //}
    EliminationsGroup.prototype.getNumberOfRounds = function () {
        var result = 0;
        for (var i = 0; i < this.model.length; i++) {
            var m = this.model[i].id.match(/^(\d+)-[wl]-.*$/);
            if (m != null && m.length == 2) {
                result = Math.max(result, parseInt(m[1]));
            }
        }
        return result;
    };
    EliminationsGroup.prototype.getMatches = function () {
    };
    EliminationsGroup.prototype.getMatchesInRound = function (k) {
        var result = [];
        for (var i = 0; i < this.model.length; i++) {
            if (this.model[i].id.indexOf((k + 1) + '-') == 0) {
                result.push(this.model[i]);
            }
        }
        return result;
    };
    return EliminationsGroup;
})(Group);
//# sourceMappingURL=LeagueService.js.map