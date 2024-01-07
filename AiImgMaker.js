const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");
let isImageGenerating = false;
// Import your API key from secrets.js
const secrets = require('./secrets');
const apiKey = "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";
const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {    
const imgCard = imageGallery.querySelectorAll(".img-card")[index];    
const imgElement = imgCard.querySelector("img");    
const downloadBtn = imgCard.querySelector(".download-btn");
    // Set the image source to the AI-generated image data    
const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImage;
    // When the image is loaded, remove the loading class and set download attributes
    imgElement.onload = () => {
      imgCard.classList.remove("loading"); // Fixed the typo
      downloadBtn.setAttribute("href", aiGeneratedImage);
      downloadBtn.setAttribute("download", `${new Date().getTime()}.jpg`);    
};  
});
};
const generateAiImages = async (userPrompt, userImgQuantity) => {  
try {    
// Send a request to the OpenAI API to generate images based on user inputs    
const response = await fetch("https://api.openai.com/v1/images/generations", {      
method: "POST",      
headers: {        
'Content-Type': 'application/json',        
'Authorization': `Bearer ${apiKey}`, // Use your API key from secrets.js
