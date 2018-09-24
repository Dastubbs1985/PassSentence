window.onload = function() {
	chrome.runtime.sendMessage('message');
	console.log('Sent message!')
	chrome.runtime.onMessage.addListener(function(response, sender, sendResponse) {
		console.log('Message received')
		var element = document.getElementById('welNewUser');
		while (element.firstChild) {
		    element.removeChild(element.firstChild);
		}
		var string = 'Welcome ' + response;
		element.appendChild(document.createTextNode(string));
	});
};