window.onload = function() {
	numbers = '0123456789'
	sCharacters = '|{_@&'
	document.getElementById('create').onclick = function() {
		var passSentence = document.getElementById('passSentenceBox').value;
		var website = document.getElementById('websiteBox').value;
		passSentence = passSentence.replace(/ /gi, '')
		var uppercase = [];
		for (var x = 0; x < passSentence.length-1; x++) {
			// function obtained from http://jsfiddle.net/Axfxz/
			if (passSentence[x] === passSentence[x].toUpperCase() && passSentence[x] !== passSentence[x].toLowerCase()) {
				uppercase.push(passSentence[x]);
			}
		}		
		if (passSentence == '' && website == '') {
			alert('PassSentence and Website are Required')
		} else if (passSentence == '') {
			alert('PassSentence is Required')
		} else if (website == '') {
			alert('Website is Required')
		} else if (passSentence != '' && website != '' && uppercase.length == 0) {
			document.getElementById('passSentenceBox').value = '';
			alert('No Upper Case Letters Found.')
			event.preventDefault();
		} else if (passSentence != '' && passSentence.length < 20) {
			alert('PassSentence is too short. It only contains ' + passSentence.length.toString() + ' characters.')
			event.preventDefault();
		}
		if(document.getElementById('number_yes').checked) {
			numbers = numbers
		} else {
			numbers = ''
		}
		if (document.getElementById('specChar_yes').checked) {
			sCharacters = sCharacters
		} else {
			sCharacters = ''
		}
		passSentence = passSentence.replace(/ /gi, '')
		console.log(passSentence)
		var editedSentence = passSentence + numbers + sCharacters
		chrome.runtime.sendMessage(editedSentence + ',' + passSentence + ',' + website);
	};
};