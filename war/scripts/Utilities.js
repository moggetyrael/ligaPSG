var Utilities;
(function (Utilities) {
    var Text = (function () {
        function Text() {
        }
        Text.getUndefinedAsEmptyString = function (value) {
            if (typeof value == 'undefined') {
                return '';
            }
            else {
                return value;
            }
        };
        Text.pad = function (num, size) {
            var s = "000000000" + num;
            return s.substr(s.length - size);
        };
        Text.getMonthName = function (num) {
            switch (num) {
                case 0: return 'Styczeń';
                case 1: return 'Luty';
                case 2: return 'Marzec';
                case 3: return 'Kwiecień';
                case 4: return 'Maj';
                case 5: return 'Czerwiec';
                case 6: return 'Lipiec';
                case 7: return 'Sierpień';
                case 8: return 'Wrzesień';
                case 9: return 'Październik';
                case 10: return 'Listopad';
                case 11: return 'Grudzień';
            }
        };
        return Text;
    })();
    Utilities.Text = Text;
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
    Utilities.Cookie = Cookie;
    var DOM = (function () {
        function DOM() {
        }
        DOM.getClosestByTagName = function (element, tagName) {
            var current = element;
            while (current != null) {
                if (current.tagName.toLowerCase() == tagName.toLowerCase()) {
                    break;
                }
                current = current.parentElement;
            }
            return current;
        };
        DOM.removeChildren = function (element) {
            while (element.children.length > 0) {
                element.removeChild(element.children[0]);
            }
        };
        DOM.createChildWithInnerText = function (element, tagName, innerText) {
            var child = document.createElement(tagName);
            child.textContent = innerText;
            element.appendChild(child);
            return child;
        };
        return DOM;
    })();
    Utilities.DOM = DOM;
    var Ajax = (function () {
        function Ajax() {
        }
        //static requestJSONPAsync(action, data, handler)
        //{
        //    var callbackName = 'callback' + new Date().getTime();
        //    var script = document.createElement('script');
        //
        //    window[callbackName] = function ()
        //    {
        //        alert('ok');
        //    }
        //
        //    if (data == null)
        //    {
        //        script.src = action + '?' + 'callback=' + callbackName;
        //    }
        //    else
        //    {
        //        script.src = action + '?' + data + '&callback=' + callbackName;
        //    }
        //
        //    handler.onSuccess = function () { };
        //
        //    //Utilities.Ajax.requestAsync('GET', action, data, handler);
        //    script.src = action + '?' + data;
        //    document.body.appendChild(script);
        //}
        Ajax.requestAsync = function (method, action, data, handler) {
            var request;
            if (window.XMLHttpRequest) {
                request = new XMLHttpRequest();
            }
            else {
                request = new ActiveXObject("Microsoft.XMLHTTP");
            }
            var stateChangeHandler = function () {
                if (this.readyState == 4) {
                    if (this.status == 200) {
                        this.handler.onSuccess(this);
                    }
                    else {
                        this.handler.onError(this);
                    }
                }
            };
            if (method == 'POST') {
                request.handler = handler;
                request.open("POST", action, true);
                request.onreadystatechange = stateChangeHandler;
                request.setRequestHeader("Content-type", "text/plain");
                request.send(data);
            }
            else {
                if (data == null) {
                    action = action + '?t=' + new Date().getTime();
                }
                else {
                    action = action + '?' + data + '&t=' + new Date().getTime();
                }
                request.handler = handler;
                request.open("GET", action, true);
                request.onreadystatechange = stateChangeHandler;
                request.setRequestHeader("Content-type", "text/plain");
                //request.setRequestHeader("Accept", "application/javascript, */*;q=0.8");
                request.send();
            }
        };
        return Ajax;
    })();
    Utilities.Ajax = Ajax;
})(Utilities || (Utilities = {}));
//# sourceMappingURL=Utilities.js.map