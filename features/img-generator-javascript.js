function sendPrompt() {
    var input = document.getElementById('imgPrompt');
    var prompt = input.value.trim();
    if (prompt) {
        generateImage(prompt);
        input.value = '';
    }
}

function generateImage(query) {
    var apiUrl = 'https://aiimage.hellonepdevs.workers.dev/?prompt=' + encodeURIComponent(query);
    displayImage(apiUrl);
    document.getElementById('imgBox').style.display = "block";
}

function displayImage(apiUrl) {
    var imgBox = document.getElementById('imgBox');
    imgBox.innerHTML = `
    <img class="img" src="${apiUrl}" alt="Generated Image" style="display: block; margin: auto;">
`;
downloadImage(apiUrl);
    setTimeout(after, 1000);
    function after() {
        var imgBox = document.getElementById('imgBox');
        announce('image generated successfully');
        imgBox.scrollTop = imgBox.scrollHeight;
    }
}

function downloadImage(url) {
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'generated_image.png');
            document.body.appendChild(link);

}
