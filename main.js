function createImgNode(src) {
  var imageNode = document.createElement("img");
  imageNode.id = "image";
  imageNode.src = src;
  var textArea = document.getElementById("convertText");
  document.body.insertBefore(imageNode, textArea);
}
window.addEventListener('DOMContentLoaded', function () {
  chrome.runtime.sendMessage({ type: "requestScreenshot" }, function (response) {
    createImgNode(response.screenshotImage);
    var image = document.querySelector('#image');
    var cropper = new Cropper(image, {
      autoCrop: false,
      toggleDragModeOnDblclick: true,
    });
    var button = this.document.querySelector("#getText");
    button.onclick = function () {
      var crop_image = cropper.getCroppedCanvas().toDataURL('image/jpeg');
      cropper.replace(crop_image);
      chrome.runtime.sendMessage({ type: "getText", imageData: crop_image });
      // Send image to sandbox to process
      iframe.contentWindow.postMessage(crop_image, "*");
    };
  });
});

window.addEventListener('message', function(event) {
  item = JSON.parse(localStorage.getItem("OCR_TEXT"));
  if(item==null){
    item = []
  }
  item.push(event.data);
  localStorage.setItem("OCR_TEXT", JSON.stringify(item));
});