// background.js

// Function to save a clip to storage
function saveClip(text) {
  if (!text || text.trim().length === 0) {
    return;
  }
  chrome.storage.local.get({ clips: [] }, (result) => {
    let clips = result.clips;
    // Avoid saving duplicates
    if (clips[0] === text) {
      return;
    }
    clips.unshift(text);
    // Keep the list to a reasonable size (e.g., 100)
    if (clips.length > 100) {
      clips = clips.slice(0, 100);
    }
    chrome.storage.local.set({ clips });
  });
}

// Function to get the last saved clip
async function getLastClip() {
  return new Promise((resolve) => {
    chrome.storage.local.get({ clips: [] }, (result) => {
      if (result.clips && result.clips.length > 0) {
        resolve(result.clips[0]);
      } else {
        resolve(null);
      }
    });
  });
}

// This function is injected into the active tab to paste text
function pasteTextToActiveElement(text) {
    const activeEl = document.activeElement;
    if (activeEl) {
        if (activeEl.isContentEditable) {
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
            }
        } else if (activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'INPUT') {
            const start = activeEl.selectionStart;
            const end = activeEl.selectionEnd;
            const newText = activeEl.value.substring(0, start) + text + activeEl.value.substring(end);
            activeEl.value = newText;
            activeEl.selectionStart = activeEl.selectionEnd = start + text.length;
            activeEl.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
        }
    }
}

// Function to handle pasting the last clip
async function pasteLastClip(tabId) {
    const lastClip = await getLastClip();
    if (lastClip) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            func: pasteTextToActiveElement,
            args: [lastClip]
        });
    }
}

// On installation, create context menus
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "save-selection",
    title: "Save selection to ClipNotes",
    contexts: ["selection"]
  });

  chrome.contextMenus.create({
    id: "paste-last-clip",
    title: "Paste last clip",
    contexts: ["editable"]
  });
});

// Listener for context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "save-selection") {
    if (info.selectionText) {
      saveClip(info.selectionText);
    }
  } else if (info.menuItemId === "paste-last-clip") {
    pasteLastClip(tab.id);
  }
});

// Listener for keyboard shortcuts
chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "paste-last-clip") {
    pasteLastClip(tab.id);
  }
});

// Listener for messages from content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "saveClip") {
    if (request.text) {
      saveClip(request.text);
    }
  }
  // Keep the message channel open for async response
  return true;
});
