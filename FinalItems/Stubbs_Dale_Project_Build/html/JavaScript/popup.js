window.onload = function() {
	var loc = location.href;
	function validateForm(userName) {
		var user = document.forms['popup']['logBox'].value;
		// Error checking on the username field
		if (user != userName) {
			alert('Invalid Username');
			event.preventDefault();
		} else if (userName == '') {
			alert('Username is Required')
			event.preventDefault();
		}
	}	
	// Sends the username to the background script
	var user;
	chrome.storage.sync.get('userName', function(data) {
		user = data.userName;
		document.getElementById('loginButton').onclick = function() {
			validateForm(user);
		};
	});
};