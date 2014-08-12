chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);
		var basicRolls = ['Init', 'Fort', 'Ref', 'Will'];
		var attacks = ['Melee', 'Ranged'];

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");
		var bodyHTML = document.body.innerHTML;

		//Replace basic stats with roll buttons
		var re = new RegExp("(\\d+ )?(\\w+)(<\\/b>)? ([+\\-]\\d+)", 'g');
		var matches = re.exec(bodyHTML);
		console.log(matches);

		//We might find a better way to do this, but the lack of structure forces us to rely on the text itself.
		bodyHTML = bodyHTML.replace(re, createRollButton({'rollName': "$2 $4", 'modifier': "$4", 'die': 20, 'numDice': 1})[0].outerHTML);	

		//replace attack stats with roll buttons
		// var re = new RegExp("((\\d+)?\\s?(\\w+) ([+\\-]\\d+) \\((\\d+d\\d+[+\\-]\\d+)(\\/\\d+(&ndash;|\\-)\\d+)?\\))", 'g');
		// console.log(re);

		// bodyHTML = bodyHTML.replace(re, createRollButton({'rollName': "$1", 'modifier': "$4", 'die': 20, 'numDice': 1}));

		//replace damage rolls with roll buttons
		var re = new RegExp("((\\d+)d(\\d+)\\s?([+\\-]\\d+))", 'g');
		var matches = re.exec(bodyHTML);
		console.log(matches);
		bodyHTML = bodyHTML.replace(re, createRollButton({'rollName': "$1", 'modifier': "$4", 'die': "$3", 'numDice': "$2"})[0].outerHTML);

		document.body.innerHTML = bodyHTML;

		//Initialize Popover for every popover element
		$('[data-toggle="popover"').popover();
		// $('.roll').on('click', function(e){$(this).attr("data-content", roll(1, 20, $(this).attr("modifier")))});
		// ----------------------------------------------------------

	}
	}, 10);
});

function rollString(s){
	var re = new RegExp("(\\d+)d(\\d+)\\s?([+\\-]\\d+)");
	var matches = re.exec(s);
	if (matches.length == 4){
		var numDice = matches[1];
		var die = matches[2];
		var modifier = matches[3];
	} else{
		return null;
	}
	return roll(numDice, die, modifier);
}

function roll(numDice, die, modifier){
	console.log(arguments);
	modifierInt = parseInt(modifier);
	dieInt = parseInt(die);
	numDiceInt = parseInt(numDice);
	var rawRoll = Math.floor((Math.random() * dieInt) + 1) * numDiceInt;
	return numDice + "d" + die + "(" + String(rawRoll) + ")" + modifier + " (" + (rawRoll + modifierInt) + ")";
}

function rollFactory(numDice, die, modifier){
	var numDice = numDice;
	var die = die;
	var modifier = modifier;
	function newRoll(){
		return roll(numDice, die, modifier);
	}
	return newRoll;
}

function createRollButton(options){
	var rollName = typeof(options.rollName) === "undefined" ? "Basic" : options.rollName;
	var modifier = typeof(options.modifier) === "undefined" ? "+0" : options.modifier;
	var die = typeof(options.die) === "undefined" ? 20 : options.die;
	var numDice = typeof(options.numDice) === "undefined" ? 1 : options.numDice;

	var rollClick = function(e){
		$(this).attr("data-content", roll(numDice, die, modifier));
	}

	var rollButton = $('<button></button>', {
		'type': 'button',
		'id': rollName,
		'class': "btn btn-success btn-xs popover-dismiss roll",
		'data-trigger': "click",
		'data-toggle': "popover",
		'title': rollName + " roll",
		'text': rollName,
		'data-content': roll(numDice, die, modifier)})
		.on('click', function(e) {
			$(this).attr("data-content", rollFactory(numDice, die, modifier));
		});

	
	return rollButton;
	// return '<button onclick=rollClick type="button" id="rollName" modifier="' + modifier + '" class="btn btn-success btn-xs popover-dismiss roll" data-trigger="click" data-toggle="popover" title="' + rollName + ' roll" data-content="' + roll(numDice, die, modifier) + '">' + rollName + '</button>';
}