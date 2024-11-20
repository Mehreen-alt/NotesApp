const API_URL = "/notes";
let isEditMode = false;
let currentEditId = null;

// Fetch all notes
const fetchNotes = async () => {
  const response = await fetch(API_URL);
  const notes = await response.json();
  const notesContainer = document.getElementById("notes-container");
  notesContainer.innerHTML = "";
  notes.forEach((note) => {
    const noteDiv = document.createElement("div");
    noteDiv.className = "note";
    noteDiv.innerHTML = `
      <h3>${note.title}</h3>
      <p>${note.content}</p>
      <div class="note-buttons">
        <button class="delete" onclick="deleteNote('${note.id}')">
          <i class="fas fa-trash-alt"></i>
        </button>
        <button class="edit" onclick="editNote('${note.id}', '${note.title}', '${note.content}')">
          <i class="fas fa-edit"></i>
        </button>
      </div>
    `;
    notesContainer.appendChild(noteDiv);
  });
};


// Add or update a note
document.getElementById("note-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("note-title").value;
  const content = document.getElementById("note-content").value;

  if (isEditMode) {
    // Update note
    await fetch(`${API_URL}/${currentEditId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });

    // Reset form to default mode
    isEditMode = false;
    currentEditId = null;
    document.getElementById("note-form").querySelector("button").textContent =
      "Add Note";
  } else {
    // Add new note
    await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, content }),
    });
  }

  e.target.reset();
  fetchNotes();
});

// Delete a note
const deleteNote = async (id) => {
  await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  fetchNotes();
};

// Edit a note
const editNote = (id, title, content) => {
  document.getElementById("note-title").value = title;
  document.getElementById("note-content").value = content;

  // Set form to edit mode
  isEditMode = true;
  currentEditId = id;
  document.getElementById("note-form").querySelector("button").textContent =
    "Update Note";
};

// Initial fetch of all notes
fetchNotes();

// Dark Mode Toggle Functionality
const darkModeToggle = document.getElementById("dark-mode-toggle");

darkModeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Save the user's preference in local storage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("darkMode", "enabled");
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>'; // Change icon to moon in dark mode
  } else {
    localStorage.setItem("darkMode", "disabled");
    darkModeToggle.innerHTML = '<i class="fas fa-lightbulb"></i>'; // Change icon to lightbulb in light mode
  }
});

// Load user preference from local storage on page load
window.addEventListener("DOMContentLoaded", () => {
  const darkMode = localStorage.getItem("darkMode");
  if (darkMode === "enabled") {
    document.body.classList.add("dark-mode");
    darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
  } else {
    darkModeToggle.innerHTML = '<i class="fas fa-lightbulb"></i>';
  }
});
