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
      toggleDragModeOnDblclick: false,
      moveable: false,
      viewMode: 3,
      cropstart: function (e) {
        console.log("START", e)
      },
      cropmove: function (e) {
        document.getElementById("overlay").setAttribute("hidden", "");
        cropBox = document.getElementsByClassName("cropper-crop-box")[0];
        cropBoxDim = cropBox.getBoundingClientRect();
        button = document.getElementById("convertText");
        button.removeAttribute("hidden")
        button.style = `top: ${cropBoxDim.top - button.clientHeight<0?0:cropBoxDim.top - button.clientHeight}px;left:${cropBoxDim.left}px;`
      }
    });
    document.getElementById("close").onclick = () => {
      cropper.clear();
      document.getElementById("overlay").removeAttribute("hidden");
      document.getElementById("convertText").setAttribute("hidden", "")
    }
    window.onresize = function (event) {
      cropper.reset();
    };

    var button = this.document.querySelector("#getText");
    button.onclick = function () {
      var crop_image = cropper.getCroppedCanvas().toDataURL('image/jpeg');
      document.getElementById("loading").removeAttribute("hidden");
      document.getElementById("getText").setAttribute("hidden", "")
      chrome.runtime.sendMessage({ type: "getText", imageData: crop_image });
      // Send image to sandbox to process
      iframe.contentWindow.postMessage(crop_image, "*");
    };
  });
});
window.addEventListener('message', function (event) {
  item = JSON.parse(localStorage.getItem("OCR_TEXT"));
  if (item == null) {
    item = []
  }
  const withoutLineBreaks = event.data.replace(/[\r\n]/gm, '');
  item.unshift(withoutLineBreaks);
  localStorage.setItem("OCR_TEXT", JSON.stringify(item));
  document.getElementById("getText").removeAttribute("hidden");
  document.getElementById("loading").setAttribute("hidden", "");
  alert(event.data);
});