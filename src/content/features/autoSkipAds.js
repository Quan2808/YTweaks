export default function autoSkipAds() {
  const observer = new MutationObserver(() => {
    const skipBtn = document.querySelector(".ytp-ad-skip-button");
    if (skipBtn) skipBtn.click();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
