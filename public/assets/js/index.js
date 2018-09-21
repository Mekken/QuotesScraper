$(document).ready(function() {
  $("#getQuotes").on("click", function() {

    $.ajax("/api/scrape", {
      type: "GET"
    })
    .then(function() {
      console.log("Retrieving Inspiration Quotes Successful");
      location.reload();
    })
  });

  $("#delQuotes").on("click", function() {

    $.ajax("/api/quotes", {
      type: "DELETE"
    })
    .then(function() {
      console.log("Deleting Inspiration Quotes Successful");
      location.reload();
    })
  });

  $(".tag-btn").on("click", function(ev) {
    ev.stopPropagation();
    let tagName = $(this).data("name");

    window.location.href = "/quotes/" + tagName;
  })

  $(".comment-section").on("submit", function(ev) {
    ev.preventDefault();

    let id = $(this).closest(".quote-section").data("id");
    let author = $(this).find(".comment-author").val();
    let body = $(this).find(".comment-text").val();

    let data = {
      author: author,
      body: body
    } 

    $.ajax("/api/comments/" + id, {
      type: "POST",
      data: data
    })
    .then(function() {
      console.log("successfully created new comment");
      location.reload();
    })
    .fail(function() {
      console.log("unable to send data");
    });
  });
});