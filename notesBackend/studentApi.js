const express = require("express");
require("./api/db/connection");
const Student = require("./api/models/students");
const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.post("/students", function (req, res) {
  console.log(req.body);
  const user = new Student(req.body);
  user
    .save()
    .then(() => {
      res.status(201).send(user);
    })
    .catch((e) => {
      res.status(400).send(e);
    });
});

app.listen(port, () => {
  console.log(`server running in ${port}`);
});
