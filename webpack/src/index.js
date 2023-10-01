const Tesseract = require('tesseract.js');

window.addEventListener("message", (event) => {
  const url = event.data;
  console.log("Hello World From Iframe", url)
  Tesseract.recognize(
    url,
    "eng",
    { logger: m => console.log(m) }
  ).then(({ data: { text } }) => {
    console.log(text);
    window.parent.postMessage(text, "*");
    document.getElementById("text").innerText = text;
  })
});