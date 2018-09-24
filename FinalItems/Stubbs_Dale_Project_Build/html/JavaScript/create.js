window.onload = function() {
	// Hash of the PassSentence generated
	function hashCode(str) {
		return str.split('').reduce((prevHash, currVal) => ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
	};

	// Hash of the entered PassSentence is compared to the stored hash if there is one.
	function checkHash(passHash, loadedHash) {
		var hashed;
		if (loadedHash == 'undefined') {
			hashed = true;
		} else if (passHash != loadedHash) {
			hashed = false;
		} else {
			hashed = true;
		}
		return hashed;
	}
	numbers = '0123456789'
	sCharacters = '|{_@&'
	chrome.runtime.sendMessage('retrieveHash');
	chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
		loadedHash = response;
		document.getElementById('create').onclick = function() {
			var passSentence = document.getElementById('passSentenceBox').value;
			var website = document.getElementById('websiteBox').value;
			passSentence = passSentence.replace(/ /gi, '').replace(/,/gi, '');
			hash = hashCode(passSentence);
			hashChecked = checkHash(hash, loadedHash);
			// Checks to see if an upper case letter is in the entered PassSentence
			var uppercase = [];
			for (var x = 0; x < passSentence.length-1; x++) {
				// function obtained from http://jsfiddle.net/Axfxz/
				if (passSentence[x] === passSentence[x].toUpperCase() && passSentence[x] !== passSentence[x].toLowerCase()) {
					uppercase.push(passSentence[x]);
				}
			}
			// Full set of alerts for incorrect entry for the PassSentence and Website.		
			if (passSentence == '' && website == '') {
				alert('PassSentence and Website are Required');
				event.preventDefault();
			} else if (passSentence == '') {
				alert('PassSentence is Required');
				event.preventDefault();
			} else if (website == '') {
				alert('Website is Required');
				event.preventDefault();
			} else if (passSentence != '' && website != '' && uppercase.length == 0) {
				alert('No Upper Case Letters Found in PassSentence.');
				event.preventDefault();
			} else if (passSentence != '' && passSentence.length < 20) {
				alert('PassSentence is too short. It only contains ' + passSentence.length.toString() + ' characters.');
				event.preventDefault();
			} else if (hashChecked == false){
				alert('PassSentence is incorrect. Please check and try again.');
				event.preventDefault();
			} else {
				if (document.getElementById('number_yes').checked) {
					numbers = numbers;
				} else {
					numbers = '';
				}
				if (document.getElementById('specChar_yes').checked) {
					sCharacters = sCharacters;
				} else {
					sCharacters = '';
				}
				hashStr = hash.toString();
				// Information sent to the background script.
				var editedSentence = passSentence + numbers + sCharacters;
				chrome.runtime.sendMessage(editedSentence + ',' + passSentence + ',' + website + ',' + hashStr);
			};
		};
	});
};