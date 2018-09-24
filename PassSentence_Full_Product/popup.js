window.onload = function() {
	var loc = location.href;
	function validateForm(userName) {
		var user = document.forms['popup']['logBox'].value;
		if (user != userName) {
			alert('Invalid Username');
			event.preventDefault();
		} else if (userName == '') {
			alert('Username is Required')
		}
	}	
	var user;
	chrome.storage.sync.get('userName', function(data) {
		user = data.userName;
		document.getElementById('loginButton').onclick = function() {
			validateForm(user);
		};
	});
};