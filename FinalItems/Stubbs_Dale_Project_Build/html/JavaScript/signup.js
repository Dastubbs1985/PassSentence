window.onload = function() {
	chrome.storage.sync.clear()
	document.getElementById('confirm').onclick = function() {
		var userName = document.getElementById('signUpBox').value;
		// Error checking on the username field
		if (userName == '') {
			alert('Username is Required')
			event.preventDefault();
		} else {
			// Sends the username to the background script.
			chrome.runtime.sendMessage(userName);
		};
	};
};