// This script runs in the background and listens for events.

chrome.runtime.onInstalled.addListener(() => {
  // Set the panel behavior to open when the action (extension icon) is clicked
  chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true })
    .catch((error) => console.error(error));
});