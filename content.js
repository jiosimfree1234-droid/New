// content.js

document.addEventListener('copy', () => {
  const selectedText = window.getSelection().toString();
  if (selectedText && selectedText.trim().length > 0) {
    chrome.runtime.sendMessage({
      action: "saveClip",
      text: selectedText
    });
  }
});
