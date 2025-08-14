chrome.runtime.onInstalled.addListener(() => {
  console.log("YTweaks extension installed!");
});

// Lắng nghe message từ popup hoặc content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message);
  sendResponse({ status: "ok" });
});
