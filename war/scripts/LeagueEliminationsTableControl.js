var LeagueEliminationsTableControl = (function () {
    function LeagueEliminationsTableControl() {
        this.tableElement = document.createElement('table');
        this.tableElement.className = 'eliminations';
    }
    LeagueEliminationsTableControl.prototype.getElement = function () {
        return this.tableElement;
    };
    LeagueEliminationsTableControl.prototype.bind = function (league, group) {
        this.league = league;
        this.group = group;
        this.render();
    };
    LeagueEliminationsTableControl.prototype.render = function () {
        var that = this;
        Utilities.DOM.removeChildren(this.tableElement);
        var numberOfRounds = this.group.getNumberOfRounds();
        //var maximumMatchesInRound
        var calculatedRowSpans = {};
        var calculatedRoundSpans = [];
        var rows = [];
        var tableRowCount = 0;
        for (var i = 0; i < numberOfRounds; i++) {
            var roundMatches = this.group.getMatchesInRound(i);
            var roundSpan = 0;
            for (var j = 0; j < roundMatches.length; j++) {
                var span = 0;
                if (roundMatches[j].ref1.isMatchRef()) {
                    if (!roundMatches[j].id.match(/^\d+-l-.*/) || roundMatches[j].ref1.value.match(/^\d+-l-.*/)) {
                        if (typeof calculatedRowSpans[roundMatches[j].ref1.value] != 'number') {
                            console.log('calculatedRowSpans[' + roundMatches[j].ref1.value + '] is not a number');
                        }
                        span += calculatedRowSpans[roundMatches[j].ref1.value];
                    }
                }
                if (roundMatches[j].ref2.isMatchRef()) {
                    if (!roundMatches[j].id.match(/^\d+-l-.*/) || roundMatches[j].ref2.value.match(/^\d+-l-.*/)) {
                        if (typeof calculatedRowSpans[roundMatches[j].ref2.value] != 'number') {
                            console.log('calculatedRowSpans[' + roundMatches[j].ref2.value + '] is not a number');
                        }
                        span += calculatedRowSpans[roundMatches[j].ref2.value];
                    }
                }
                roundSpan += Math.max(1, span);
                calculatedRowSpans[roundMatches[j].id] = Math.max(1, span);
            }
            calculatedRoundSpans[i] = roundSpan;
            tableRowCount = Math.max(tableRowCount, roundSpan);
        }
        for (var i = 0; i < tableRowCount; i++) {
            rows.push(document.createElement('tr'));
        }
        for (var i = 0; i < numberOfRounds; i++) {
            var roundMatches = this.group.getMatchesInRound(i);
            var rowNumber = 0;
            var laddersSeparatorRendered = false;
            for (var j = 0; j < roundMatches.length; j++) {
                if (MatchModel.isUpperGroupMatchId(roundMatches[j].id) == false && laddersSeparatorRendered == false) {
                    laddersSeparatorRendered = true;
                    if (tableRowCount - calculatedRoundSpans[i] > 0) {
                        var cell = document.createElement('td');
                        cell.rowSpan = tableRowCount - calculatedRoundSpans[i];
                        //cell.textContent = cell.rowSpan.toString();
                        rows[rowNumber].appendChild(cell);
                        rowNumber += cell.rowSpan;
                    }
                }
                var cell = document.createElement('td');
                var match = this.group.getMatchById(roundMatches[j].id);
                roundMatches[j].resolveReferences(this.group);
                //var matches = this.group.getMatchesFromModel(roundMatches[j]);
                if (match != null) {
                    var matchResult = match.getResult();
                    if (matchResult != null) {
                        if (matchResult == MatchResult.Won1) {
                            cell.classList.add('won1');
                        }
                        else if (matchResult == MatchResult.Won2) {
                            cell.classList.add('won2');
                        }
                    }
                }
                var label1 = roundMatches[j].ref1.getLabel(this.group);
                var label2 = roundMatches[j].ref2.getLabel(this.group);
                cell.match = roundMatches[j];
                //(<any>cell).player1 = roundMatches[j].ref1;
                //(<any>cell).player2 = roundMatches[j].ref2;
                cell.onclick = function (event) { that.handleOnCellClicked(event); };
                cell.rowSpan = calculatedRowSpans[roundMatches[j].id];
                cell.innerHTML = '<div class="match" style="height: ' + (cell.rowSpan * 80) + 'px"><div class="match-id" style="transform: translate(' + (-30) + 'px, ' + (cell.rowSpan * 40) + 'px) rotate(-90deg);">' + roundMatches[j].id + '</div><table><tr><td>' + label1 + '</td></tr><tr><td>' + label2 + '</td></tr></table><div>';
                //cell.innerHTML = '<div>' + roundMatches[j].ref1.value + '</div><div>' + roundMatches[j].ref1.value + '</div>';
                //cell.textContent = roundMatches[j].id + ", " + calculatedRowSpans[roundMatches[j].id];
                rows[rowNumber].appendChild(cell);
                rowNumber += cell.rowSpan;
            }
            if (laddersSeparatorRendered == false && tableRowCount - calculatedRoundSpans[i] > 0) {
                var cell = document.createElement('td');
                cell.rowSpan = tableRowCount - calculatedRoundSpans[i];
                //cell.textContent = cell.rowSpan.toString();
                rows[rowNumber].appendChild(cell);
            }
        }
        for (var i = 0; i < rows.length; i++) {
            this.tableElement.appendChild(rows[i]);
        }
    };
    LeagueEliminationsTableControl.prototype.handleOnCellClicked = function (event) {
        if (this.onCellClicked) {
            var containerElement = Utilities.DOM.getClosestByTagName(event.target, 'div');
            var cellElement = Utilities.DOM.getClosestByTagName(containerElement, 'td');
            this.onCellClicked(this, cellElement.match);
        }
    };
    LeagueEliminationsTableControl.prototype.appendGroupCells = function (rows, group, round, offset) {
        for (var j = 0; j < group.length; j++) {
            var rowIndex;
            rowIndex = offset == 0 ? j * 2 * Math.pow(2, round) + offset : offset + j * 2;
            rows[rowIndex].appendChild(this.createMatchPlayerCell(group[j].Identity, group[j].FirstRef, rowIndex, round, j));
            rowIndex = offset == 0 ? rowIndex + Math.pow(2, round) : offset + j * 2 + 1;
            rows[rowIndex].appendChild(this.createMatchPlayerCell(group[j].Identity, group[j].SecondRef, rowIndex, round, j));
        }
    };
    LeagueEliminationsTableControl.prototype.createMatchPlayerCell = function (matchIdentity, playerReference, rowIndex, round, match) {
        var cell = document.createElement('td');
        cell.rowSpan = Math.pow(2, round);
        cell.textContent = "[" + matchIdentity + "]" + round + ", " + match + ', ' + cell.rowSpan + "(" + playerReference + ")";
        //rows[match * 2 * cell.rowSpan + cell.rowSpan].appendChild(cell);
        return cell;
    };
    return LeagueEliminationsTableControl;
})();
var EliminationsMatch = (function () {
    function EliminationsMatch() {
    }
    return EliminationsMatch;
})();
var ElimintationsRound = (function () {
    function ElimintationsRound(number, firstSet, secondSet) {
        this.UpperGroup = this.CreateGroup(number + "-u-", firstSet);
        this.LowerGroup = this.CreateGroup(number + "-l-", secondSet);
    }
    ElimintationsRound.prototype.GetMatchByIdentity = function (identity) {
        var match = this.GetMatchByIdentityFromGroup(identity, this.UpperGroup);
        if (match == null) {
            match = this.GetMatchByIdentityFromGroup(identity, this.LowerGroup);
        }
        return match;
    };
    ElimintationsRound.prototype.GetMatchByIdentityFromGroup = function (identity, group) {
        for (var i = 0; i < group.length; i++) {
            if (group[i].Identity == identity) {
                console.log('found!');
                return group[i];
            }
        }
        return null;
    };
    ElimintationsRound.prototype.CreateGroup = function (number, playerReferences) {
        var group = new Array();
        var groupSize = Math.ceil(playerReferences.length / 2);
        if (playerReferences.length == 1) {
            return group;
        }
        for (var i = 0; i < groupSize; i++) {
            var match = new EliminationsMatch();
            match.Identity = number + 'abcdefghijklmnop'.charAt(i);
            match.FirstRef = playerReferences[i * 2];
            match.SecondRef = playerReferences[i * 2 + 1];
            group.push(match);
        }
        //for (var i = 0; i < playerReferences.length; i++)
        //{
        //    if (i < groupSize)
        //    {
        //        //group[i].FirstRef = playerReferences[i];
        //        group[i].FirstRef = playerReferences[i * 2];
        //    }
        //    else
        //    {
        //        //group[groupSize - (i - groupSize + 1)].SecondRef = playerReferences[i];
        //        group[i].SecondRef = playerReferences[i * 2 + 1];
        //    }
        //}
        return group;
    };
    return ElimintationsRound;
})();
var Elimintations = (function () {
    function Elimintations(players) {
        this.Rounds = [];
        var firstSet = [];
        var secondSet = [];
        var roundNumber = 0;
        for (var p in players) {
            firstSet.push(players[p].nickname);
        }
        var firstRoundNumberOfPlayers = Math.pow(2, Math.ceil(Math.log(players.length) / Math.log(2)));
        var firstRoundNumberOfMatches = Math.ceil(players.length / 2);
        while (firstSet.length < firstRoundNumberOfPlayers) {
            firstSet.push('-');
        }
        //
        //for (var i = 0; i < players.length; i++)
        //{
        //    if (i < firstRoundNumberOfMatches)
        //    {
        //        //group[i].FirstRef = playerReferences[i];
        //        firstSet[i] = players[i * 2];
        //    }
        //    else
        //    {
        //        //group[groupSize - (i - groupSize + 1)].SecondRef = playerReferences[i];
        //        firstSet[i] = playerReferences[i * 2 + 1];
        //    }
        //}
        do {
            roundNumber++;
            var round = new ElimintationsRound(roundNumber.toString(), firstSet, secondSet);
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
    Elimintations.prototype.GetMatchByIdentity = function (identity) {
        if (typeof identity == 'string') {
            var matches = identity.match(/^(\d+)\-[ulUL]\-[a-zA-Z]$/);
            if (matches) {
                return this.Rounds[parseInt(matches[1]) - 1].GetMatchByIdentity(identity);
            }
        }
        return null;
    };
    return Elimintations;
})();
//# sourceMappingURL=LeagueEliminationsTableControl.js.map