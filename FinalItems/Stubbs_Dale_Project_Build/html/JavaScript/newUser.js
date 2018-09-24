window.onload = function() {
	// Receives the username from the background script and displays it on the screen.
	chrome.runtime.sendMessage('message');
	chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
		var element = document.getElementById('welNewUser');
		while (element.firstChild) {
		    element.removeChild(element.firstChild);
		}
		var string = 'Welcome ' + response;
		element.appendChild(document.createTextNode(string));
	});
};