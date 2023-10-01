var screenshotImage = "";
let notes = JSON.parse(localStorage.getItem("OCR_TEXT"))
if(notes==null){
  notes = []
}
let listGroup = document.querySelector("#list-group")
notes.forEach(note => {
  let a = document.createElement("a");
  a.setAttribute("href", "#");
  a.setAttribute("class", "list-group-item list-group-item-action");
  a.setAttribute("data-bs-toggle", "tooltip");
  a.setAttribute("data-bs-placement", "bottom");
  a.setAttribute("title", "Click to copy");
  a.onclick = ()=>{
    navigator.clipboard.writeText(note);
  }
  a.innerText = note
  listGroup.appendChild(a);
});
document.getElementById("take_screenshot").onclick = async () => {
  const screenshot = await chrome.tabs.captureVisibleTab();
  screenshotImage = screenshot;
  chrome.runtime.sendMessage({ type: "screenshot", imageData: screenshot });
  iframe.contentWindow.postMessage(screenshot, "*");
}

