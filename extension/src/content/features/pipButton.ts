export function initPipButton(): void {
  const pipButtonSelector: string = "#movie_player .ytp-right-controls > button.ytp-pip-button";
  let isPipActive: boolean = false;

  const pipIcon: string = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
      <path d="M80-520v-80h144L52-772l56-56 172 172v-144h80v280H80Zm80 360q-33 0-56.5-23.5T80-240v-200h80v200h320v80H160Zm640-280v-280H440v-80h360q33 0 56.5 23.5T880-720v280h-80ZM560-160v-200h320v200H560Z"/>
    </svg>
  `;

  const pipExitIcon: string = `
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e3e3e3">
      <path d="M160-160q-33 0-56.5-23.5T80-240v-280h80v280h640v-480H440v-80h360q33 0 56.5 23.5T880-720v480q0 33-23.5 56.5T800-160H160Zm523-140 57-57-124-123h104v-80H480v240h80v-103l123 123ZM80-600v-200h280v200H80Zm400 120Z"/>
    </svg>
  `;

  const setIcon = (icon: string, button: HTMLButtonElement): void => {
    const oldSvg = button.querySelector("svg");
    if (oldSvg) {
      oldSvg.classList.remove("enter");
      oldSvg.classList.add("exit");
      setTimeout(() => oldSvg.remove(), 250);
    }

    button.insertAdjacentHTML("beforeend", icon);
    const newSvg = button.querySelector("svg:last-child");
    if (newSvg) {
      requestAnimationFrame(() => newSvg.classList.add("enter"));
    }
  };

  const updatePipState = (button: HTMLButtonElement): void => {
    const video = document.querySelector<HTMLVideoElement>("#movie_player video");
    const isInPip = document.pictureInPictureElement === video;
    if (isInPip !== isPipActive) {
      isPipActive = isInPip;
      setIcon(isPipActive ? pipExitIcon : pipIcon, button);
    }
  };

  const observer = new MutationObserver(() => {
    const pipButton = document.querySelector<HTMLButtonElement>(pipButtonSelector);
    if (!pipButton) return;

    observer.disconnect();
    pipButton.removeAttribute("style");
    pipButton.innerHTML = pipIcon;
    const initialSvg = pipButton.querySelector("svg");
    if (initialSvg) initialSvg.classList.add("enter");

    // Check initial PiP state
    updatePipState(pipButton);

    // Handle click on custom PiP button
    pipButton.addEventListener("click", () => {
      isPipActive = !isPipActive;
      setIcon(isPipActive ? pipExitIcon : pipIcon, pipButton);

      // Trigger native PiP programmatically
      const video = document.querySelector<HTMLVideoElement>("#movie_player video");
      if (video) {
        if (isPipActive && !document.pictureInPictureElement) {
          video.requestPictureInPicture().catch((err) => {
            console.error("Failed to enter PiP:", err);
            isPipActive = false;
            setIcon(pipIcon, pipButton);
          });
        } else if (!isPipActive && document.pictureInPictureElement) {
          document.exitPictureInPicture().catch((err) => {
            console.error("Failed to exit PiP:", err);
            isPipActive = true;
            setIcon(pipExitIcon, pipButton);
          });
        }
      }
    });

    // Monitor external PiP changes (e.g., via double right-click)
    const video = document.querySelector<HTMLVideoElement>("#movie_player video");
    if (video) {
      video.addEventListener("enterpictureinpicture", () => updatePipState(pipButton));
      video.addEventListener("leavepictureinpicture", () => updatePipState(pipButton));
    }

    // Periodically check PiP state for robustness
    setInterval(() => updatePipState(pipButton), 1000);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}