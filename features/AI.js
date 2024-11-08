document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    const inputMsg = document.getElementById('msg_text').value.trim();
    const tb = document.getElementById('tb');

    if (inputMsg !== '') {
        // User message section
        appendMessage('You said:', inputMsg, 'msg', 'message-sender', tb);

        announce("Message sent successfully");
        document.getElementById('msg_text').value = '';  // Clear input field
        tb.scrollTop = tb.scrollHeight;  // Auto-scroll

        // Display loading indicator while fetching AI response
        const loadingIndicator = appendMessage('BTA AI is typing...', '...', 'msg1', 'loading', tb);

        // Fetch AI response
        fetchAIResponse(inputMsg, tb, loadingIndicator);
    }
});

function appendMessage(sender, text, messageClass, senderClass, parentElement) {
    const msgContainer = document.createElement('div');
    msgContainer.className = messageClass;

    const heading = document.createElement('h5');
    heading.textContent = sender;
    heading.className = senderClass;

    const msgText = document.createElement('span');
    msgText.textContent = text;

    msgContainer.appendChild(heading);
    msgContainer.appendChild(msgText);
    parentElement.appendChild(msgContainer);

    return msgContainer;
}

function fetchAIResponse(userMsg, tb, loadingIndicator) {
    const xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState === 4) {
            // Remove loading indicator
            tb.removeChild(loadingIndicator);

            if (this.status === 200) {
                const responseData = JSON.parse(xhttp.responseText);
                const answerValue = responseData.response;

                // Display AI response
                const aiMsgContainer = appendMessage('BTA AI said:', answerValue, 'msg1', 'message-sender', tb);
                
                // Add Copy button for AI response
                const copyButton = createCopyButton(answerValue);
                aiMsgContainer.appendChild(copyButton);

                // Auto-scroll and announce AI response
                tb.scrollTop = tb.scrollHeight;
                announce("Blind Tech Agent AI replied");
            } else {
                announce("Error retrieving AI response, please try again.");
            }
        }
    };

    xhttp.open("GET", "https://darkness.ashlynn.workers.dev/chat/?model=gpt-4o-mini&prompt=" + encodeURIComponent(userMsg), true);
    xhttp.send();
}

function createCopyButton(text) {
    const copyButton = document.createElement('button');
    copyButton.textContent = 'Copy';
    copyButton.className = 'btn copy-btn';
    copyButton.addEventListener('click', function () {
        navigator.clipboard.writeText(text)
            .then(() => announce("Message copied to clipboard"))
            .catch(() => announce("Failed to copy message"));
    });
    return copyButton;
}

document.getElementById('refreshButton').addEventListener('click', function () {
    const tb = document.getElementById('tb');
    tb.innerHTML = '';  // Clear chat area
    announce("Chat refreshed successfully");
    tb.scrollTop = 0;  // Scroll to top
});

function announce(message) {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'alert');
    announcement.className = 'visually-hidden';
    announcement.textContent = message;
    document.body.appendChild(announcement);
    
    setTimeout(() => document.body.removeChild(announcement), 1000);
}
