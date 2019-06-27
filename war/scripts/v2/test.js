var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Delegate = (function () {
    function Delegate() {
        this.delegates = [];
    }
    Delegate.Create = function (contextObject, delegateFunction) {
        return function () {
            delegateFunction.apply(contextObject, arguments);
        };
    };
    Delegate.prototype.Add = function (delegate) {
        this.delegates.push(delegate);
    };
    Delegate.prototype.Call = function (args) {
        for (var i = 0; i < this.delegates.length; i++) {
            this.delegates[i].apply(this, args);
        }
    };
    return Delegate;
})();
var AsynchronousOperation = (function () {
    function AsynchronousOperation() {
    }
    AsynchronousOperation.FromFunction = function (f) {
        var operation = new AsynchronousOperation();
        operation.OnCompleted = function () { };
        operation.Run = function () { f(operation.OnCompleted); };
        return operation;
    };
    return AsynchronousOperation;
})();
var RequestMethod;
(function (RequestMethod) {
    RequestMethod[RequestMethod["GET"] = 0] = "GET";
    RequestMethod[RequestMethod["POST"] = 1] = "POST";
})(RequestMethod || (RequestMethod = {}));
var Request = (function () {
    function Request(method, action, data, onSuccess, onError) {
        this.Method = RequestMethod.GET;
        this.Action = '';
        this.Data = '';
        this.Method = method;
        this.Action = action;
        this.Data = data;
        this.OnSuccess = onSuccess;
        this.OnError = onError;
        if (window.XMLHttpRequest) {
            this.RequestObject = new XMLHttpRequest();
        }
        else {
            this.RequestObject = new ActiveXObject("Microsoft.XMLHTTP");
        }
    }
    Request.prototype.Send = function () {
        if (this.Method == RequestMethod.POST) {
            Utility.Console.Log('Sending request: POST');
            this.RequestObject.Request = this;
            this.RequestObject.open("POST", this.Action, true);
            this.RequestObject.onreadystatechange = this.Handler;
            this.RequestObject.setRequestHeader("Content-type", "text/plain");
            this.RequestObject.send(this.Data);
        }
        else {
            Utility.Console.Log('Sending request: GET');
            this.RequestObject.Request = this;
            this.RequestObject.open("GET", this.Action + '?' + this.Data + '&cache=' + (Math.random() * 1000000), true);
            this.RequestObject.onreadystatechange = this.Handler;
            this.RequestObject.setRequestHeader("Content-type", "text/plain");
            this.RequestObject.send();
        }
    };
    Request.prototype.Handler = function () {
        var request = this.Request;
        if (request.RequestObject.readyState == 4) {
            if (request.RequestObject.status == 200) {
                Utility.Console.Log('Request success');
                if (request.OnSuccess) {
                    request.OnSuccess(request);
                }
            }
            else {
                Utility.Console.Log('Request error');
                if (request.OnError) {
                    request.OnError(request);
                }
            }
        }
    };
    return Request;
})();
var DocumentHelper = (function () {
    function DocumentHelper() {
    }
    DocumentHelper.GetElementsByClassName = function (element, className) {
        return document.getElementsByClassName(className);
    };
    DocumentHelper.GetElementById = function (elementId) {
        return (document.getElementById(elementId));
    };
    DocumentHelper.CreateElement = function (tagName, innerHTML) {
        var element = document.createElement(tagName);
        element.innerHTML = innerHTML;
        return element;
    };
    DocumentHelper.GetClosestByTagName = function (element, tagName) {
        while (element != null) {
            if (element.tagName.toUpperCase() == tagName.toUpperCase()) {
                return element;
            }
            element = element.parentNode;
        }
    };
    DocumentHelper.GetClosestByClassName = function (element, className) {
        while (element != null) {
            if (element.getAttribute('class') && element.getAttribute('class').toUpperCase() == className.toUpperCase()) {
                return element;
            }
            element = element.parentNode;
        }
    };
    return DocumentHelper;
})();
var Dictionary = (function () {
    function Dictionary() {
        this.keys = new Array();
        this.values = new Array();
    }
    /*constructor(init: { key: string; value: any; }[])
    {
        for (var x = 0; x < init.length; x++) {
            this[init[x].key] = init[x].value;
            this._keys.push(init[x].key);
            this._values.push(init[x].value);
        }
    }*/
    Dictionary.prototype.Get = function (key) {
        return this[key];
    };
    Dictionary.prototype.Add = function (key, value) {
        this[key] = value;
        this.keys.push(key);
        this.values.push(value);
    };
    Dictionary.prototype.Remove = function (key) {
        var index = this.keys.indexOf(key, 0);
        this.keys.splice(index, 1);
        this.values.splice(index, 1);
        delete this[key];
    };
    Dictionary.prototype.Keys = function () {
        return this.keys;
    };
    Dictionary.prototype.Values = function () {
        return this.values;
    };
    Dictionary.prototype.ContainsKey = function (key) {
        if (typeof this[key] === "undefined") {
            return false;
        }
        return true;
    };
    return Dictionary;
})();
var Utility;
(function (Utility) {
    var CSS = (function () {
        function CSS() {
        }
        CSS.AddClass = function (element, className) {
            //element.class += " " + className;
        };
        return CSS;
    })();
    Utility.CSS = CSS;
    var Cookie = (function () {
        function Cookie() {
        }
        Cookie.Get = function (name) {
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ')
                    c = c.substring(1);
                if (c.indexOf((name + "=")) == 0)
                    return c.substring((name + "=").length, c.length);
            }
            return "";
        };
        return Cookie;
    })();
    Utility.Cookie = Cookie;
    var Console = (function () {
        function Console() {
        }
        Console.Log = function (message) {
            try {
                console.log(message);
            }
            catch (exception) {
            }
        };
        return Console;
    })();
    Utility.Console = Console;
    var HTML = (function () {
        function HTML() {
        }
        HTML.DecodeEntities = function (value) {
            value = value.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
            value = value.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
            HTML.decodeElement.innerHTML = value;
            value = HTML.decodeElement.textContent;
            HTML.decodeElement.textContent = '';
            return value;
        };
        HTML.decodeElement = document.createElement('div');
        return HTML;
    })();
    Utility.HTML = HTML;
})(Utility || (Utility = {}));
var View = (function () {
    function View() {
    }
    return View;
})();
var ViewFactory = (function () {
    function ViewFactory() {
    }
    ViewFactory.prototype.Create = function (definition) {
        var matches;
        if (matches = definition.match(/^#(.*)$/)) {
            return new StaticView(matches[1]);
        }
        else if (definition.match(/^http/)) {
            return new FrameView(definition);
        }
        else {
            throw "Invalid view definition";
        }
    };
    return ViewFactory;
})();
var ViewDispatcher = (function () {
    function ViewDispatcher() {
        this.views = new Dictionary();
        this.viewFactory = new ViewFactory();
    }
    ViewDispatcher.prototype.Dispatch = function (parameters) {
        Utility.Console.Log('LoadView: ' + name);
        this.HideAll();
        if (parameters[0] == 'group' || parameters[0] == 'season') {
            this.activeView = this.GetView('group');
            this.activeView.Load(parameters);
        }
        else {
            this.activeView = this.GetView(parameters[0]);
            this.activeView.Load(parameters.slice(1));
        }
    };
    ViewDispatcher.prototype.AddView = function (name, view) {
        this.views.Add(name, view);
    };
    ViewDispatcher.prototype.GetView = function (name) {
        var view;
        if (this.views.ContainsKey(name)) {
            view = this.views.Get(name);
        }
        else {
            view = this.viewFactory.Create(name);
            this.views.Add(name, view);
        }
        return view;
    };
    ViewDispatcher.prototype.HideAll = function () {
        var viewNodes = DocumentHelper.GetElementsByClassName(document.documentElement, 'view');
        for (var i = 0; i < viewNodes.length; i++) {
            viewNodes[i].style.display = 'none';
        }
    };
    return ViewDispatcher;
})();
var AsynchronousOperationAdapter = (function () {
    function AsynchronousOperationAdapter() {
    }
    AsynchronousOperationAdapter.CreateFromRequest = function (request) {
        var adapter = new AsynchronousOperationAdapter();
        var onSuccess = request.OnSuccess;
        var onError = request.OnError;
        request.OnSuccess = function () {
            onSuccess(request);
            adapter.callback();
        };
        request.OnError = function () {
            onError(request);
            adapter.callback();
        };
        adapter.object = request;
        adapter.function = request.Send;
        adapter.parameters = [];
        return adapter;
    };
    AsynchronousOperationAdapter.CreateFromAsynchronousFunction = function (asynchronousFunction) {
        var adapter = new AsynchronousOperationAdapter();
        adapter.Run = function (callback) {
            asynchronousFunction(callback);
        };
        return adapter;
    };
    AsynchronousOperationAdapter.prototype.Run = function (callback) {
        this.callback = callback;
        this.function.apply(this.object, this.parameters);
    };
    return AsynchronousOperationAdapter;
})();
var ScreenLocker = (function () {
    function ScreenLocker() {
    }
    ScreenLocker.OnClickCloseButton = function (sender) {
        DocumentHelper.GetElementById('popup-background').style.display = 'none';
        DocumentHelper.GetClosestByClassName(sender, 'popup').style.display = 'none';
    };
    ScreenLocker.prototype.Run = function (operation) {
        this.Lock();
        operation.Run(this.Unlock);
    };
    ScreenLocker.prototype.ShowPopup = function (elementId) {
        DocumentHelper.GetElementById('popup-background').style.display = 'table';
        var element = DocumentHelper.GetElementById(elementId);
        element.style.display = 'block';
        element.style.marginLeft = "-" + Math.floor(element.offsetWidth / 2) + "px";
        element.style.marginTop = "-" + Math.floor(element.offsetHeight / 2) + "px";
        var closeButtons = element.getElementsByClassName('close');
        for (var i = 0; i < closeButtons.length; i++) {
            closeButtons[i].setAttribute('onclick', 'ScreenLocker.OnClickCloseButton(this);');
        }
    };
    ScreenLocker.prototype.Lock = function () {
        Utility.Console.Log('Lock');
        ScreenLocker.LockCount++;
        DocumentHelper.GetElementById('screen-lock').style.display = '';
    };
    ScreenLocker.prototype.Unlock = function () {
        Utility.Console.Log('Unlock');
        ScreenLocker.LockCount--;
        if (ScreenLocker.LockCount == 0) {
            DocumentHelper.GetElementById('screen-lock').style.display = 'none';
        }
    };
    ScreenLocker.LockCount = 1;
    return ScreenLocker;
})();
var Notifications = (function () {
    function Notifications() {
    }
    Notifications.OnClickNotification = function (sender) {
        sender.parentNode.removeChild(sender);
    };
    Notifications.prototype.Add = function (message) {
        var element = document.createElement('div');
        element.setAttribute('onclick', 'Notifications.OnClickNotification(this);');
        element.innerHTML = message;
        document.getElementById('notifications').appendChild(element);
    };
    Notifications.prototype.AddRequest = function (message, request) {
        var element = document.createElement('div');
        var responseBody;
        var responseText;
        try {
            element.innerHTML = request.RequestObject.responseText;
            element = element.getElementsByTagName('title')[0];
        }
        catch (exception) {
            element = null;
        }
        if (element) {
            this.Add(message + ": " + decodeURIComponent(element.textContent));
        }
        else {
            this.Add(message + ": " + request.RequestObject.responseText);
        }
    };
    return Notifications;
})();
var Navigation = (function () {
    function Navigation() {
    }
    Navigation.prototype.Refresh = function () {
        if (Runtime.Current.User.Name == '') {
            document.getElementById('signin-btn').style.display = '';
            document.getElementById('signout-btn').style.display = 'none';
        }
        else {
            document.getElementById('signin-btn').style.display = 'none';
            document.getElementById('signout-btn').style.display = '';
        }
    };
    return Navigation;
})();
var User = (function () {
    function User() {
        this.Name = '';
    }
    User.prototype.IsAdmin = function () {
        return this.Name == 'admin';
    };
    User.prototype.Refresh = function () {
        this.Name = Utility.Cookie.Get('LoginName');
    };
    User.prototype.Action = function (parameters) {
        if (parameters[0] == 'signin') {
            var onSuccess = function () {
                Runtime.Current.User.Refresh();
                Runtime.Current.Navigation.Refresh();
            };
            var onError = function (request) {
                Runtime.Current.Notifications.AddRequest('B&#x142;&#x105;d logowania', request);
            };
            var loginName = document.getElementById('LoginName').value;
            var password = document.getElementById('Password').value;
            var request = new Request(RequestMethod.POST, '/signIn', 'LoginName=' + loginName + '&Password=' + password, onSuccess, onError);
            Runtime.Current.ScreenLocker.Run(AsynchronousOperationAdapter.CreateFromRequest(request));
        }
        else if (parameters[0] == 'signout') {
            document.cookie = "Session=; expires=0; path=/";
            document.cookie = "LoginName=; expires=0; path=/";
            Runtime.Current.User.Refresh();
            Runtime.Current.Navigation.Refresh();
        }
        else {
            Runtime.Current.Notifications.Add('Nieznana akcja');
        }
    };
    return User;
})();
var Runtime = (function () {
    function Runtime() {
        this.Navigation = new Navigation();
        this.Views = new ViewDispatcher();
        this.ScreenLocker = new ScreenLocker();
        this.Notifications = new Notifications();
        this.User = new User();
    }
    Runtime.Initialise = function (runtime) {
        Runtime.Current = runtime;
        Runtime.Current.Initialise();
    };
    Runtime.prototype.Initialise = function () {
        this.User.Refresh();
        this.Navigation.Refresh();
        this.ScreenLocker.Unlock();
        //navigationNodes = document.getElementById('nav').getElementsByTagName(li);
        //viewNodes = 
        //document.g
        this.Views.HideAll();
    };
    Runtime.prototype.Action = function (parameters) {
        Utility.Console.Log('Action: ' + parameters);
        var parameterArray = parameters.split('/');
        if (parameterArray[0] == 'view') {
            this.Views.Dispatch(parameterArray.slice(1));
        }
        else if (parameterArray[0] == 'user') {
            this.User.Action(parameterArray.slice(1));
        }
        else {
            Runtime.Current.Notifications.Add('Nieznana akcja: ' + parameters);
        }
    };
    return Runtime;
})();
var StaticView = (function () {
    function StaticView(elementId) {
        this.elementId = elementId;
    }
    StaticView.prototype.Load = function (parameters) {
        DocumentHelper.GetElementById(this.elementId).style.display = 'block';
    };
    StaticView.prototype.Hide = function () {
        DocumentHelper.GetElementById(this.elementId).style.display = 'none';
    };
    return StaticView;
})();
var FrameView = (function () {
    function FrameView(sourceUrl) {
        this.sourceUrl = sourceUrl;
    }
    FrameView.prototype.Load = function (parameters) {
        FrameView.Container.style.display = 'block';
    };
    FrameView.prototype.Hide = function () {
    };
    FrameView.Container = DocumentHelper.GetElementById('iframeview');
    return FrameView;
})();
var MatchResultInGroup = (function () {
    function MatchResultInGroup() {
    }
    return MatchResultInGroup;
})();
var MatchResult;
(function (MatchResult) {
    MatchResult[MatchResult["None"] = 0] = "None";
    MatchResult[MatchResult["Won1"] = 1] = "Won1";
    MatchResult[MatchResult["Won2"] = 2] = "Won2";
    MatchResult[MatchResult["Draw"] = 3] = "Draw";
})(MatchResult || (MatchResult = {}));
var MatchInGroupResult = (function () {
    function MatchInGroupResult() {
        this.Approved = false;
        this.Result = MatchResult.None;
    }
    return MatchInGroupResult;
})();
var MatchInGroup = (function () {
    function MatchInGroup() {
    }
    MatchInGroup.CreateFromJsonString = function (group, json) {
        return MatchInGroup.CreateFromJson(group, JSON.parse(json));
    };
    MatchInGroup.CreateFromJson = function (group, json) {
        var match = new MatchInGroup();
        match.FirstPlayer = group.GetPlayer(json.Player1);
        match.SecondPlayer = group.GetPlayer(json.Player2);
        match.Result = json.Result;
        match.Result1 = json.Result1;
        match.Result2 = json.Result2;
        match.Date = json.Date;
        match.Date1 = json.Date1;
        match.Date2 = json.Date2;
        match.Url = json.Url;
        match.Url1 = json.Url1;
        match.Url2 = json.Url2;
        return match;
    };
    MatchInGroup.CreateEmpty = function (firstPlayer, secondPlayer) {
        var match = new MatchInGroup();
        match.FirstPlayer = firstPlayer;
        match.SecondPlayer = secondPlayer;
        return match;
    };
    MatchInGroup.prototype.HasResult = function () {
        return this.Result && this.Result != '';
    };
    MatchInGroup.prototype.WonFirst = function () {
        return this.Result && (this.Result == '1' || this.Result == '1w' || this.Result == '1W');
    };
    MatchInGroup.prototype.WonSecond = function () {
        return this.Result && (this.Result == '2' || this.Result == '2w' || this.Result == '2W');
    };
    /*GetResult(): MatchInGroupResult
    {
        var result = new MatchInGroupResult();
        
        if (this.Result)
        {
            result.Approved = true;
            result.Result = this.Result;
        }
        else
        {
            result.Approved = false;
            result.Result = MatchResult.None;
            
            if (typeof this.Result1 == 'object' && typeof this.Result2 == 'object')
            {
                if (this.Result1.Result == this.Result2.Result)
                {
                    result.Result = this.Result1.Result;
                }
            }
        }
        
        return result;
    }*/
    MatchInGroup.prototype.GetResultForFirstPlayerAsHtml2 = function () {
        console.log('Result: ' + this.Result);
        if (typeof this.Result == 'object') {
            return '<span>' + this.Result.Result + '</span>';
        }
        return 'error';
    };
    return MatchInGroup;
})();
var PlayerInGroup = (function () {
    function PlayerInGroup(index, name) {
        this.Index = index;
        this.Name = name;
    }
    return PlayerInGroup;
})();
var Group = (function () {
    function Group(data) {
        this.Players = new Array();
        this.Places = [];
        this.Points = [];
        this.SODOSes = [];
        this.Played = [];
        this.matches = [];
    }
    Group.FromResponse = function (request, season, groupName) {
        var group = new Group(data);
        group.Season = season;
        group.GroupName = groupName;
        var data = JSON.parse(request.RequestObject.responseText);
        for (var i = 0; i < data.Players.length; i++) {
            group.Players.push(new PlayerInGroup(i, data.Players[i]));
        }
        //data.Season = this.Season;
        //data.GroupName = this.GroupName;
        //data.Places = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
        //data.Scores = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
        //data.Played = [ 0, 0, 0, 0, 0, 0, 0, 0 ];
        var matches = [[null, null, null, null, null, null, null], [null, null, null, null, null, null], [null, null, null, null, null], [null, null, null, null], [null, null, null], [null, null], [null]];
        for (var i = 0; i < data.Matches.length; i++) {
            var player1 = group.GetPlayer(data.Matches[i].Player1);
            var player2 = group.GetPlayer(data.Matches[i].Player2);
            if (player1 && player2) {
                var match = MatchInGroup.CreateFromJson(group, data.Matches[i]);
                group.SetMatch(player1.Index, player2.Index, match);
            }
            else {
            }
        }
        /*for (var i = 0; i < data.Players.length; i++)
        {
            for (var j = i + 1; j < data.Players.length; j++)
            {
                if (matches[i][j - i - 1] == null)
                {
                    matches[i][j - i - 1] = {Player1: data.Players[i], Player2: data.Players[j], Result: "", Result1: "", Result2: "", Date: "", Date1: "", Date2: "", Link: ""};
                }
            }
        }
        data.Matches = matches;*/
        return group;
    };
    Group.prototype.GetPlayerNames = function () {
        var names = [];
        for (var i = 0; i < this.Players.length; i++) {
            names.push(this.Players[i].Name);
        }
        return names;
    };
    Group.prototype.GetPlayer = function (name) {
        for (var i = 0; i < this.Players.length; i++) {
            if (this.Players[i].Name == name) {
                return this.Players[i];
            }
        }
    };
    Group.prototype.SetMatch = function (player1, player2, match) {
        if (typeof this.matches[player1] == 'undefined') {
            this.matches[player1] = new Array();
        }
        this.matches[player1][player2] = match;
    };
    Group.prototype.GetMatch = function (player1, player2) {
        var match;
        if (this.matches[player1]) {
            match = this.matches[player1][player2];
        }
        if (!match) {
            match = MatchInGroup.CreateEmpty(this.Players[player1], this.Players[player2]);
        }
        return match;
    };
    Group.prototype.RefreshScores = function () {
        for (var i = 0; i < this.Players.length; i++) {
            this.Played[i] = 0;
            this.Points[i] = 0;
            this.SODOSes[i] = 0;
        }
        for (var i = 0; i < this.Players.length; i++) {
            for (var j = i + 1; j < this.Players.length; j++) {
                var match = this.GetMatch(i, j);
                if (match.WonFirst()) {
                    this.Played[i]++;
                    this.Played[j]++;
                    this.Points[i] += 2;
                    this.Points[j] += 1;
                }
                else if (match.WonSecond()) {
                    this.Played[i]++;
                    this.Played[j]++;
                    this.Points[i] += 1;
                    this.Points[j] += 2;
                }
            }
        }
        for (var i = 0; i < this.Players.length; i++) {
            for (var j = i + 1; j < this.Players.length; j++) {
                var match = this.GetMatch(i, j);
                if (match.WonFirst()) {
                    this.SODOSes[i] += this.Points[j];
                }
                else if (match.WonSecond()) {
                    this.SODOSes[j] += this.Points[i];
                }
            }
        }
    };
    return Group;
})();
var ResultsTable = (function () {
    function ResultsTable() {
        this.Container = document.getElementById('results-table');
    }
    ResultsTable.prototype.SetGroup = function (group) {
        this.Group = group;
    };
    ResultsTable.prototype.Sort = function () {
        var table = this.Container.children[0];
        var rows = [];
        while (table.children.length > 1) {
            rows.push(table.removeChild(table.children[1]));
        }
        var that = this;
        var sortFunction = function (a, b) {
            var player1 = that.Group.GetPlayer(a.children[1].textContent);
            var player2 = that.Group.GetPlayer(b.children[1].textContent);
            //console.log(player1.Name + ': ' + that.Group.Scores[player1.Index]);
            //console.log(player2.Name + ': ' + that.Group.Scores[player2.Index]);
            var d = that.Group.Points[player2.Index] - that.Group.Points[player1.Index];
            if (d == 0) {
                d = that.Group.SODOSes[player2.Index] - that.Group.SODOSes[player1.Index];
                if (d == 0) {
                    d = (a.children[1].textContent.toUpperCase() > b.children[1].textContent.toUpperCase()) ? 1 : -1;
                }
            }
            return d;
        };
        rows.sort(sortFunction);
        for (var i = 0; i < rows.length; i++) {
            table.appendChild(rows[i]);
        }
    };
    ResultsTable.prototype.Render = function () {
        var header = document.createElement("tbody");
        var row; //= document.createElement("tr");
        header.innerHTML = '<tr><td>Miejsce</td><td>Gracz</td><td>Punkty</td><td>SODOS</td></tr>';
        var table = document.createElement("table");
        table.appendChild(header);
        for (var j = 0; j < this.Group.Players.length; j++) {
            row = document.createElement("tr");
            row.innerHTML = '<td>-</td><td>' + this.Group.Players[j].Name + '</td><td>-</td><td>-</td>';
            table.appendChild(row);
        }
        table.setAttribute('class', 'matches');
        //resultsTable.appendChild(header);
        //resultsTable.appendChild(body);
        this.Container.innerHTML = '';
        this.Container.appendChild(table);
        this.Refresh();
    };
    ResultsTable.prototype.Refresh = function () {
        this.Group.RefreshScores();
        var table = this.Container.children[0];
        for (var i = 0; i < this.Group.Players.length; i++) {
            table.children[i + 1].children[2].textContent = this.Group.Points[i].toString();
            table.children[i + 1].children[3].textContent = this.Group.SODOSes[i].toString();
        }
        this.Sort();
    };
    return ResultsTable;
})();
var MatchList = (function () {
    function MatchList() {
        this.Container = document.getElementById('match-list');
    }
    MatchList.prototype.SetGroup = function (group) {
        this.Group = group;
    };
    MatchList.prototype.Render = function () {
        try {
            //this.Username = Utilities.GetCookie('LoginName');
            var header = document.createElement("tbody");
            var headerRow = document.createElement("tr");
            headerRow.innerHTML = '<td colspan="2">Gracz 1</td><td colspan="2">Gracz 2</td><td>Data</td><td></td>';
            header.appendChild(headerRow);
            var body = document.createElement("tbody");
            var that = this;
            var onMatchSaved = function () {
                Action('view/season/' + that.Group.Season + '/group/' + that.Group.GroupName);
            };
            for (var i = 0; i < this.Group.Players.length; i++) {
                for (var j = i + 1; j < this.Group.Players.length; j++) {
                    /*var row = document.createElement("tr");
                    var cell;
                    cell = document.createElement("td");
                    cell.textContent = this.Group.Players[i].Name;
                    row.appendChild(cell);
                    row.appendChild(this.RenderResultEditCell(i, j, i));
                    cell = document.createElement("td");
                    cell.textContent = this.Group.Players[j].Name;
                    row.appendChild(cell);
                    //row.appendChild(this.RenderResultEditCell(i, j, j));
                    row.appendChild(document.createElement("td"));
                    //row.appendChild(this.RenderDateEditCell(i, j, j));
                    //row.appendChild(League.UI.CreateMatchListResultCell(group, i, j, username));
                    //this.UpdateRow(row);
*/
                    var match = this.Group.GetMatch(i, j);
                    //var matchResult = match.GetResult();
                    var row = MatchTableRow.CreateFromMatch(this.Group.Players[i].Name, this.Group.Players[j].Name, this.Group, onMatchSaved);
                    body.appendChild(row);
                }
            }
            var resultsTable = document.createElement("table");
            resultsTable.setAttribute('class', 'matches');
            resultsTable.appendChild(header);
            resultsTable.appendChild(body);
            this.Container.innerHTML = '';
            this.Container.appendChild(resultsTable);
            this.Sort();
        }
        catch (exception) {
            alert('B&#x142;&#x105;d przy renderowaniu listy gier. ' + exception);
        }
    };
    MatchList.prototype.RenderResultEditCell = function (i, j, k) {
        var cell = document.createElement("td");
        if (this.Group.Players[k].Name == Runtime.Current.User.Name) {
            cell.innerHTML = '<div class="editable" onclick="League.UI.Handlers.OnClickEditMatchResult(this);">brak</div><div style="display: none;"><select><option value=""></option><option value="1">Gracz 1</option><option value="2">Gracz 2</option><option value="D">Remis</option></select>&nbsp;<input type="button" value="Zapisz" onclick="League.UI.Handlers.OnClickSaveMatchResult(this);" /></div>';
        }
        else {
            cell.innerHTML = '<div>brak</div>';
        }
        return cell;
    };
    MatchList.prototype.RenderDateEditCell = function (i, j, k) {
        var cell = document.createElement("td");
        cell.setAttribute('class', 'proposal display');
        var row;
        if (this.Group.Players[i].Name == Runtime.Current.User.Name || this.Group.Players[j].Name == Runtime.Current.User.Name) {
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
        }
        return cell;
    };
    MatchList.prototype.UpdateRow = function (row) {
    };
    MatchList.prototype.Sort = function () {
        var table = this.Container.children[0].children[1];
        var rows = [];
        while (table.children.length) {
            rows.push(table.removeChild(table.children[0]));
        }
        var that = this;
        var sortFunction = function (a, b) {
            var match1 = that.GetMatch(a);
            var match2 = that.GetMatch(b);
            if (match1.Result && match1.Result != '') {
                return -1;
            }
            else if (match2.Result && match2.Result != '') {
                return 1;
            }
            else if ((match1.Result1 && match1.Result1 != '') || (match1.Result2 && match1.Result2 != '')) {
                return -1;
            }
            else if ((match2.Result1 && match2.Result1 != '') || (match2.Result2 && match2.Result2 != '')) {
                return 1;
            }
            else if (match1.Date && match1.Date != '') {
                return -1;
            }
            else if (match2.Date && match2.Date != '') {
                return 1;
            }
            else {
                return 1;
            }
        };
        rows.sort(sortFunction);
        for (var i = 0; i < rows.length; i++) {
            table.appendChild(rows[i]);
        }
    };
    MatchList.prototype.GetMatch = function (row) {
        var player1Name = this.GetPlayer1Name(row);
        var player2Name = this.GetPlayer2Name(row);
        var player1 = this.Group.GetPlayer(player1Name);
        var player2 = this.Group.GetPlayer(player2Name);
        return this.Group.GetMatch(player1.Index, player2.Index);
    };
    MatchList.prototype.GetPlayer1Name = function (row) {
        return row.children[0].textContent;
    };
    MatchList.prototype.GetPlayer2Name = function (row) {
        return row.children[2].textContent;
    };
    return MatchList;
})();
var DoubleElimintationMatch = (function () {
    function DoubleElimintationMatch() {
    }
    return DoubleElimintationMatch;
})();
var DoubleElimintationRound = (function () {
    function DoubleElimintationRound(number, firstSet, secondSet) {
        this.UpperGroup = this.CreateGroup(number + "-u-", firstSet);
        this.LowerGroup = this.CreateGroup(number + "-l-", secondSet);
    }
    DoubleElimintationRound.prototype.GetMatchByIdentity = function (identity) {
        var match = this.GetMatchByIdentityFromGroup(identity, this.UpperGroup);
        if (match == null) {
            match = this.GetMatchByIdentityFromGroup(identity, this.LowerGroup);
        }
        return match;
    };
    DoubleElimintationRound.prototype.GetMatchByIdentityFromGroup = function (identity, group) {
        for (var i = 0; i < group.length; i++) {
            if (group[i].Identity == identity) {
                console.log('found!');
                return group[i];
            }
        }
        return null;
    };
    DoubleElimintationRound.prototype.CreateGroup = function (number, playerReferences) {
        var group = new Array();
        var groupSize = Math.ceil(playerReferences.length / 2);
        if (playerReferences.length == 1) {
            return group;
        }
        for (var i = 0; i < groupSize; i++) {
            var match = new DoubleElimintationMatch();
            match.Identity = number + 'abcdefghijklmnop'.charAt(i);
            group.push(match);
        }
        for (var i = 0; i < playerReferences.length; i++) {
            if (i < groupSize) {
                group[i].FirstRef = playerReferences[i];
            }
            else {
                group[groupSize - (i - groupSize + 1)].SecondRef = playerReferences[i];
            }
        }
        return group;
    };
    return DoubleElimintationRound;
})();
var DoubleElimintation = (function () {
    function DoubleElimintation(players) {
        this.Rounds = [];
        var firstSet = players;
        var secondSet = [];
        var roundNumber = 0;
        do {
            roundNumber++;
            var round = new DoubleElimintationRound(roundNumber.toString(), firstSet, secondSet);
            this.Rounds.push(round);
            firstSet = [];
            secondSet = [];
            for (var i = 0; i < round.UpperGroup.length; i++) {
                firstSet.push('Zwycięzca ' + round.UpperGroup[i].Identity);
                secondSet.push('Pokonany ' + round.UpperGroup[i].Identity);
            }
            for (var i = 0; i < round.LowerGroup.length; i++) {
                secondSet.push('Zwycięzca ' + round.LowerGroup[i].Identity);
            }
        } while (secondSet.length > 1);
    }
    DoubleElimintation.prototype.GetMatchByIdentity = function (identity) {
        if (typeof identity == 'string') {
            var matches = identity.match(/^(\d+)\-[ulUL]\-[a-zA-Z]$/);
            if (matches) {
                return this.Rounds[parseInt(matches[1]) - 1].GetMatchByIdentity(identity);
            }
        }
        return null;
    };
    return DoubleElimintation;
})();
var MatchPopup = (function () {
    function MatchPopup(group, match) {
        this.group = group;
        this.match = match;
        this.htmlElement = document.getElementById('testpopup');
    }
    MatchPopup.GetResultLabel = function (result) {
        if (result) {
            if (result == '1') {
                return 'Wygrał gracz 1';
            }
            else if (result == '2') {
                return 'Wygrał gracz 2';
            }
            else if (result.toLowerCase() == 'd') {
                return 'Remis';
            }
        }
        return '';
    };
    MatchPopup.prototype.SetFormValue = function (owner, kind, label, value) {
        if (typeof label == 'undefined') {
            label = '';
        }
        if (typeof value == 'undefined') {
            value = '';
        }
        document.getElementById('match-popup-edit-' + owner + '-' + kind).value = value;
        document.getElementById('match-popup-display-' + owner + '-' + kind).textContent = label;
    };
    MatchPopup.prototype.GetFormValue = function (owner, kind) {
        return document.getElementById('match-popup-edit-' + owner + '-' + kind).value;
    };
    MatchPopup.prototype.Show = function () {
        Utility.Console.Log('MatchPopup:Show');
        var that = this;
        var owner = '';
        var resultElement = DocumentHelper.GetElementsByClassName(this.htmlElement, 'match-result')[0];
        resultElement.children[0].textContent = this.match.FirstPlayer.Name;
        resultElement.children[3].textContent = this.match.SecondPlayer.Name;
        if (this.match.Result && this.match.Result != '') {
            resultElement.children[1].textContent = MatchTableRow.GetResultLabel(this.match.Result, 1);
            resultElement.children[2].textContent = MatchTableRow.GetResultLabel(this.match.Result, 2);
        }
        else {
            resultElement.children[1].textContent = MatchTableRow.GetResultLabel(this.match.Result1, 1);
            resultElement.children[2].textContent = MatchTableRow.GetResultLabel(this.match.Result2, 2);
        }
        if (Runtime.Current.User.Name == this.match.FirstPlayer.Name) {
            owner = 'player1';
        }
        else {
            owner = 'player2';
        }
        DocumentHelper.GetElementsByClassName(this.htmlElement, 'save')[0].style.display = 'none';
        if (this.match.Result && this.match.Result != '') {
            DocumentHelper.GetElementsByClassName(resultElement[0], 'player1 edit')[0].style.display = 'none';
            DocumentHelper.GetElementsByClassName(resultElement[0], 'player1 display')[0].style.display = 'none';
            DocumentHelper.GetElementsByClassName(resultElement[0], 'player2 edit')[0].style.display = 'none';
            DocumentHelper.GetElementsByClassName(resultElement[0], 'player2 display')[0].style.display = 'none';
            DocumentHelper.GetElementsByClassName(resultElement[0], 'admin edit')[0].style.display = 'none';
            DocumentHelper.GetElementsByClassName(resultElement[0], 'admin display')[0].style.display = 'none';
        }
        else {
            if (Runtime.Current.User.Name == this.match.FirstPlayer.Name) {
                DocumentHelper.GetElementsByClassName(resultElement[0], 'player1 edit')[0].style.display = '';
                DocumentHelper.GetElementsByClassName(resultElement[0], 'player1 display')[0].style.display = 'none';
                DocumentHelper.GetElementsByClassName(this.htmlElement, 'save')[0].style.display = '';
            }
            else {
                DocumentHelper.GetElementsByClassName(resultElement[0], 'player1 edit')[0].style.display = 'none';
                DocumentHelper.GetElementsByClassName(resultElement[0], 'player1 display')[0].style.display = '';
            }
            if (Runtime.Current.User.Name == this.match.SecondPlayer.Name) {
                DocumentHelper.GetElementsByClassName(resultElement[0], 'player2 edit')[0].style.display = '';
                DocumentHelper.GetElementsByClassName(resultElement[0], 'player2 display')[0].style.display = 'none';
                DocumentHelper.GetElementsByClassName(this.htmlElement, 'save')[0].style.display = '';
            }
            else {
                DocumentHelper.GetElementsByClassName(resultElement[0], 'player2 edit')[0].style.display = 'none';
                DocumentHelper.GetElementsByClassName(resultElement[0], 'player2 display')[0].style.display = '';
            }
            if (Runtime.Current.User.IsAdmin()) {
                DocumentHelper.GetElementsByClassName(resultElement[0], 'admin edit')[0].style.display = '';
                DocumentHelper.GetElementsByClassName(resultElement[0], 'admin display')[0].style.display = 'none';
            }
            else {
                DocumentHelper.GetElementsByClassName(resultElement[0], 'admin edit')[0].style.display = 'none';
                DocumentHelper.GetElementsByClassName(resultElement[0], 'admin display')[0].style.display = 'none';
            }
        }
        if (Runtime.Current.User.IsAdmin()) {
            owner = 'admin';
            DocumentHelper.GetElementsByClassName(this.htmlElement, 'save')[0].style.display = '';
            DocumentHelper.GetElementsByClassName(resultElement[0], 'admin edit')[0].style.display = '';
        }
        this.SetFormValue('player1', 'result', MatchPopup.GetResultLabel(this.match.Result1), this.match.Result1);
        this.SetFormValue('player1', 'url', this.match.Url1, this.match.Url1);
        this.SetFormValue('player1', 'date', this.match.Date1, this.match.Date1);
        this.SetFormValue('player2', 'result', MatchPopup.GetResultLabel(this.match.Result2), this.match.Result2);
        this.SetFormValue('player2', 'url', this.match.Url2, this.match.Url2);
        this.SetFormValue('player2', 'date', this.match.Date2, this.match.Date2);
        this.SetFormValue('admin', 'result', this.match.Result, this.match.Result);
        this.SetFormValue('admin', 'url', this.match.Url, this.match.Url);
        var onSave = function () {
            var selectedDate = that.GetFormValue(owner, 'date');
            var save = function (callback) {
                var onRequestSuccess = function (request) {
                    Utility.Console.Log('MatchPopup:OnSaveRequestSuccess');
                    that.group.SetMatch(that.match.FirstPlayer.Index, that.match.SecondPlayer.Index, MatchInGroup.CreateFromJsonString(that.group, request.RequestObject.responseText));
                    if (that.OnMatchSaved) {
                        that.OnMatchSaved.OnCompleted = function () { callback(); ScreenLocker.OnClickCloseButton(that.htmlElement); };
                        that.OnMatchSaved.Run();
                    }
                };
                var onRequestError = function (request) {
                    Utility.Console.Log('MatchPopup:OnSaveRequestError');
                    Runtime.Current.Notifications.AddRequest("B&#x142;&#x105;d podczas zapisywania meczu", request);
                    ScreenLocker.OnClickCloseButton(that.htmlElement);
                    callback();
                };
                var data = 'Season=' + that.group.Season + '&GroupName=' + that.group.GroupName + '&Player1=' + that.match.FirstPlayer.Name + '&Player2=' + that.match.SecondPlayer.Name + '&Result=' + that.GetFormValue(owner, 'result') + '&Url=' + that.GetFormValue(owner, 'url') + '&Date=' + selectedDate;
                var request = new Request(RequestMethod.POST, '/saveMatch', data, onRequestSuccess, onRequestError);
                request.Send();
            };
            if (selectedDate != '' && !selectedDate.match(/^\d+\. \d\d:\d\d$/)) {
                Runtime.Current.Notifications.Add('Nieprawid&#x142;owa data. U&#x17C;yj formatu <i>dzie&#x144;. godzina:minuta</i>, na przyk&#x142;ad: <b>20. 18:00</b>');
            }
            else {
                Runtime.Current.ScreenLocker.Run(AsynchronousOperationAdapter.CreateFromAsynchronousFunction(save));
            }
        };
        DocumentHelper.GetElementsByClassName(this.htmlElement, 'save')[0].onclick = onSave;
        this.htmlElement.Match = this.match;
        Runtime.Current.ScreenLocker.ShowPopup('testpopup');
    };
    return MatchPopup;
})();
var DoubleElimintationResultsTable = (function () {
    function DoubleElimintationResultsTable() {
        this.Container = document.getElementById('eliminations-tree');
    }
    DoubleElimintationResultsTable.GetGroupFromTableElement = function (element) {
        var table = DocumentHelper.GetClosestByTagName(element, 'table');
        var tableControl = table.DoubleElimintationResultsTable;
        return tableControl.Group;
    };
    DoubleElimintationResultsTable.GetMatchFromRowElement = function (element) {
        var table = DocumentHelper.GetClosestByTagName(element, 'table');
        var row = DocumentHelper.GetClosestByTagName(element, 'tr');
        //var players = DocumentHelper.GetElementsByClassName(row, 'player');
        var tableControl = table.DoubleElimintationResultsTable;
        var firstPlayer = tableControl.Group.GetPlayer(row.children[1].textContent);
        var secondPlayer = tableControl.Group.GetPlayer(row.children[3].textContent);
        return tableControl.Group.GetMatch(firstPlayer.Index, secondPlayer.Index);
    };
    DoubleElimintationResultsTable.GetControlFromTableElement = function (element) {
        var table = DocumentHelper.GetClosestByTagName(element, 'table');
        return table.DoubleElimintationResultsTable;
    };
    DoubleElimintationResultsTable.prototype.SetGroup = function (group) {
        this.Group = group;
    };
    DoubleElimintationResultsTable.prototype.Render = function () {
        this.Container.innerHTML = '';
        var tree = new DoubleElimintation(this.Group.GetPlayerNames());
        for (var i = 0; i < tree.Rounds.length; i++) {
            this.FillRoundWithData(tree, tree.Rounds[i]);
        }
        for (var i = 0; i < tree.Rounds.length; i++) {
            this.RenderRound(i + 1, tree.Rounds[i]);
        }
    };
    DoubleElimintationResultsTable.prototype.FillRoundWithData = function (tree, round) {
        this.FillGroupWithData(tree, round.UpperGroup, true);
        this.FillGroupWithData(tree, round.LowerGroup, false);
    };
    DoubleElimintationResultsTable.prototype.FillGroupWithData = function (tree, group, isUpper) {
        for (var j = 0; j < group.length; j++) {
            group[j].FirstRef = this.ResolveMatchRef(tree, group[j].FirstRef);
            group[j].SecondRef = this.ResolveMatchRef(tree, group[j].SecondRef);
            continue;
            var matchRef1 = tree.GetMatchByIdentity(group[j].FirstRef.split(' ')[1]);
            if (matchRef1) {
                var player1 = this.Group.GetPlayer(matchRef1.FirstRef);
                var player2 = this.Group.GetPlayer(matchRef1.SecondRef);
                if (player1 && player2) {
                    group[j].FirstRef = 'players1';
                    var match = this.Group.GetMatch(player1.Index, player2.Index);
                    if (match && match.Result && match.Result != '') {
                        group[j].FirstRef = 'match';
                        if (isUpper) {
                            if (match.Result == '1' || match.Result == '1W') {
                                group[j].FirstRef = match.FirstPlayer.Name;
                            }
                            else if (match.Result == '2' || match.Result == '2W') {
                                group[j].FirstRef = match.SecondPlayer.Name;
                            }
                        }
                    }
                }
            }
        }
    };
    DoubleElimintationResultsTable.prototype.ResolveMatchRef = function (tree, matchRefAsText) {
        if (matchRefAsText) {
            var matchRefComponents = matchRefAsText.split(' ');
            var matchRef = tree.GetMatchByIdentity(matchRefComponents[1]);
            if (matchRef) {
                if (typeof matchRef.SecondRef == 'undefined' || matchRef.SecondRef == '') {
                    if (matchRefComponents[0][0] == 'Z') {
                        return matchRef.FirstRef;
                    }
                    else {
                        return '';
                    }
                }
                else if (typeof matchRef.FirstRef == 'undefined' || matchRef.FirstRef == '') {
                    if (matchRefComponents[0][0] == 'Z') {
                        return matchRef.SecondRef;
                    }
                    else {
                        return '';
                    }
                }
                var player1 = this.Group.GetPlayer(matchRef.FirstRef);
                var player2 = this.Group.GetPlayer(matchRef.SecondRef);
                if (player1 && player2) {
                    var match = this.Group.GetMatch(player1.Index, player2.Index);
                    if (match && match.Result && match.Result != '') {
                        if (matchRefComponents[0][0] == 'Z') {
                            if (match.Result == '1' || match.Result == '1W') {
                                return match.FirstPlayer.Name;
                            }
                            else if (match.Result == '2' || match.Result == '2W') {
                                return match.SecondPlayer.Name;
                            }
                            else if (match.Result.toLowerCase() == 'dw') {
                                return '';
                            }
                        }
                        else {
                            if (match.Result == '1' || match.Result == '1W') {
                                return match.SecondPlayer.Name;
                            }
                            else if (match.Result == '2' || match.Result == '2W') {
                                return match.FirstPlayer.Name;
                            }
                            else if (match.Result.toLowerCase() == 'dw') {
                                return '';
                            }
                        }
                    }
                }
            }
        }
        return matchRefAsText;
    };
    DoubleElimintationResultsTable.prototype.RenderRound = function (roundNumber, round) {
        var table = document.createElement('table');
        table.DoubleElimintationResultsTable = this;
        table.setAttribute('class', 'matches');
        var headerRow = DocumentHelper.CreateElement('tr', '<td colspan="7">Runda ' + roundNumber + '</td>');
        headerRow.setAttribute('class', 'header');
        table.appendChild(headerRow);
        this.RenderGroup(table, round.UpperGroup);
        var separatorRow = DocumentHelper.CreateElement('tr', '<td colspan="7"></td>');
        separatorRow.setAttribute('class', 'separator');
        table.appendChild(separatorRow);
        this.RenderGroup(table, round.LowerGroup);
        this.Container.appendChild(table);
    };
    DoubleElimintationResultsTable.prototype.RenderGroup = function (table, group) {
        var that = this;
        var onMatchSaved = function () {
            Action('view/season/' + that.Group.Season + '/group/' + that.Group.GroupName);
        };
        for (var j = 0; j < group.length; j++) {
            var firstPlayer = this.Group.GetPlayer(group[j].FirstRef);
            var secondPlayer = this.Group.GetPlayer(group[j].SecondRef);
            var matchResult = new MatchInGroupResult();
            if (firstPlayer && secondPlayer) {
                var match = this.Group.GetMatch(firstPlayer.Index, secondPlayer.Index);
            }
            var row = MatchTableRow.CreateFromMatch(group[j].FirstRef, group[j].SecondRef, this.Group, onMatchSaved);
            row.insertBefore(DocumentHelper.CreateElement('td', group[j].Identity), row.children[0]);
            table.appendChild(row);
        }
    };
    return DoubleElimintationResultsTable;
})();
var MatchTableRow = (function () {
    function MatchTableRow() {
    }
    MatchTableRow.GetResultLabel = function (result, player) {
        if (result) {
            if (result == '1') {
                return player == 1 ? "1" : "0";
            }
            else if (result == '2') {
                return player == 1 ? "0" : "1";
            }
            if (result == '1W') {
                return player == 1 ? "W" : "W";
            }
            else if (result == '2W') {
                return player == 1 ? "W" : "W";
            }
            else if (result.toLowerCase() == 'dw') {
                return 'W';
            }
            else if (result.toLowerCase() == 'd') {
                return '=';
            }
        }
        return '';
    };
    MatchTableRow.GetResultCssClass = function (result1, result2) {
        if (result1 && result1 != '' && result2 && result2 != '' && result1 == result2) {
            if (result1 == '1' || result1 == '1W') {
                return 'won-1';
            }
            else if (result1 == '2' || result1 == '2W') {
                return 'won-2';
            }
            else if (result1.toLowerCase() == 'd') {
                return 'draw';
            }
            else if (result1.toLowerCase() == 'dw') {
                return 'wo';
            }
        }
        return '';
    };
    MatchTableRow.CreateFromMatch = function (player1Name, player2Name, group, onSaved) {
        var player1 = group.GetPlayer(player1Name);
        var player2 = group.GetPlayer(player2Name);
        var cssClasses = '';
        var result1Label = '';
        var result2Label = '';
        var matchResult = new MatchInGroupResult();
        var match;
        var actionsHtml = '';
        var editable = false;
        var dateLabel = '';
        var kifuUrl;
        if (player1 && player2) {
            match = group.GetMatch(player1.Index, player2.Index);
        }
        if (match) {
            if (match.Result && match.Result != '') {
                result1Label = MatchTableRow.GetResultLabel(match.Result, 1);
                result2Label = MatchTableRow.GetResultLabel(match.Result, 2);
                cssClasses = 'approved ' + MatchTableRow.GetResultCssClass(match.Result, match.Result);
                kifuUrl = match.Url;
            }
            else {
                result1Label = MatchTableRow.GetResultLabel(match.Result1, 1);
                result2Label = MatchTableRow.GetResultLabel(match.Result2, 2);
                if (Runtime.Current.User.Name == player1Name || Runtime.Current.User.Name == player2Name) {
                    editable = true;
                }
                if (match.Result1 && match.Result1 != '' && match.Result2 && match.Result2 != '' && match.Result1 == match.Result2) {
                    cssClasses = ' ' + MatchTableRow.GetResultCssClass(match.Result1, match.Result2);
                    if (match.Result1 == '1') {
                        if (match.Url1 && match.Url1 != '') {
                            kifuUrl = match.Url1;
                        }
                        else {
                            kifuUrl = match.Url2;
                        }
                    }
                    else if (match.Result1 == '2') {
                        if (match.Url2 && match.Url2 != '') {
                            kifuUrl = match.Url2;
                        }
                        else {
                            kifuUrl = match.Url1;
                        }
                    }
                    else if (match.Result1 == 'd') {
                        if (match.Url1 && match.Url1 != '' && match.Url2 && match.Url2 != '' && match.Url1 == match.Url2) {
                            kifuUrl = match.Url1;
                        }
                    }
                }
                else {
                    if (match.Date && match.Date != '') {
                        dateLabel = match.Date;
                    }
                    else if (Runtime.Current.User.Name == player1Name) {
                        if (match.Date2 && match.Date2 != '') {
                            dateLabel = match.Date2 + ' *';
                        }
                        if (match.Date1 && match.Date1 != '') {
                            dateLabel = match.Date1 + ' **';
                        }
                    }
                    else if (Runtime.Current.User.Name == player2Name) {
                        if (match.Date1 && match.Date1 != '') {
                            dateLabel = match.Date1 + ' *';
                        }
                        if (match.Date2 && match.Date2 != '') {
                            dateLabel = match.Date2 + ' **';
                        }
                    }
                }
            }
        }
        /*if (matchResult.Result == MatchResult.Won1)
        {
            result1 = 'X';
            result2 = 'O';
            additionalClasses += ' won-1';
        }
        else if (matchResult.Result == MatchResult.Won2)
        {
            result1 = 'O';
            result2 = 'X';
            additionalClasses += ' won-2';
        }
        else if (matchResult.Result == MatchResult.Draw)
        {
            result1 = '=';
            result2 = '=';
            additionalClasses += ' draw';
        }*/
        if (kifuUrl && kifuUrl != '') {
            actionsHtml += '<a target="_blank" href="http://eidogo.com/#url:' + kifuUrl + '">Kifu</a>';
        }
        if (editable || Runtime.Current.User.IsAdmin()) {
            actionsHtml += '<a href="#" onclick="MatchTableRow.OnClickMatch(this); return false;">Edytuj</a>';
        }
        if (typeof player2Name == 'undefined') {
            player2Name = '';
        }
        var row = DocumentHelper.CreateElement('tr', '<td class="first player">' + player1Name
            + '</td><td class="first result">' + result1Label + '</td><td class="second player">'
            + player2Name + '</td><td class="second result">' + result2Label + '</td><td>' + dateLabel + '</td><td>' + actionsHtml + '</td>');
        row.setAttribute('class', cssClasses);
        if (editable || Runtime.Current.User.IsAdmin()) {
            row.Group = group;
            row.Match = match;
            row.OnSaved = onSaved;
        }
        else {
        }
        return row;
    };
    MatchTableRow.OnClickMatch = function (sender) {
        var row = DocumentHelper.GetClosestByTagName(sender, 'tr');
        var group = row.Group;
        var match = row.Match;
        var onSaved = row.OnSaved;
        //var tableControl = DoubleElimintationResultsTable.GetControlFromTableElement(sender);
        var popup = new MatchPopup(group, match);
        popup.OnMatchSaved = AsynchronousOperation.FromFunction(function (callback) { onSaved(); callback(); });
        popup.Show();
    };
    MatchTableRow.prototype.Test = function () {
    };
    return MatchTableRow;
})();
var GroupView = (function (_super) {
    __extends(GroupView, _super);
    function GroupView() {
        _super.call(this, 'group');
        this.resultsTable = new ResultsTable();
        this.matchList = new MatchList();
        this.doubleElimintationResultsTable = new DoubleElimintationResultsTable();
    }
    GroupView.GetYearLabel = function (season) {
    };
    GroupView.prototype.Load = function (parameters) {
        var that = this;
        var action;
        var season;
        var groupName;
        var groupLabel;
        var monthLabel;
        var yearLabel;
        if (parameters.length == 2) {
            season = '1';
            groupName = parameters[1];
        }
        else {
            season = parameters[1];
            groupName = parameters[3];
        }
        if (groupName.toLowerCase() == 'e') {
            groupLabel = 'Eliminacje';
        }
        else {
            groupLabel = "Grupa " + groupName.toUpperCase();
        }
        monthLabel = Utility.HTML.DecodeEntities(GroupView.Months[parseInt(season) + 8]);
        yearLabel = (2015 + Math.floor(parseInt(season) / 12));
        document.getElementById('group-title').textContent = monthLabel + " " + yearLabel + " - " + groupLabel;
        document.getElementById('eliminations-view').style.display = 'none';
        document.getElementById('group-view').style.display = 'none';
        var onRequestSuccess = function (request) {
            var group = Group.FromResponse(request, season, groupName);
            if (groupName.toLowerCase() == 'e') {
                that.resultsTable.Container.style.display = 'none';
                that.matchList.Container.style.display = 'none';
                that.doubleElimintationResultsTable.Container.style.display = '';
                that.doubleElimintationResultsTable.SetGroup(group);
                that.doubleElimintationResultsTable.Render();
                document.getElementById('eliminations-view').style.display = '';
            }
            else {
                that.resultsTable.Container.style.display = '';
                that.matchList.Container.style.display = '';
                that.doubleElimintationResultsTable.Container.style.display = 'none';
                that.resultsTable.SetGroup(group);
                that.resultsTable.Render();
                that.matchList.SetGroup(group);
                that.matchList.Render();
                document.getElementById('group-view').style.display = '';
            }
        };
        var onRequestError = function (request) {
            Runtime.Current.Notifications.AddRequest('B&#x142;&#x105;d podczas wy&#x15B;wietlania grupy', request);
        };
        var request = new Request(RequestMethod.GET, '/season/' + season + '/group/' + groupName, '', onRequestSuccess, onRequestError);
        Runtime.Current.ScreenLocker.Run(AsynchronousOperationAdapter.CreateFromRequest(request));
        _super.prototype.Load.call(this, parameters);
    };
    GroupView.prototype.Render = function () {
    };
    GroupView.prototype.Hide = function () {
    };
    GroupView.Months = ['Stycze&#x144;', 'Luty', 'Marzec', 'Kwiecie&#x144;', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpie&#x144;', 'Wrzesie&#x144;', 'Pa&#x17A;dziernik', 'Listopad', 'Grudzie&#x144;'];
    return GroupView;
})(StaticView);
var LeagueRuntime = (function (_super) {
    __extends(LeagueRuntime, _super);
    function LeagueRuntime() {
        _super.apply(this, arguments);
    }
    LeagueRuntime.prototype.Initialise = function () {
        _super.prototype.Initialise.call(this);
        this.Views.AddView('group', new GroupView());
        if (window.location.hash && window.location.hash.length > 1) {
            this.Action(window.location.hash.substring(1));
        }
        else {
            this.Action('view/#home');
        }
    };
    return LeagueRuntime;
})(Runtime);
function Action(parameters) {
    Runtime.Current.Action(parameters);
    //var  args.split('/');
}
function SignIn() {
    try {
        Action('user/signin');
    }
    catch (e) { }
    return false;
}
