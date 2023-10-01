var screenshotImage = "";
let notes = JSON.parse(localStorage.getItem("OCR_TEXT"))
function renderList(notes){
  if(notes==null){
    notes = []
  }
  let listGroup = document.querySelector("#list-group")
  listGroup.innerHTML = "";
  let header = document.createElement("a");
  header.setAttribute("href", "#");
  header.setAttribute("class","list-group-item list-group-item-action active");
  header.setAttribute("aria-current", "true");
  header.innerText = "Text From OCR";
  listGroup.appendChild(header)
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
}
renderList(notes)
function search(searchTerm){
  let notes = JSON.parse(localStorage.getItem("OCR_TEXT"))
  if(notes==null){
    notes = []
  }
  newitem = notes.filter(function(item){return item.toLowerCase().includes(searchTerm.toLowerCase());})
  renderList(newitem)
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("searchInput").addEventListener("input", function(input){
    console.log(input.target.value)
    search(input.target.value)
  })
  document.getElementById("take_screenshot").onclick = async () => {
    const screenshot = await chrome.tabs.captureVisibleTab();
    screenshotImage = screenshot;
    chrome.runtime.sendMessage({ type: "screenshot", imageData: screenshot });
    iframe.contentWindow.postMessage(screenshot, "*");
  }
});

