export default function hideShorts() {
  const observer = new MutationObserver(() => {
    document.querySelectorAll('ytd-rich-section-renderer[section-identifier="shorts-shelf"]').forEach(el => el.remove());
  });

  observer.observe(document.body, { childList: true, subtree: true });
}
