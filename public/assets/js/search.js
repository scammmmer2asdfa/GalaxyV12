import {
  setTransport,
  setWisp,
  makeURL,
  proxySJ,
  proxyUV,
} from "../../lithium.mjs";
import("../../uv/uv.config.js");
let iframe;
const protocol = location.protocol === "https:" ? "wss://" : "ws://";
const host = location.host;

setWisp(`${protocol}${host}/wisp/`);
setTransport("epoxy");

document.addEventListener("keyup", async (e) => {
  if (e.key === "Enter" || e.keyCode === 13) {
    const tabNumber = activeTabId.replace("tab", "");
    iframe = document.getElementById("frame" + tabNumber);
    if (
      //Checks for https in url
      input.value.trim().includes(".") &&
      !input.value.trim().startsWith("http://") &&
      !input.value.trim().startsWith("https://")
    ) {
      input.value = "https://" + input.value;
    }

    console.log("Final URL:", input.value);
    let url;
    const proxyType = localStorage.getItem("proxyType"); //Checks for proxy
    if (proxyType === "SJ") {
      url = await proxySJ(makeURL(input.value));
      console.log("set to SJ");
    } else if (proxyType === "UV") {
      url = await proxyUV(makeURL(input.value));
      console.log("set to UV");
    } else {
      url = await proxySJ(makeURL(input.value));
      console.log("Not set");
      proxyType = localStorage.setItem("SJ");
    }
    iframe.src = url;
    if (proxyType === "SJ") {
      input.value = getOriginalUrl(iframe.src);
    } else if (proxyType === "UV") {
      input.value = decodeURL(iframe.src);
    } else {
      input.value = getOriginalUrl(iframe.src);
    }

    console.log("Loading URL in", iframe.id, ":", url);
    const currentTab = document.getElementById("tab" + tabNumber);
    const tabName = currentTab?.querySelector(".tabName");
    if (tabName) {
      iframe.onload = () => {
        try {
          tabName.textContent =
            iframe.contentDocument?.title + " (" + proxyType + ")" ||
            "Untitled";
        } catch {
          tabName.textContent = "Cross-origin page";
        }
      };
    }
  }
});
