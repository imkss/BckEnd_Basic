const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const { default: mongoose } = require("mongoose");
const date = require(__dirname + "/date.js");

console.log(date());
const app = express();
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");

// This part will be handled in Database Now

// let items = ["Eat, Sleep, Code & Repeat"];
// let workItems = [];

mongoose.connect(
  // mongodb+srv://CloudDB:<password>@clouddb.zifbwxd.mongodb.net/?retryWrites=true&w=majority

  "mongodb+srv://CloudDB:kisu123@clouddb.zifbwxd.mongodb.net/todolistDB",
  {
    useNewUrlParser: true,
  }
);

const itemsSchema = {
  name: String,
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Eat, sleep, code  and repeat",
});

const defaultItems = [item1];

const listSchema = {
  name: String,
  items: [itemsSchema],
};

const List = mongoose.model("List", listSchema);

let day = date();

app.get("/", function (req, res) {
  Item.find({}, function (err, foundItems) {
    // console.log(foundItems);

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Sucessfully saved default items to DB");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: "Today", newListItems: foundItems });
      // dateNow : day, will be added to upr me
    }
  });
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        //Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        res.redirect("/" + customListName);
      } else {
        // Show the existing list
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    }
  });
});

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName,
  });

  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }, function (err, foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName == "Today") {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (!err) {
        console.log("Sucessfully removerd the items from DB");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkedItemId } } },
      function (err, foundList) {
        if (!err) {
          res.redirect("/" + listName);
        }
      }
    );
    // res.redirect("/" + listName);
  }
});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.listen(4000, function () {
  console.log("Server is running on port 4000");
});

// CloudDB
// Kisu123

// mongosh "mongodb+srv://clouddb.zifbwxd.mongodb.net/myFirstDatabase" --apiVersion 1 --username CloudDB : TO GET CONNECTED FROM TERMINAL

// mongodb+srv://CloudDB:<password>@clouddb.zifbwxd.mongodb.net/?retryWrites=true&w=majority
