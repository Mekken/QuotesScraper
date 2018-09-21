const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const request = require("request");
const cheerio = require("cheerio");

// Require all models
var db = require("./models");
var PORT = process.env.PORT || 3000;
// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/quotefinderdb", { useNewUrlParser: true});

// ================= Routes ================= //

// -- Pages -- //
app.get("/",function(req, res) {
  //TODO: Render HomePage
  db.Quote.find({})
  .then(function(results) {
    results.test = "hello";
    res.render("index", { quotes: results });
  });
});

// -- Read -- //
app.get("/api/quotes", function(req, res) {
  db.Quote.find({})
  .then(function(quotes) {
      res.json(quotes).end();
  })
  .catch(function() {
      res.status(500).end();
  })
});

app.get("/api/quotes/:tag", function(req, res) {
  db.Quote.find({ tags: req.params.tag })
  .then(function(quotes) {
      res.json(quotes).end();
  })
  .catch(function() {
      res.status(500).end();
  })
});

app.get("/api/scrape", function(req, res) {
  request("http://quotes.toscrape.com/", function(err, resp, body) {
    const $ = cheerio.load(body);

    let results = [];

    $("div.quote").each(function(i,element) {
      let body = $(element).find("span.text").text();
      let author = $(element).find("small.author").text();
      let tags = [];
      $(element).find("a.tag").each(function(i, elem) {
        tags.push($(elem).text());
      });

      results.push({
        body: body,
        author: author,
        tags: tags
      });
    });

    db.Quote.create(results)
    .then(function() {
      res.json("quotes have been scraped").end();
    })
    .catch(function() {
      res.json(500).end();
    })
  });
});

// --- Create --- //
app.post("/api/comments/:articleId", function(res,req) {
  //TODO: Add Comment to Article Id
});

// --- Delete --- //
app.delete("/api/removeall", function(req, res) {
  //TODO: Remove all Articles
  db.Quote.remove({})
  .then(function() {
      res.json("removed all quotes").end();
  })
  .catch(function() {
      res.status(500).end();
  });
});

app.delete("/api/comments/:id", function(req, res) {
  //TODO: Delete a Comment
});

// ================= Routes END ================= //


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

