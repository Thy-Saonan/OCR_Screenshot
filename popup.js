var screenshotImage = "";
let notes = JSON.parse(localStorage.getItem("OCR_TEXT"));

function removeListItem(index) {
  let notes = JSON.parse(localStorage.getItem("OCR_TEXT"));
  notes.splice(index, 1)
  window.localStorage.setItem("OCR_TEXT", JSON.stringify(notes))
}
function renderListItem(note, index) {
  let div = document.createElement("div");
  let a = document.createElement("a");
  let removeBtn = document.createElement("button");

  a.setAttribute("href", "#");
  a.setAttribute("class", "list-group-item list-group-item-action");
  a.setAttribute("data-bs-toggle", "tooltip");
  a.setAttribute("data-bs-placement", "bottom");
  a.setAttribute("title", "Click to copy");
  a.onclick = () => {
    navigator.clipboard.writeText(note);
  }
  a.innerText = note

  removeBtn.setAttribute("class", "remove");
  removeBtn.setAttribute("index", index);
  removeBtn.innerText = "remove";
  div.appendChild(removeBtn);
  div.appendChild(a);
  return div;
}
function renderList(notes) {
  if (notes == null) {
    notes = []
  }
  let listGroup = document.querySelector("#list-group")
  listGroup.innerHTML = "";
  let header = document.createElement("a");
  let div = document.createElement("div");
  let removeBtn = document.createElement("button");
  header.setAttribute("href", "#");
  header.setAttribute("class", "list-group-item list-group-item-action active");
  header.setAttribute("aria-current", "true");
  header.innerText = "Text From OCR";

  removeBtn.setAttribute("style", "position: absolute; right: 22px; margin-top: 2px;z-index:3;");
  removeBtn.setAttribute("class", "btn btn-danger");
  removeBtn.innerText = "clear";
  removeBtn.onclick = () => {
    window.localStorage.setItem("OCR_TEXT", null);
    renderList();
  }
  div.appendChild(removeBtn);
  div.appendChild(header);

  listGroup.appendChild(div)
  notes.forEach((note, index) => {
    listGroup.append(renderListItem(note, index));
  });

  

}
function setRemoveBtnsEvent(){
  var removeBtns = document.getElementsByClassName("remove");
  for (var i = 0; i < removeBtns.length; i++) {
    removeBtns[i].onclick = function (data) {
      button = data.srcElement;
      removeListItem(button.getAttribute("index"));
      renderList(JSON.parse(localStorage.getItem("OCR_TEXT")));
      setRemoveBtnsEvent();
    }
  }
}
renderList(notes)
setRemoveBtnsEvent()
function search(searchTerm) {
  let notes = JSON.parse(localStorage.getItem("OCR_TEXT"));
  if (notes == null) {
    notes = []
  }
  newitem = notes.filter(function (item) { return item.toLowerCase().includes(searchTerm.toLowerCase()); })
  renderList(newitem)
}

document.addEventListener("DOMContentLoaded", (event) => {
  document.getElementById("searchInput").addEventListener("input", function (input) {
    search(input.target.value)
  })
  document.getElementById("take_screenshot").onclick = async () => {
    const screenshot = await chrome.tabs.captureVisibleTab();
    screenshotImage = screenshot;
    chrome.runtime.sendMessage({ type: "screenshot", imageData: screenshot });
    iframe.contentWindow.postMessage(screenshot, "*");
  }
});

