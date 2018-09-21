const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const logger = require("morgan");
const request = require("request");
const cheerio = require("cheerio");

// Require all models
var db = require("./models");
var PORT = process.env.PORT || 3000;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/quotefinderdb";
// Initialize Express
var app = express();

// Configure middleware
// Use morgan logger for logging requests
app.use(logger("dev"));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
app.use(bodyParser.json())

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Set Handlebars.
var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Connect to the Mongo DB
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

// ================= Routes ================= //

// -- Pages -- //
app.get("/",function(req, res) {
  db.Quote.find({})
  .then(function(results) {
    results.test = "hello";
    res.render("index", { quotes: results });
  })
  .catch(function(err) {
    res.status(500);
    res.json(err).end();
  });
});

// -- Read -- //
app.get("/api/quotes", function(req, res) {
  db.Quote.find({})
  .then(function(quotes) {
      res.json(quotes).end();
  })
  .catch(function() {
    res.status(500);
    res.json(err).end();
  })
});

app.get("/api/popquotes", function(req, res) {
  db.Quote.find({})
    .populate("comments")
    .then(function(quotes) {
      res.json(quotes);
    })
    .catch(function(err) {
      res.status(500);
      res.json(err).end();
    });
});

app.get("/api/quotes/:id", function(req, res) {
  db.Quote.find({ _id: req.params.id })
    .then(function(quote) {
      res.json(quote).end();
    })
    .catch(function(err) {
      res.status(500);
      res.json(err).end();
    });
});

app.get("/api/quotes/:tag", function(req, res) {
  db.Quote.find({ tags: req.params.tag })
  .then(function(quotes) {
      res.json(quotes).end();
  })
  .catch(function() {
    res.status(500);
    res.json(err).end();
  })
});

app.get("/api/comments", function(req, res) {
  db.Comment.find({})
    .then(function(comments) {
      res.json(comments)
      res.status(200).end();
    })
    .catch(function(err) {
      res.status(500);
      res.json(err).end();
    });
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
      res.status(500);
      res.json(err).end();
    })
  });
});

// --- Create --- //
app.post("/api/comments/:quoteid", function(req, res) {
  db.Comment.create(req.body)
    .then(function(dbComment) {
      db.Quote.findOneAndUpdate({ _id: req.params.quoteid }, { $push: { comments: dbComment._id } }, { new: true })
        .then(function(dbQuote) {
          res.json(dbQuote);
        })
        .catch(function(err) {
          res.status(500);
          res.json(err).end();
        });
    })
    .catch(function(err) {
      res.status(500);
      res.json(err).end();
    });
});

// --- Delete --- //
app.delete("/api/quotes", function(req, res) {
  db.Quote.remove({})
  .then(function() {
      res.json("removed all quotes").end();
  })
  .catch(function() {
    res.status(500);
    res.json(err).end();
  });
});

app.delete("/api/comments", function(req, res) {
  db.Comment.remove({})
    .then(function() {
      res.json("removed all comments").end();
    })
    .catch(function(err) {
      res.status(500);
      res.json(err).end();
    });
});

app.delete("/api/comments/:id", function(req, res) {
  db.Comment.remove({ _id: req.params.id })
    .then(function() {
      res.json("comment removed").end();
    })
    .catch(function(err) {
      res.status(500);
      res.json(err).end();
    });
});

// ================= Routes END ================= //


// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

