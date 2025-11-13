const back = document.getElementById("goBack");
const forward = document.getElementById("goForward");
const reload = document.getElementById("reload");
const moreBtn = document.getElementById("more");
const overlay = document.getElementById("overlay");
const moreMenu = document.getElementById("moreMenu"); // <-- missing before
const changeProxy = document.getElementById("changeProxy");
const proxyMenu = document.getElementById("proxyMenu");
const setUV = document.getElementById("setUV");
const setSJ = document.getElementById("setSJ");
const setAuto = document.getElementById("setAuto");

reload.addEventListener("click", () => {
  const iframe = document.getElementById(
    "frame" + activeTabId.replace("tab", "")
  );
  iframe.contentWindow.location.reload();
  input.value = getOriginalUrl(iframe.src);
});

forward.addEventListener("click", () => {
  const iframe = document.getElementById(
    "frame" + activeTabId.replace("tab", "")
  );
  iframe.contentWindow.history.forward();
});

back.addEventListener("click", () => {
  const iframe = document.getElementById(
    "frame" + activeTabId.replace("tab", "")
  );
  iframe.contentWindow.history.back();
});

// Toggle main menu
moreBtn.addEventListener("click", (e) => {
  moreMenu.classList.toggle("show");
  overlay.classList.toggle("show");
  e.stopPropagation();
});

// Toggle proxy submenu
changeProxy.addEventListener("click", (e) => {
  proxyMenu.classList.toggle("show");
  e.stopPropagation();
});

// Proxy actions
setUV.addEventListener("click", () => {
  console.log("UV selected");
  localStorage.setItem("proxyType", "UV");
  proxyMenu.classList.remove("show");
  moreMenu.classList.remove("show");
  overlay.classList.remove("show");
});

setSJ.addEventListener("click", () => {
  console.log("SJ selected");
  localStorage.setItem("proxyType", "SJ");
  proxyMenu.classList.remove("show");
  moreMenu.classList.remove("show");
  overlay.classList.remove("show");
});

// Close menus when overlay clicked
overlay.addEventListener("click", () => {
  overlay.classList.remove("hide");
  moreMenu.classList.remove("hide");
  proxyMenu.classList.remove("hide");
});
