import enhancePipButton from "./features/enhancePipButton";

console.log("YTweaks content script loaded.");

// Hàm khởi chạy tính năng nếu được bật
function runFeatures() {
  if (JSON.parse(localStorage.getItem("enhancePipButton") || "false")) {
    enhancePipButton();
  }
}

runFeatures();

// Nghe popup gửi yêu cầu bật/tắt
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "toggleFeature") {
    localStorage.setItem(message.key, JSON.stringify(message.value));
    runFeatures(); // Cập nhật lại ngay
    sendResponse({ status: "updated" });
  }
});
