var LeaguePointsControl = (function () {
    function LeaguePointsControl() {
        this.tableElement = document.getElementById('league-points');
    }
    LeaguePointsControl.prototype.update = function (group) {
        return;
        var seasonCount = this.tableElement.rows.item(0).childElementCount - 2;
        var playerCount = this.tableElement.rows.length;
        var playerSums = {};
        group.refreshScores();
        for (var i = 0; i < seasonCount; i++) {
            var seasonColumnIndex = seasonCount - i + 1;
            var bestSum = 0;
            var bestPlayerName = '';
            var bestPlayerIndex = 0;
            for (var j = 0; j < playerCount; j++) {
                var playerName = this.tableElement.rows.item(j).childNodes[0].textContent.trim();
                if (playerSums.hasOwnProperty(playerName) == false) {
                    playerSums[playerName] = 0;
                }
                var seasonColumn = this.tableElement.rows.item(j).childNodes[seasonColumnIndex];
                if (seasonColumn.hasOwnProperty('points')) {
                    var points = seasonColumn.points;
                }
                else {
                    var points = seasonColumn.points = parseInt(seasonColumn.textContent);
                }
                if (isNaN(points)) {
                }
                else {
                    playerSums[playerName] += points;
                    this.tableElement.rows.item(j).childNodes[seasonColumnIndex].innerHTML = '' + playerSums[playerName] + ' (+' + points + ')' + '';
                }
                if (playerSums[playerName] > bestSum) {
                    bestSum = playerSums[playerName];
                    bestPlayerName = playerName;
                    bestPlayerIndex = j;
                }
            }
            playerSums[bestPlayerName] = 0;
            this.tableElement.rows.item(bestPlayerIndex).childNodes[seasonColumnIndex].classList.add('highlight-green');
        }
        for (var j = 0; j < playerCount; j++) {
            var playerName = this.tableElement.rows.item(j).childNodes[0].textContent.trim();
            var playerIndex = group.getPlayerIndex(playerName);
            if (playerIndex == null) {
                this.tableElement.rows.item(j).childNodes[1].innerHTML = '<b>' + playerSums[playerName] + '</b>';
            }
            else {
                playerSums[playerName] += group.points[group.players[playerIndex].nickname];
                this.tableElement.rows.item(j).childNodes[1].innerHTML = '<b>' + playerSums[playerName] + '</b> (+' + group.points[group.players[playerIndex].nickname] + ')';
            }
        }
    };
    return LeaguePointsControl;
})();
var Item = (function () {
    function Item() {
    }
    return Item;
})();
// Notifications
// Players
// Groups
// - "Round Robin"
// - "Double Ladder"
// - "Dates" 
//# sourceMappingURL=League.js.map