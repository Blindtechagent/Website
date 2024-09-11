function announce(message) {
    // Announce the message for screen readers
    var liveRegion = document.createElement('div');
    liveRegion.setAttribute('aria-live', 'assertive');
    liveRegion.setAttribute('class', 'sr-only');
    liveRegion.innerText = message;
    document.body.appendChild(liveRegion);

    // Remove the element after the message is announced
    setTimeout(function() {
        document.body.removeChild(liveRegion);
    }, 2000);
}

function sendRequest() {
    var input_word = document.getElementById('synonym-word').value;
    var synonym_count = document.getElementById('synonym-count').value;

    if (input_word !== '') {
        announce("Finding synonyms, please wait...");
        const provided_word = input_word;
        document.getElementById('synonym-word').value = '';
        const synonymsContainer = document.getElementsByClassName("synonym-container")[0];
        synonymsContainer.innerHTML = ''; // Clear previous results
        var xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = function () {
            if (this.readyState == 4) {
                if (this.status == 200) {
                    const responseData = JSON.parse(xhttp.responseText);
                    const answerValue = responseData.answer;
                    const synonyms = answerValue.split('\n'); // Split synonyms into an array
                    synonyms.forEach(function (synonym) {
                        var synonymItem = document.createElement('div');
                        synonymItem.classList.add('synonym-item');

                        var synonymSpan = document.createElement('span');
                        synonymSpan.innerHTML = synonym.trim();
                        synonymItem.appendChild(synonymSpan);

                        // Add copy button
                        var copyButton = document.createElement('button');
                        copyButton.innerText = 'Copy';
                        copyButton.classList.add('btn', 'copy-btn');

                        copyButton.addEventListener('click', function () {
                            navigator.clipboard.writeText(synonym.trim());
                            announce("Synonym copied: " + synonym.trim());
                        });

                        synonymItem.appendChild(copyButton);
                        synonymsContainer.appendChild(synonymItem);
                    });

                    announce("Synonyms generated successfully!");
                } else {
                    announce("An error occurred while finding synonyms.");
                }
                synonymsContainer.scrollTop = synonymsContainer.scrollHeight;
            }
        };

        const prompt = `Provide ${synonym_count} accurate and easy-to-recognize synonyms for the word: ${provided_word}. Each synonym should be on a separate line and relevant to the provided word. Just provide the synonyms, nothing else.
synonyms should not be repeated.
`;

        xhttp.open("POST", "https://chatgpt.apinepdev.workers.dev/?question=" + encodeURIComponent(prompt), true);

        xhttp.send();
    }
}