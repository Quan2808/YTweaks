export default function enhancePipButton() {
  'use strict';

  const pipButton = document.querySelector("#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-right-controls > button.ytp-pip-button.ytp-button");
  let isPipEnhanced = false;

  // Toggle color for PiP button
  const togglePipColor = () => {
    isPipEnhanced = !isPipEnhanced;
    console.log("PiP button enhanced:", isPipEnhanced);
    pipButton.querySelector("svg").setAttribute('fill', isPipEnhanced ? '#ff0000' : '#fff');
  };

  // Replace PiP button SVG with custom icon
  if (pipButton) {
    pipButton.removeAttribute('style');
    pipButton.innerHTML = '<svg width="100%" height="100%" fill="#fff" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, -1, 0, 0)" stroke-width="0.00024000000000000003" style="transform: scale(0.62, -0.62); transition: all 0.7s"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path fill="none" d="M0 0h24v24H0z"></path> <path fill-rule="nonzero" d="M21 3a1 1 0 0 1 1 1v7h-2V5H4v14h6v2H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h18zm0 10a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-6a1 1 0 0 1 1-1h8zm-1 2h-6v4h6v-4z"></path> </g> </g></svg>';

    // Attach click event to toggle color
    pipButton.addEventListener('click', togglePipColor);
  }
}