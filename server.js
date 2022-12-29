const mongoose = require("mongoose");
const dotenv = require("dotenv");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION");
  console.log(err.name, err.message, err);
  process.exit(1);
});

dotenv.config({ path: "./config.env" });
const app = require("./app");
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

const port = 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//test

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION");
  console.log(err.name, err.message, err);
  server.close(() => {
    process.exit(1);
  });
});
