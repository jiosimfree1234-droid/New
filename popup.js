// popup.js

document.addEventListener('DOMContentLoaded', () => {
  const clipsContainer = document.getElementById('clips-container');
  const searchBar = document.getElementById('search-bar');

  // Function to render clips
  const renderClips = (clips) => {
    clipsContainer.innerHTML = '';
    const limitedClips = clips.slice(0, 10); // Show only the 10 most recent clips
    limitedClips.forEach((clipText, index) => {
      const clipElement = document.createElement('div');
      clipElement.className = 'clip';

      const textElement = document.createElement('span');
      textElement.className = 'clip-text';
      textElement.textContent = clipText;
      clipElement.appendChild(textElement);

      const actionsElement = document.createElement('div');
      actionsElement.className = 'clip-actions';

      const copyButton = document.createElement('button');
      copyButton.textContent = 'Copy';
      copyButton.addEventListener('click', () => {
        navigator.clipboard.writeText(clipText).then(() => {
          // Maybe show a success message
          copyButton.textContent = 'Copied!';
          setTimeout(() => {
            copyButton.textContent = 'Copy';
          }, 1000);
        });
      });
      actionsElement.appendChild(copyButton);

      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'Delete';
      deleteButton.className = 'delete-btn';
      deleteButton.addEventListener('click', () => {
        deleteClip(index);
      });
      actionsElement.appendChild(deleteButton);

      clipElement.appendChild(actionsElement);
      clipsContainer.appendChild(clipElement);
    });
  };

  // Function to load clips from storage
  const loadClips = () => {
    chrome.storage.local.get({ clips: [] }, (result) => {
      renderClips(result.clips);
    });
  };

  // Function to delete a clip
  const deleteClip = (indexToDelete) => {
    chrome.storage.local.get({ clips: [] }, (result) => {
      let clips = result.clips;
      clips.splice(indexToDelete, 1);
      chrome.storage.local.set({ clips }, () => {
        loadClips();
      });
    });
  };

  // Search functionality
  searchBar.addEventListener('input', (e) => {
    const searchText = e.target.value.toLowerCase();
    chrome.storage.local.get({ clips: [] }, (result) => {
      const filteredClips = result.clips.filter(clip => clip.toLowerCase().includes(searchText));
      renderClips(filteredClips);
    });
  });

  // Initial load of clips
  loadClips();
});
