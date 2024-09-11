const generateBtn = document.getElementById('gntSummary');
const summaryContainer = document.getElementsByClassName('summary')[0];
let extractedText = '';


function extractText() {
    return new Promise((resolve, reject) => {
        const fileInput = document.getElementById('fileInput');

        if (fileInput.files.length === 0) {
            announce('Please select a PDF file.');
            return reject('No file selected');
        }

        announce('Generating summary, please wait...');

        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function () {
            const typedarray = new Uint8Array(this.result);

            pdfjsLib.getDocument(typedarray).promise.then(pdf => {
                let textPromises = [];
                for (let i = 1; i <= pdf.numPages; i++) {
                    textPromises.push(pdf.getPage(i).then(page => page.getTextContent()));
                }
                return Promise.all(textPromises);
            }).then(pages => {
                extractedText = pages.map(page => page.items.map(item => item.str).join(' ')).join('\n');
                resolve();
            }).catch(err => reject(err));
        };

        reader.readAsArrayBuffer(file);
    });
}

function gntSummary() {
    extractText().then(() => {
        summarizePdf();
    }).catch(err => {
        console.error('Error extracting text:', err);
    });
}

function summarizePdf() {
    var xhttp = new XMLHttpRequest();

    xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                const responseData = JSON.parse(xhttp.responseText);
                const answerValue = responseData.answer;

                var generatedSummary = document.createElement('div');
                generatedSummary.id = 'summary';
                generatedSummary.innerHTML = answerValue;
                generatedSummary.setAttribute('class', 'GeneratedArticle');
                summaryContainer.appendChild(generatedSummary);
                summaryContainer.style.display = 'block';
                announce("Summary generated successfully!");
            } else {
                console.error('Error generating summary:', this.statusText);
            }
        }
    };

    announce('Generating summary, please wait...'); // Alert user before making AJAX request
    xhttp.open("POST", "https://chatgpt.apinepdev.workers.dev/?question=" + `Summarize the text below using simple words and sentences.
Text:
${extractedText}
Summary Instructions:
1.
Use simple and clear words.
2.
Make the summary easy for everyone to understand.
3.
Write in a formal tone but avoid difficult words or jargon.
4.
Create at least 3 headings based on the main topics in the text: "Main Summary", "Key Points", and "Conclusion". You can generate more headings if needed according to the topic.
5.
Organize the content into sections that follow the text's structure:
•
Each section should cover a key point from the text.
•
Ensure each section flows logically to the next.
•
Avoid repeating information.
Additional Instructions:
•
It is strictly required that the summary be in the same language as the text provided. for example if the text is in hindi so you also have to provide summary in hindi.
•
Make the summary logical and easy to follow.
•
Avoid unnecessary words.
•
Write the summary in simple HTML format:
•
Use h2 for section headings.
•
Use p for paragraphs.
•
Use ul and li for bullet points.
This ensures the summary accurately reflects the content and is easy to read and understand in the language of the original text.`, true);
    xhttp.send();
}

generateBtn.addEventListener('click', gntSummary);