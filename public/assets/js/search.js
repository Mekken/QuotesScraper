$(document).ready(function() {
  $("#home").on("click", function() {
    window.location.href = "/";
  });

  $(".tag-btn").on('click', function() {
    let tagName = $(this).data("name");
    
    window.location.href = "/search/" + tagName;
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
    .catch(function() {
      console.log("unable to send data");
    });
  });
});