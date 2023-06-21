const express = require("express");
const router = express.Router();
const NotesController = require("../../controllers/notes.controller");

//get Notes =>GET
router.get("/", NotesController.getAllNotes);

//get Notes =>GET single note
router.get("/:id", NotesController.getOneNote);

// post Notes => POST NOTES
router.post("/", NotesController.addNote);

// put Notes => UPDATE NOTES
router.put("/:id", NotesController.updateNote);

// delete Notes => DELETE NOTES
router.delete("/:id", NotesController.deleteNote);

module.exports = router;
