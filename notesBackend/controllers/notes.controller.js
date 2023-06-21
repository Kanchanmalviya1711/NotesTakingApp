const allNotes = require("../model/allNotes/Notes");
const createError = require("http-errors");
const { default: mongoose } = require("mongoose");

module.exports = {
  getAllNotes: async (req, res, next) => {
    try {
      const results = await allNotes
        .find({}, { __v: 0 })
        .sort({ updatedAt: -1 });

      res.status(200).json({ success: true, notes: results });
    } catch (error) {
      console.error(error.message);
      next(new Error("Unable to get notes"));
    }
  },

  getOneNote: async (req, res, next) => {
    const id = req?.params?.id;
    try {
      // Find the note with the specified id using the `findById` method of the `allNotes` model.
      const results = await allNotes.findById(id, { __v: 0 });
      // Check if results is null or undefined. If so, throw a 404 error.
      if (!results) {
        throw createError(404, "Note does not exist.");
      }
      // If results is not null or undefined, send it back to the client.
      res.send(results);
    } catch (error) {
      console.log(error.message, "list note error");
      // Check if the error is a `CastError` thrown by Mongoose when the id is not a valid ObjectId.
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Note Id"));
        return;
      }
      // If the error is not a `CastError`, pass it on to the next error handler.
      next(error);
    }
  },

  addNote: async (req, res, next) => {
    try {
      const createnote = new allNotes(req.body);
      const result = await createnote.save();
      if (result) {
        res
          .status(201)
          .json({ success: true, message: "Note Created Successfully" });
      } else {
        res.status(500).json({ error: "Failed to create a note" });
      }
    } catch (error) {
      console.error(error.message, "post error");
      if (error.name === "ValidationError") {
        next(createError(422, error.message));
        return;
      }
      next(error);
    }
  },

  updateNote: async (req, res, next) => {
    const id = req.params.id;
    const update = req.body;
    const options = { new: true };
    try {
      const result = await allNotes.findByIdAndUpdate(id, update, options);
      if (result) {
        res
          .status(200)
          .json({ success: true, message: "Note Update Successfully" });
      } else if (!result) {
        throw createError(404, "Note does not exist.");
      } else {
        res.status(500).json({ error: "Failed to update note" });
      }
    } catch (error) {
      console.error(error.message, "update error");
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Note Id"));
        return;
      }
      next(error);
    }
  },

  deleteNote: async (req, res, next) => {
    const id = req.params.id;
    try {
      const result = await allNotes.findByIdAndDelete(id);
      if (result) {
        res
          .status(200)
          .json({ success: true, message: "Note Deleted Successfully" });
      } else if (!result) {
        throw createError(404, "Note does not exist.");
      } else {
        res.status(500).json({ error: "Failed to delete note" });
      }
    } catch (error) {
      console.error(error.message, "delete error");
      if (error instanceof mongoose.CastError) {
        next(createError(400, "Invalid Note Id"));
        return;
      }
      next(error);
    }
  },
};
