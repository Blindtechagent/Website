function announce(message) {
    // Announce the message for screen readers
    var liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'assertive');
    liveRegion.setAttribute('class', 'sr-only');
    liveRegion.innerText = message;
    document.body.appendChild(liveRegion);

    // Remove the element after the message is announced
    setTimeout(function () {
        document.body.removeChild(liveRegion);
    }, 1000);
}

function sendRequest(event) {
    event.preventDefault();
    var prompt = document.getElementById('prompt').value;

    if (prompt !== '') {
        announce("Generating article, please wait...");

        // Clear input fields
        document.getElementById('prompt').value = '';

        const msg_container = document.getElementsByClassName("msg-container")[0];
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    const responseData = JSON.parse(xhttp.responseText);
                    const answerValue = responseData.response;

                    var AI_responce = document.createElement('div');
                    AI_responce.innerHTML = answerValue;
                    AI_responce.setAttribute('class', 'AI_responce');
                    msg_container.appendChild(AI_responce);

                    // Add copy button
                    var copyButton = document.createElement('button');
                    copyButton.innerText = 'Copy';
                    copyButton.classList.add('btn', 'copy-btn');

                    announce("AI replied!");

                    copyButton.addEventListener('click', function () {
                        navigator.clipboard.writeText(answerValue);
                        announce("Message copied");
                    });

                    msg_container.appendChild(copyButton);
                } else {
                    announce("An error occurred while generating the responce.");
                }
                msg_container.scrollTop = msg_container.scrollHeight;
            }
        };

        const apiEndpoint = "https://darkness.ashlynn.workers.dev/chat/?model=gpt-4o-mini&prompt=";
        xhttp.open("GET", apiEndpoint + `${prompt}`, true
        );
        xhttp.send();
    } else {
        announce("Please enter a topic.");
    }
}
