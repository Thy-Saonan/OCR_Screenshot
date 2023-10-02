const { createWorker } = require('tesseract.js');
window.addEventListener("message", async (event) => {
  if (event.data.type == "imageProcessing" || event.data.type == "cancel") {
    const worker = createWorker(event.data.lang);
    if (event.data.type == "imageProcessing") {
      const url = event.data.image;
      worker.then((worker) => {
        worker.recognize(event.data.image).then(({ data: { text } }) => {
          console.log(text);
          window.parent.postMessage({ type: "processedText", text: text }, "*");
        });
      })

    }
    else {
      await worker.then((worker) => {
        worker.terminate();
      })
    }

  }
});