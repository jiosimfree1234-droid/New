document.addEventListener('DOMContentLoaded', () => {
  const saveButton = document.getElementById('save-button');
  const noteInput = document.getElementById('note-input');
  const notesList = document.getElementById('notes-list');

  const loadNotes = () => {
    chrome.storage.sync.get({ notes: [] }, (data) => {
      notesList.innerHTML = '';
      data.notes.forEach((note) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          <strong>${note.title}</strong>
          <p>${note.note}</p>
          <a href="${note.url}" target="_blank">${note.url}</a>
          <button class="delete-button" data-id="${note.id}">Delete</button>
        `;
        notesList.appendChild(listItem);
      });
    });
  };

  const deleteNote = (id) => {
    chrome.storage.sync.get({ notes: [] }, (data) => {
      const notes = data.notes.filter((note) => note.id !== id);
      chrome.storage.sync.set({ notes: notes }, () => {
        loadNotes();
      });
    });
  };

  saveButton.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tab = tabs[0];
      const note = {
        id: new Date().getTime(),
        url: tab.url,
        title: tab.title,
        note: noteInput.value,
      };

      chrome.storage.sync.get({ notes: [] }, (data) => {
        const notes = data.notes;
        notes.push(note);
        chrome.storage.sync.set({ notes: notes }, () => {
          noteInput.value = '';
          loadNotes();
        });
      });
    });
  });

  notesList.addEventListener('click', (e) => {
    if (e.target.classList.contains('delete-button')) {
      const noteId = Number(e.target.getAttribute('data-id'));
      deleteNote(noteId);
    }
  });

  loadNotes();
});
