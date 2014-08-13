rollExps = {
	'd20': new RegExp("(\\d+ )?(\\w{2,})(?:<\\/b>)? ([+\\-]\\d+)", 'g'),
	'multiAttack': new RegExp("/([+\\-]\\d+)", 'g'),
	'attack': new RegExp("((\\d+)d(\\d+)\\s?([+\\-]\\d+))", 'g')
	};

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		var bodyHTML = document.body.innerHTML;

		//Replace basic stats with roll buttons

		// $('body').contents().filter(function() {
		// 	return this.nodeType === 3;
		// }).each(function() {
		// 	$(this).replaceWith($(this).text().replace(re, d20replacer));
		// });

		//We might find a better way to do this, but the lack of structure forces us to rely on the text itself.
		bodyHTML = bodyHTML.replace(rollExps.d20, d20replacer);	
		
		bodyHTML = bodyHTML.replace(rollExps.multiAttack, multiAttackReplacer);

		//replace damage rolls with roll buttons
		bodyHTML = bodyHTML.replace(rollExps.attack, replacer);

		document.body.innerHTML = bodyHTML;

		//Initialize Popover for every popover element
		$('[data-toggle="popover"').popover({'html': true});
		// $('.roll').on('click', function(e){$(this).attr("data-content", roll(1, 20, $(this).attr("modifier")))});

		$('.roll').on('mousedown', function(e) {
			var numDice = $(this).attr('numDice');
			var die = $(this).attr('die');
			var modifier = $(this).attr('modifier');
			$(this).attr('data-content', $(this).attr('re') === "d20"? multiRoll(numDice, die, modifier): roll(numDice, die, modifier));
		});
		$('.rollResult').cl
		// ----------------------------------------------------------

	}
	}, 10);
});

function d20replacer(match, p1, p2, p3){
	return createRollButton({'rollName': (p1 || "") + " " + p2 + " " + p3, 'modifier': p3, 'die': 20, 'numDice': p1 || 1})[0].outerHTML;
}

function multiAttackReplacer(match, p1){
	return createRollButton({'re': 'attack', 'rollName': "/" + p1, 'modifier': p1, 'die': 20, 'numDice': 1})[0].outerHTML;
}

function replacer(match, p1, p2, p3, p4){
	return createRollButton({'re': 'attack', 'buttonType': 'btn-danger', 'rollName': match, 'modifier': p4, 'die': p3, 'numDice': p2 || 1})[0].outerHTML;
}

//broken at present
// function rollString(s){
// 	var matches,
// 		numDice,
// 		die,
// 		modifier;

// 	if (matches = rollExps.attack.exec(s)){
// 		numDice = matches[1];
// 		die = matches[2];
// 		modifier = matches[3];
// 	} else if (matches = rollExps.d20.exec(s)){
// 		numDice = matches[1];
// 		die = 20;
// 		modifier = matches[3];
// 	} else{
// 		console.log("rollString broke");
// 		return null;
// 	}
// 	return roll(numDice, die, modifier);
// }

function multiRoll(numDice, die, modifier){
	var modifierInt = parseInt(modifier);
	var dieInt = parseInt(die);
	var numDiceInt = parseInt(numDice);
	var result = '<ul class="list-group">';

	for (var i = 0; i < numDiceInt; i++) {
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
	return numDice + "d" + die + "(" + rollString + ")" + modifier + " = " + "<span style='font-size: 15px' class='label label-primary'>" + (rawRoll + modifierInt) + "</span>";
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
	var modifier = typeof(options.modifier) === "undefined" ? "+0" : options.modifier;
	var die = typeof(options.die) === "undefined" ? 20 : options.die;
	var numDice = typeof(options.numDice) === "undefined" ? 1 : options.numDice;
	var buttonType = typeof(options.buttonType) === "undefined" ? "btn-success" : options.buttonType;
	var re = typeof(options.re) === "undefined" ? 'd20' : options.re;

	

	var rollButton = $('<button></button>', {
		'type': 'button',
		'class': "btn " + buttonType + " btn-xs popover-dismiss roll",
		'data-trigger': "click",
		'data-toggle': "popover",
		'title': rollName + " roll",
		'text': rollName,
		'rollName': rollName,
		'modifier': modifier,
		'die': die,
		'numDice': numDice,
		're': re
		});
// .on('click', function(e) {
// 			$(this).attr("data-content", rollFactory(numDice, die, modifier));

	return rollButton;
}