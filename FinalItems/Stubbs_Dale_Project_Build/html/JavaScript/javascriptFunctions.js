var existingPasswords = [];
var website = '';
var editedSentence = '';
var passSentence = '';

// Sets the global variables equal to the values sent from the front end script
function createPass(response) {
	var vars = response.split(',');
	editedSentence = vars[0];
	passSentence = vars[1];
	website = vars[2];
};

// Adds the password to the database
function storePass(password) {
	chrome.storage.sync.get('Passwords', function(obj) {
		var string = website + ': ' + password;
        var Passwords = obj.hasOwnProperty('Passwords') ? obj.Passwords : [];
        Passwords.push(string);
        chrome.storage.sync.set({'Passwords': Passwords});
    });
};

// Retrieves all of the passwords from the database, cycles through them to find the correct one, 
// removes it from the database and then stores the new password list back to the database.
function deletePass(website) {
	chrome.storage.sync.get('Passwords', function(obj) {
		var Passwords = obj.hasOwnProperty('Passwords') ? obj.Passwords : [];
		var PasswordsNew = [];
		for (x = 0; x <= Passwords.length - 1; x++) {
			var string = Passwords[x];
			if (string.includes(website)) {
				continue
			} else {
				PasswordsNew[x] = Passwords[x];
			}
		}
		PasswordsNew = PasswordsNew.filter(function(e){return e}); 
		chrome.storage.sync.set({'Passwords': PasswordsNew});
	});
	
};

//  Passwords array is retrieved from the database and sent to the calling script.
function viewPass() {
	chrome.storage.sync.get('Passwords', function(data) {
		Passwords = data.Passwords;
		chrome.runtime.sendMessage(Passwords);
	});
};

// Username and passwords array are created and added to the database.
function storeUser(userName) {
	var Passwords = [];
	chrome.storage.sync.set({'userName': userName});
	string = 'Websites: ' + 'Password';
	Passwords[0] = string
	chrome.storage.sync.set({'Passwords': Passwords});
};

// Retrieves the username from the database and sends it to the calling script.
function setUser() {
	var user = '';
	chrome.storage.sync.get('userName', function(data) {
		user = data.userName;
		chrome.runtime.sendMessage(user);
	});
};

// Hash of the original PassSentence is stored if there is no value currently stored.
function storeHash(hashToStore) {
	chrome.storage.sync.get('hash', function(data) {
		hash = data.hash;
		if (hash === undefined) {
			chrome.storage.sync.set({'hash': hashToStore});
		}
	});
}

// Hash value of the PassSentence is retrieved and sent to the calling script.
function getHash() {
	chrome.storage.sync.get('hash', function(data) {
		hash = data.hash;
		if (hash !== undefined) {
			chrome.runtime.sendMessage(hash);
		} else {
			chrome.runtime.sendMessage('undefined');
		}
	});
}

// Messages are recieved from the front end JavaScript files and processed.
chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
	var string = sender.url;
	if (string.includes('popup.html')){
		setUser();
	} else if (string.includes('existingUser.html')) {
		setUser();
	} else if (string.includes('create.html')){
		resString = response.toString();
		if (resString == 'retrieveHash') {
			getHash()
		} else {
			var splits = response.split(',');
			createPass(response);
			storeHash(splits[3]);
		}
	} else if (string.includes('newUser.html')){
		setUser();
	} else if (string.includes('pass.html')){
		resString = response.toString();
		if (resString == 'message') {
			chrome.runtime.sendMessage(editedSentence + ',' + website + ',' + passSentence);
		} else {
			var string = response.join();
			var passString = string.replace(/,/gi, '-');
			storePass(passString);
		};
	} else if (string.includes('signup.html')){
        storeUser(response);
	} else if (string.includes('view.html')){
		resString = response.toString();
		if (resString == 'message') {
			viewPass();
		} else if (resString == 'retrieveHash') {
			getHash()
		} else {
			deletePass(response);
			viewPass();
		}
	};
});