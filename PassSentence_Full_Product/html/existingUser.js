window.onload = function() {
	chrome.runtime.sendMessage('message');
	chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
		var element = document.getElementById('welUser');
		while (element.firstChild) {
		    element.removeChild(element.firstChild);
		}
		var string = 'Welcome ' + response;
		element.appendChild(document.createTextNode(string));
	});
};