window.onload = function() {
	function buildTable(response, passPlain) {
		var infoArray = [];
		for (x = 0; x <= response.length - 1; x ++) {
			var string = response[x];
			infoArray[x] = string.split(': ');
		}

		for (x = 0; x <= infoArray.length - 1; x++) {
			table = document.getElementById('passwordTable');
			tabRow = document.createElement('tr');
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
    		} else {
    			passText = document.createTextNode(passPlain[x]);
    		}
    		deleteButton = document.createElement('BUTTON');
    		deleteButton.id = infoArray[x] [0];
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
			}
		};
	};

	function decodePasswords(passSentence, response) {
		// split response - keep passwords in new array
		// get last digit from the password
		// generate password based on digit
		//decode password using generated sentence
		//return decoded passwords in an array
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

	function finalArrayInt (password) {
		var finalLength = '';
		var characters = password.split('-');
		finalLength = characters[characters.length-1];
		return finalLength
	};

	function clearTable(response) {
		for(x = 0; x <= response.length - 1; x ++) {
			document.getElementById('passwordTable').deleteRow(0);
		}
	}

	function handleClick(event) {
		event = event || window.event;
		event.target = event.target || event.srcElement;

		var element = event.target;
		var webPassDel;
		while (element) {
			if (element.nodeName === 'BUTTON'){
				console.log(element)
				//sendForDel(element.id);
				break
			}
			element = element.parentNode;
		}
		return webPassDel;
	}

	function sendForDel(webPassDel) {
		chrome.runtime.sendMessage(webPassDel);
		window.location.reload()	
	}
	chrome.runtime.sendMessage('message');
	chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
		buildTable(response);
		document.getElementById('view').onclick = function() {
			if (document.getElementById('passSentence').value == '') {
				alert('PassSentence is required.')
				event.preventDefault();
			} else {
				clearTable(response);
				var passSentence = document.getElementById('passSentence').value;
				var passPlain = decodePasswords(passSentence, response);
				buildTable(response, passPlain);
			}
		};
		
	});
	if (document.addEventListener) {
    	document.addEventListener("click", handleClick, false);
	} else if (document.attachEvent) {
    	document.attachEvent("onclick", handleClick);
	}
};