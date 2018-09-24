var existingPasswords = [];
var website = '';
var editedSentence = '';
var passSentence = '';


function $(id) {
	return document.getElementById(id)
};

function createPass(response) {
	var vars = response.split(',');
	editedSentence = vars[0];
	passSentence = vars[1];
	website = vars[2];
};

function storePass(password) {
	chrome.storage.sync.get('Passwords', function(obj) {
		var string = website + ': ' + password;
        var Passwords = obj.hasOwnProperty('Passwords') ? obj.Passwords : [];
        Passwords.push(string);
        chrome.storage.sync.set({'Passwords': Passwords});
    });
};

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

function viewPass() {
	chrome.storage.sync.get('Passwords', function(data) {
		Passwords = data.Passwords;
		chrome.runtime.sendMessage(Passwords);
	});
};

function storeUser(userName) {
	var Passwords = [];
	chrome.storage.sync.set({'userName': userName});
	string = 'Websites: ' + 'Password';
	Passwords[0] = string
	chrome.storage.sync.set({'Passwords': Passwords});
};

function setUser() {
	var user = '';
	chrome.storage.sync.get('userName', function(data) {
		user = data.userName;
		chrome.runtime.sendMessage(user);
	});
};

chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
	var string = sender.url;
	if (string.includes('popup.html')){
		setUser();
	} else if (string.includes('existingUser.html')) {
		setUser();
	} else if (string.includes('create.html')){
		createPass(response)
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
	} else if (string.includes('saved.html')){

	} else if (string.includes('signup.html')){
        storeUser(response);
	} else if (string.includes('view.html')){
		resString = response.toString();
		if (resString == 'message') {
			viewPass();
		} else {
			deletePass(response);
		}
	};
});