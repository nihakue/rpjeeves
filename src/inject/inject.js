//     Copyright (C) {2014}  {Gabriel West}

//     This program is free software; you can redistribute it and/or modify
//     it under the terms of the GNU General Public License as published by
//     the Free Software Foundation; either version 2 of the License, or
//     (at your option) any later version.

//     This program is distributed in the hope that it will be useful,
//     but WITHOUT ANY WARRANTY; without even the implied warranty of
//     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//     GNU General Public License for more details.

//     You should have received a copy of the GNU General Public License along
//     with this program; if not, write to the Free Software Foundation, Inc.,
//     51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.

jq = $;

rollExps = {
	'd20': new RegExp("(\\d+ )?([\\w\\(\\)]{2,})(<\\/\\w{1}>)? ((?:\\/?[+\\-]\\d+)+)", 'g'),
	'attack': new RegExp("(\\b(\\d+)d(\\d+)\\s?((?:[+\\-]|–|&ndash;)\\d+)?\\b)", 'g'),
	};

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		// console.log("Hello. This message was sent from scripts/inject.js");
		var bodyHTML = jq('body').html();

		//Replace basic stats with roll buttons

		// We might find a better way to do this, but the lack of structure forces us to rely on the text itself.
		bodyHTML = bodyHTML.replace(rollExps.d20, d20replacer);	

		//replace damage rolls with roll buttons
		bodyHTML = bodyHTML.replace(rollExps.attack, replacer);

		document.body.innerHTML = bodyHTML;

		//Initialize Popover for every popover element
		jq('[data-toggle="popover"]').popover({'html': true});

		jq('.roll').on('mousedown', function(e) {
			var numDice = jq(this).attr('numDice');
			var die = jq(this).attr('die');
			var modifier = jq(this).attr('modifier');
			jq(this).attr('data-content', jq(this).attr('re') === "d20"? multiRoll(numDice, die, modifier): roll(numDice, die, modifier));
		});
		jq('.rollResult').cl
		// ----------------------------------------------------------

	}
	}, 10);
});

function d20replacer(match, p1, p2, p3, p4){
	if (p3 === "</a>"){
		return match.replace(p4, "") + createRollButton({'rollName': (p1 || "") + " " + p2 + " " + p4, 'rollText': p4, 'modifier': p4, 'die': 20, 'numDice': p1 || 1})[0].outerHTML;
	}
	return createRollButton({'rollName': (p1 || "") + " " + p2 + " " + p4, 'modifier': p4, 'die': 20, 'numDice': p1 || 1})[0].outerHTML;
}

function replacer(match, p1, p2, p3, p4){
	if (p4 && p4.indexOf("+") < 0){
		if (p4.indexOf("–") >= 0){
			p4 = p4.replace("–", "-");
		} else if (p4.indexOf("&ndash;") >= 0){
			p4 = p4.replace("&ndash;", "-");
		}
	}
	return createRollButton({'re': 'attack', 'buttonType': 'btn-danger', 'rollName': match, 'modifier': p4, 'die': p3, 'numDice': p2 || 1})[0].outerHTML;
}

function multiRoll(numDice, die, modifier){
	var modifiers = parseAttacks(modifier);
	if (modifiers.length > 1){
		numDice = modifiers.length;
	}

	var dieInt = parseInt(die);
	var numDiceInt = parseInt(numDice);
	var result = '<ul class="list-group">';

	var modifier;

	for (var i = 0; i < numDiceInt; i++) {
		modifier = i <= modifiers.length - 1 ? modifiers[i] : modifiers[modifiers.length - 1];
		result += '<li class="list-group-item">';
		result += roll(1, dieInt, modifier);
		result += "</li>";
	}
	result += '</ul>';
	return result;
}

function roll(numDice, die, modifier){
	modifierInt = parseInt(modifier);
	dieInt = parseInt(die);
	numDiceInt = parseInt(numDice);
	var maxRoll = numDiceInt * dieInt + modifierInt;
	var rawRoll = 0;
	var rollString = "";
	for (i = 0; i < numDiceInt; i++)
	{
		var dieRoll = Math.floor((Math.random() * dieInt) + 1);
		rawRoll += dieRoll;
		if (numDiceInt < 10) //popover doesn't display long strings well
		{
			rollString += String(dieRoll);
			if (i != numDiceInt - 1)
			rollString += "+";
		}
		else
		{
			rollString = rawRoll;
		}
	}
	return numDice + "d" + die + "(" + rollString + ")" + modifier + " = " + "<span style='font-size: 15px' class='label label-primary'>" + (rawRoll + modifierInt) + "</span> / " + maxRoll;
}

//attackStrings will look like this: "+36 or +36/+12/+9 etc..."
function parseAttacks(attackString){
	return attackString.split("/");
}

function rollFactory(numDice, die, modifier){
	// console.log('Die outer: ' + die);
	return function (){
		// console.log('Die inner: ' + die);
		return roll(numDice, die, modifier);
	}
}

function createRollButton(options){
	var rollName = typeof(options.rollName) === "undefined" ? "Basic" : options.rollName;
	var rollText = typeof(options.rollText) === "undefined" ? rollName : options.rollText;
	var modifier = typeof(options.modifier) === "undefined" ? "+0" : options.modifier;
	var die = typeof(options.die) === "undefined" ? 20 : options.die;
	var numDice = typeof(options.numDice) === "undefined" ? 1 : options.numDice;
	var buttonType = typeof(options.buttonType) === "undefined" ? "btn-success" : options.buttonType;
	var re = typeof(options.re) === "undefined" ? 'd20' : options.re;


	var rollButton = jq('<button></button>', {
		'type': 'button',
		'class': "btn " + buttonType + " btn-xs popover-dismiss roll",
		'data-trigger': "click",
		'data-toggle': "popover",
		'title': rollName + " roll",
		'text': rollText,
		'rollName': rollName,
		'modifier': modifier,
		'die': die,
		'numDice': numDice,
		're': re
		});

	return rollButton;
}