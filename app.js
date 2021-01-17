// Require modules
require('dotenv').config()
const mailChimp = require("@mailchimp/mailchimp_marketing");
const bodyParser = require("body-parser");
const express = require("express");
const request = require("request");
const https = require("https");

// Create express app
const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}))

const port = process.env.PORT || 3000;

// set app to listen on port 3000
app.listen(port, () => {
  console.log("Server is running on port " + port + ".");
});

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
});

// set up MailChimp
mailChimp.setConfig({
  apiKey: process.env.MAILCHIMP_API_KEY,
  server: "us17"
});

app.post("/", function(req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const listID = process.env.MAILCHIMP_LIST_ID;

  const subscribingUser = {
    firstName: firstName,
    lastName: lastName,
    email: email
  };

  // upload data to server
  async function run() {
    const response = await mailChimp.lists.addListMember(listID, {
      email_address: subscribingUser.email,
      status: "subscribed",
      merge_fields: {
        FNAME: subscribingUser.firstName,
        LNAME: subscribingUser.lastName
      }
    });

    res.sendFile(__dirname + "/success.html");
  }

  // run function, catch errors if any
  run().catch(function(e) {
    res.sendFile(__dirname + "/failure.html");
    console.log(e);
  });
});

app.post("/goBack", function(req, res) {
  res.redirect("/");
});
