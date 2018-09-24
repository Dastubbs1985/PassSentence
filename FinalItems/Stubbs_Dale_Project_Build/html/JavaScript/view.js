window.onload = function() {
	var infoArray = [];
	// Table is built dynamically and placed on the screen
	function buildTable(passEnc, passPlain) {
		for (x = 0; x <= passEnc.length - 1; x ++) {
			var string = passEnc[x];
			infoArray[x] = string.split(': ');
		}
		for (x = 0; x <= infoArray.length - 1; x++) {
			table = document.getElementById('passwordTable');
			tabRow = document.createElement('tr');
			tabRow.id = 'TextRow' + x.toString();
			if (x == 0) {
				info = 'th';
			} else {
				info = 'td';
			};
			webCell = document.createElement(info);
			passCell = document.createElement(info);
			deleteCell = document.createElement(info);
			webText = document.createTextNode(infoArray[x] [0]);
			if(passPlain === undefined) {
				passText = document.createTextNode(infoArray[x] [1]);
				passCell.value = infoArray[x] [1];
				passCell.id = infoArray[x] [1];
    		} else {
    			passText = document.createTextNode(passPlain[x]);
    			passCell.value = passPlain[x];
    			passCell.id = infoArray[x] [1];
    		}
    		deleteButton = document.createElement('BUTTON');
    		var idStr = infoArray[x] [0] + x.toString()
    		deleteButton.id = idStr;
    		deleteText = document.createTextNode('Delete ' + infoArray[x] [0])
			webCell.appendChild(webText);
			passCell.appendChild(passText);
			deleteCell.appendChild(deleteButton);
			deleteButton.appendChild(deleteText);
			tabRow.appendChild(webCell);
			tabRow.appendChild(passCell);
			if (x == 0) {
				table.appendChild(tabRow);	
			} else {
				tabRow.appendChild(deleteCell);
				table.appendChild(tabRow);
				setListener(idStr);
			}
		};
	};

	// Sets onclick listener functions on each of the buttons
	function setListener(elementId) {
		document.getElementById(elementId).onclick = function() {
			eleDelArr = elementId.split('');
			charDel = eleDelArr.pop();			
			sendForDel(charDel, infoArray);
		}
	}

	// Decodes the passwords in order to display the plaintext version of the passwords.
	function decodePasswords(passSentence, response) {
		var passEnc = [];
		var passPlain = [];
		var charPlaceNumbers = [];
		var generatedPassSen = '';
		infoString = response[x];
		var infoArray = [];
		for (x = 0; x <= response.length - 1; x ++) {
			var string = response[x];
			infoArray[x] = string.split(': ');
			passEnc[x] = infoArray[x] [1];
		}
		for (x = 0; x <= infoArray.length - 1; x++) {
			var password = '';
			if (x == 0) {
				passPlain[x] = passEnc[x];
				continue;
			} else {
				finalInt = finalArrayInt(passEnc[x]);
				var length = passSentence.length;
				if (finalInt == length) {
					generatedPassSen = passSentence;
				} else if (finalInt == (length + 5)) {
					generatedPassSen = passSentence + '|{_@&';
				} else if (finalInt == (length + 10)) {
					generatedPassSen = passSentence + '0123456789';
				} else if (finalInt == (length + 15)) {
					generatedPassSen = passSentence + '0123456789|{_@&';
				}
				charPlaceNumbers = passEnc[x];
				var strCharPlaceNums = charPlaceNumbers.split('-');
				var intCharPlaceNums = strCharPlaceNums.map(Number);
				for ( y = 0; y <= intCharPlaceNums.length - 2; y ++) {
					a = intCharPlaceNums[y];
					char = generatedPassSen[a];
					password += char;
				};
			};
			passPlain[x] = password;
		};
		return passPlain;
	};

	// Obtains the final number in the encoded passwords
	function finalArrayInt (password) {
		var finalLength = '';
		var characters = password.split('-');
		finalLength = characters[characters.length-1];
		return finalLength
	};

	// Clears the table ready for another to be built
	function clearTable(response) {
		for(x = 0; x <= response.length - 1; x ++) {
			document.getElementById('passwordTable').deleteRow(0);
		};
	};

	// Acquires the password that needs deleting from the database
	function sendForDel(webPassDel, infoArray) {
		elementId = infoArray[webPassDel] [1];
		elId = document.getElementById(elementId).id;
		chrome.runtime.sendMessage(elId);
		window.location.reload();	
	};

	// Hash of the entered PassSentence is obtained
	function hashCode(str) {
		return str.split('').reduce((prevHash, currVal) => ((prevHash << 5) - prevHash) + currVal.charCodeAt(0), 0);
	};

	// Hash of the PassSentence is compared to the stored hash in order to ensure the correct PassSentence has been entered.
	function checkHash(passSenHash, loadedHash) {
		if (passSenHash != loadedHash) {
			alert('PassSentence is incorrect. Please check and try again.');
			window.location.reload();
		} else {
			return true;
		}
	};
	var passwordsArray = [];

	// Messages are sent to obtain the passwords from the database and the stored hash for the PassSentence.
	chrome.runtime.sendMessage('message');
	chrome.runtime.sendMessage('retrieveHash');
	chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
		if (response[0].length > 1) {
			var resToString = response.join();
			var passSenHash = '';
			if (~resToString.indexOf("Password")) {
				passwordsArray = response;
			}
			buildTable(passwordsArray);
		} else {
			var retHash = response;
		}
		document.getElementById('view').onclick = function() {
			passSentence = document.getElementById('passSentence').value;
			passSenHash = hashCode(passSentence);
			if (passSentence == '') {
				alert('PassSentence is required.')
				event.preventDefault();
			} else {
				chrome.runtime.sendMessage('retrieveHash');
				var hashedOk = checkHash(passSenHash, retHash);
				if (hashedOk == true) {
					clearTable(passwordsArray);
					var passPlain = decodePasswords(passSentence, passwordsArray);
					buildTable(passwordsArray, passPlain);
				};
			};
		};
		
	});
};

		