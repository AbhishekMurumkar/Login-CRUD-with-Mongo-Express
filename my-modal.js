const mongoose = require("mongoose");
const mongodb_url = require("./dbconfig.json").connect_url;
const myoptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
};

mongoose
  .connect(mongodb_url, myoptions)
  .then(() => {
    console.log("Connected to Prahem-Project database");
  })
  .catch((err) => {
    console.log(`unable to connect to database ${err}`);
  });

const orderSchema = mongoose.Schema({
  username: String,
  useremail: String,
  mobile: Number,
  password: String,
  created_date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Users", orderSchema);
