const mongoose = require("mongoose");
const dotenv = require("dotenv");
const fs = require("fs");
const Tour = require("../../models/tourModel");
const Review = require("../../models/reviewModel");
const User = require("../../models/userModel");

dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connection success");
  });

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, "utf-8"));
const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, "utf-8"));
const reviews = JSON.parse(
  fs.readFileSync(`${__dirname}/reviews.json`, "utf-8")
);

const importData = async () => {
  try {
    await User.create(users, { validateBeforeSave: false });
    await Review.create(reviews);
    await Tour.create(tours);
    // await tours.forEach((a) => Tour.create(a));
    // await reviews.forEach((a) => Review.create(a));
    // await users.forEach((a) => User.create(a, { validateBeforeSave: false }));
    //await Tour.create(tours);
    console.log("Data successfully loaded");
    process.exit();
  } catch (err) {
    console.log(err);
  }
};

const deleteAll = async () => {
  try {
    //await Tour.deleteMany();
    // await User.deleteMany();
    await Review.deleteMany();
    console.log("Data successfully deleted");
  } catch (err) {
    console.log(err.message);
  }
  process.exit();
};

if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteAll();
}

console.log(process.argv);
