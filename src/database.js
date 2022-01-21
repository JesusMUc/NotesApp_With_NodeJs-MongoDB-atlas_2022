const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://localhost:27017/notes-db-app", {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useFindAndModify: false
//   })
//   .then((db) => console.log("Db is connected"))
//   .catch((err) => console.error(err));

const user = "admin";
const password = "admin";
const dbase = "notes-db-app";
///////
//const url = `mongodb+srv://sample_user:<password>@my-sample-cluster-b3ugy.mongodb.net/<dbname>?retryWrites=true&w=majority`;
const url = `mongodb+srv://${user}:${password}@cluster0.ppnr5.mongodb.net/${dbase}?retryWrites=true&w=majority`;
const connectionParams = {
  useNewUrlParser: true,
  //useCreateIndex: true,
  useUnifiedTopology: true
};
mongoose
  .connect(url, connectionParams)
  .then(() => {
    console.log("Connected to database Todo chido ");
  })
  .catch((err) => {
    console.error(`Error connecting to the database. \n${err}`);
  });
