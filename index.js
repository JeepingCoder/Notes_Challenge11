const PORT = process.env.PORT || 3001;
const express = require("express");
const path = require("path");
const fs = require("fs");
const { nanoid } = require("nanoid");

const app = express();

app.use(express.json());
app.use(
  express.static(path.join(__dirname, "public"), {
    extensions: ["html"],
  })
);

app.get("/notes", (req, res) => {
  res.render("notes.html");
});

app.get("/api/notes", (req, res) => {
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log("error!!");
    } else {
      const db = JSON.parse(data);
      res.json(db);
    }
  });
});

app.post("/api/notes", (req, res) => {
  console.log(req.body);
  let newNote = req.body;
  newNote.id = nanoid(10);
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log("error!!");
    } else {
      const db = JSON.parse(data);
      db.push(newNote);
      fs.writeFile("./db/db.json", JSON.stringify(db), (err) => {
        if (err) {
          console.log("error again");
        } else {
          console.log("saved");
        }
      });
    }
  });
  res.end();
});

app.delete("/api/notes/:id", (req, res) => {
  console.log("ID parameter", req.params.id);
  fs.readFile("./db/db.json", "utf-8", (err, data) => {
    if (err) {
      console.log("error!!");
    } else {
      const db = JSON.parse(data);
      const filterArray = db.filter((item) => {
        return item.id !== req.params.id
      });

      fs.writeFile("./db/db.json", JSON.stringify(filterArray), (err) => {
        if (err) {
          console.log("error again");
        } else {
          console.log("deleted");
        } 
      });
    }
  });
  res.end();
});

app.get("*", (req, res)=> {
res.render("index.html")
})
 
app.listen(PORT, () => {
  console.log("App Listening on port ${ PORT }")
});