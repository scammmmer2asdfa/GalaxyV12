const nav = document.getElementById("tabGroup");
const body = document.getElementById("body");
let tabCount = 1;
let tabNumber = 0;
let activeTabId = null;
const input = document.getElementById("rogoisdabest");

function setActiveTab(tab) {
  //BIG BRAIN MOMENT OHHHHHHHHHHH
  document
    .querySelectorAll(".tab")
    .forEach((t) => t.classList.remove("active"));
  tab.classList.add("active");
  activeTabId = tab.id;
  document
    .querySelectorAll(".frame")
    .forEach((f) => (f.style.display = "none"));
  const iframe = document.getElementById("frame" + tab.id.replace("tab", ""));
  iframe.style.display = "block";
  input.value = getOriginalUrl(iframe.src);
}
function newTab() {
  tabNumber++;
  const tab = document.createElement("div");
  const divider = document.createElement("div");
  const iframe = document.createElement("iframe");

  if (tabNumber >= 2) {
    divider.className = "divider";
    divider.textContent = "|";
    nav.appendChild(divider);
  }

  iframe.className = "frame";
  iframe.id = "frame" + tabCount;

  tab.className = "tab";
  tab.id = "tab" + tabCount;
  tab.innerHTML = `
    <img src="../assets/img/icons/browser.png" alt="" class="favicon">
    <p class="tabName">New Tab</p>
    <p class="close">&#xEF2C</p>`;

  nav.appendChild(tab);
  body.appendChild(iframe);

  tab.addEventListener("click", () => setActiveTab(tab));
  const closeBtn = tab.querySelector(".close");
  closeBtn.addEventListener("click", (e) => {
    tabNumber--;
    e.stopPropagation();
    tab.remove();
    divider.remove();
    iframe.remove();
    input.value = "";
    if (activeTabId === tab.id) {
      //I'm lwk so smart
      const remainingTabs = document.querySelectorAll(".tab");
      if (remainingTabs.length > 0)
        setActiveTab(remainingTabs[remainingTabs.length - 1]);
    }
  });
  tab.addEventListener("mouseup", (e) => {
    if (e.button === 1) {
      tabNumber--;
      e.stopPropagation();
      tab.remove();
      divider.remove();
      iframe.remove();
      input.value = "";
      if (activeTabId === tab.id) {
        const remainingTabs = document.querySelectorAll(".tab");
        if (remainingTabs.length > 0)
          setActiveTab(remainingTabs[remainingTabs.length - 1]);
      }
    }
  });
  tabCount++;
  setActiveTab(tab);
}

newTab();

const back = document.getElementById("goBack");
const forward = document.getElementById("goForward");
const reload = document.getElementById("reload");
const more = document.getElementById("more");
const iframe = document.getElementById("frame" + activeTabId);
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

more.addEventListener("click", () => {
  console.log("clicked!");
});
function getOriginalUrl(url) {
  if (!url) return "";

  if (url.startsWith("http://") || url.startsWith("https://")) {
    if (url.includes("/scramjet/") && url.includes(location.origin)) {
      try {
        const urlObj = new URL(url);
        if (urlObj.pathname.startsWith("/scramjet/")) {
          const encodedUrl = urlObj.pathname.substring("/scramjet/".length);
          try {
            const decoded = decodeURIComponent(encodedUrl);
            if (decoded.startsWith("http")) {
              return decoded;
            }
            const base64Decoded = atob(encodedUrl);
            if (base64Decoded.startsWith("http")) {
              return base64Decoded;
            }
          } catch (e) {}
        }
      } catch (e) {}
    }
    return url;
  }
}
  function getWebsiteName(url) {
    try {
      if (!url || (!url.startsWith("http://") && !url.startsWith("https://"))) {
        return url;
      }
      
      const urlObj = new URL(url);
      let hostname = urlObj.hostname;
      
      if (hostname.startsWith('www.')) {
        hostname = hostname.substring(4);
      }
      
      return hostname;
    } catch (e) {
      return url.length > 20 ? url.substring(0, 20) + '...' : url;
    }
  }
