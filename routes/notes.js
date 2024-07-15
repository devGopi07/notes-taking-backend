var express = require("express");
var router = express.Router();

const mongoose = require("mongoose");
const { dbUrl } = require("../common/dbConfig");
const { NoteModel } = require("../schemas/noteSchema");
mongoose.connect(dbUrl);

// POST Add A New Note
router.post("/addNote", async function (req, res) {
  try {
    let data = await NoteModel.create(req.body);
    res.status(200).send({ message: "Note Created Successfully", data });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

// GET ALL notes
router.post("/", async function (req, res, next) {
  try {
    // let data= await NoteModel.find({})
    let data = await NoteModel.find({ email: req.body.email });
    if (data) {
      res.status(200).send({ message: "All Notes Fetched Successfully", data });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

// GET A Note By ID
router.get("/getNote/:id", async function (req, res, next) {
  try {
    let data = await NoteModel.find({ _id: req.params.id });
    console.log(data);
    res.status(200).send({ message: "Note's Data Fetched Successfully", data });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

// PUT Update A Note
router.put("/updateNote/:id", async function (req, res, next) {
  try {
    let data = await NoteModel.findOneAndUpdate(
      { _id: req.params.id },
      req.body
    );
    console.log(data);
    res
      .status(200)
      .send({ message: "Updated Note's Data Fetched Successfully", data });
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

//DELETE A Note
router.delete("/deleteNote/:id", async function (req, res) {
  try {
    let user = await NoteModel.findOne({ _id: req.params.id });
    if (user) { 
      let title=user.title
      let data = await NoteModel.deleteOne({ _id: req.params.id });
      res.status(200).send({ message: `${title} Note Deleted Successfully`, data });
    }
  } catch (error) {
    res.status(500).send({ message: "Internal Server Error", error });
  }
});

module.exports = router;
