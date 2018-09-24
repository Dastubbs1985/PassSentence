window.onload = function() {
	var website = '';
	var sentence = '';
	var passSentence = '';
	var charPlaceNumbers = [];

	// Password is built in it's plaintext format to be displayed to the user.
	function generatePass(sentence, passSentence) {
		var passLength = sentence.length;
		var sizePass = passSentence.length;
		charPlaceNumbers = charPlacesList(sentence, passLength, sizePass);
		var password = '';
		for (var x = 0; x <= charPlaceNumbers.length - 1; x ++) {
			var a = charPlaceNumbers[x];
			var char = sentence[a];
			password += char;
		}
		//  Ensures an upper case letter appears within the password. 
		//  If no upper case letter can be found, another password is generated. 
		var uppercase = [];
		for (var x = 0; x < password.length-1; x++) {
			// function obtained from http://jsfiddle.net/Axfxz/
			if (password[x] === password[x].toUpperCase() && password[x] !== password[x].toLowerCase()) {
				uppercase.push(password[x]);
			}
		}
		if (uppercase.length == 0) {
			password = generatePass(sentence, passSentence);
		}
		return password;
	}

	// Builds the array of 12 random numbers.
	function buildRandom(sizePass) {
		var digits = [];
		var randDigits = [];
		for (x = 0; x <= sizePass - 1; x++) {
			digits[x] = x;
		}
		for(x = 0; x <= 11; x ++) {
			shuffle(digits)
			//  Using .pop() acquires the digit at the end of the array and removes this digit from the array.
			//  This ensures the numbers are never repeated within a password.
			var randNum = digits.pop();
			randDigits.push(randNum);	
		}
		return randDigits;
	}

	// Determines the length of the sentence and adds extra digits to the end of the array 
	// depending on if numbers and/or special characters are required
	function charPlacesList(sentence, size, sizePass) {
		var randomCharPlaces = buildRandom(sizePass);
		if (size == sizePass) {
			shuffle(randomCharPlaces);
		} else if (size == (sizePass + 10)) {
			num = getRandomInt((sizePass), (sizePass + 9));
			randomCharPlaces.push(num);
			shuffle(randomCharPlaces);
		} else if (size == (sizePass + 5)) {
			specChar = getRandomInt((sizePass), (sizePass + 4));
			randomCharPlaces.push(specChar);
			shuffle(randomCharPlaces);
		} else {
			num = getRandomInt((sizePass), (sizePass + 9));
			specChar = getRandomInt((sizePass + 10), (sizePass + 14));
			randomCharPlaces.push(num);
			randomCharPlaces.push(specChar);
			shuffle(randomCharPlaces);
		}
		return randomCharPlaces
	}

	// Obtaines a single ramdom digit between the min and max parameters.
	// function obtained from http://stackoverflow.com/questions/1527803/generating-random-whole-numbers-in-javascript-in-a-specific-range
	function getRandomInt(min, max) {
    	return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	// Shuffles the numbers from within the array.
	// function obtained from http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;
		while (0 !== currentIndex) {
	    	randomIndex = Math.floor(Math.random() * currentIndex);
    		currentIndex -= 1;
    		temporaryValue = array[currentIndex];
    		array[currentIndex] = array[randomIndex];
    		array[randomIndex] = temporaryValue;
  		}
  		return array;
	}

	// Constructs the passwords and displays both the encoded and Plaintext versions of the password to the user.
	function construct() {
		password = '';
		charPlaceNumbers = [];
		password = generatePass(sentence, passSentence);
		document.getElementById('plainTextPass').value = password;
		document.getElementById('encodedPass').value = charPlaceNumbers.toString();
	};
	chrome.runtime.sendMessage('message');
	chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
		var vars = response.split(',');
		website = vars[1];
		sentence = vars[0];
		passSentence = vars[2];
		var element = document.getElementById('webPass');
		while (element.firstChild) {
		    element.removeChild(element.firstChild);
		}
		var string = website + ' Password';
		element.appendChild(document.createTextNode(string));
		construct();
	});
	document.getElementById('generatePass').onclick = function() {
		construct();
	}
	document.getElementById('savePass').onclick = function() {
		charPlaceNumbers.push(sentence.length)
		chrome.runtime.sendMessage(charPlaceNumbers);
	}
};