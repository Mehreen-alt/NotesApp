// Import required modules
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const fs = require("fs");

// Initialize Express
const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static("Public"));

// Path to store notes
const path = "./notes.json";

// Function to load notes from the file
const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync(path);
    const dataJSON = dataBuffer.toString();
    return JSON.parse(dataJSON);
  } catch (error) {
    return [];
  }
};

// Function to save notes to the file
const saveNotes = (notes) => {
  const dataJSON = JSON.stringify(notes, null, 2);
  fs.writeFileSync(path, dataJSON);
};

// Load notes initially
let notes = loadNotes();

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

// Add a simple GET route for the root path
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/Public/index.html");
});

// POST endpoint to create a new note
app.post("/notes", (req, res) => {
  const note = {
    id: uuidv4(),
    title: req.body.title,
    content: req.body.content,
  };
  notes.push(note);
  saveNotes(notes); // Save notes after adding a new one
  res.status(201).json(note);
});

// GET endpoint to retrieve all notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// Update a note by ID
app.put("/notes/:id", (req, res) => {
  const id = req.params.id;
  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      ...req.body,
    };
    saveNotes(notes);
    res.json(notes[noteIndex]);
  } else {
    res.status(404).send("Note not found");
  }
});

// Delete a note by ID
app.delete("/notes/:id", (req, res) => {
  const id = req.params.id;
  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex !== -1) {
    notes.splice(noteIndex, 1);
    saveNotes(notes);
    res.status(204).send();
  } else {
    res.status(404).send("Note not found");
  }
});
