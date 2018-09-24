window.onload = function() {
	chrome.storage.sync.clear()
	document.getElementById('confirm').onclick = function() {
		var userName = document.getElementById('signUpBox').value;
		if (userName == '') {
			alert('Username is Required')
		} else {
			chrome.runtime.sendMessage(userName);
		};
	};
};