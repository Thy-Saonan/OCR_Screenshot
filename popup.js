var screenshotImage = "";
let notes = JSON.parse(localStorage.getItem("OCR_TEXT"))
if(notes==null){
  notes = []
}
let noteList = document.querySelector("#notes")
notes.forEach(note => {
  let li = document.createElement("li")
  li.innerText = note
  noteList.appendChild(li)
});
document.getElementById("take_screenshot").onclick = async () => {
  const screenshot = await chrome.tabs.captureVisibleTab();
  screenshotImage = screenshot;
  chrome.runtime.sendMessage({ type: "screenshot", imageData: screenshot });
  iframe.contentWindow.postMessage(screenshot, "*");
}

