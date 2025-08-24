$(document).ready(function () {
  // Ensure there's an aria-live region in the DOM
  if ($("#aria-live-region").length === 0) {
    $("body").append('<div id="aria-live-region" aria-live="polite" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;"></div>');
  }

  $("body").on("click", ".btn", function () {
    var $box = $(this).next(".box");
    $(".box").not($box).slideUp(500);

    $box.slideToggle(500, function () {
      var isVisible = $box.is(":visible");
      var message = isVisible ? "Content expanded" : "Content collapsed";
      $("#aria-live-region").text(message);
    });
  });
});
$("#aria-live-region").attr("aria-live", "assertive");

function announceMessage(message) {
  var $announceDiv = $('<div aria-live="assertive" style="position:absolute;left:-9999px;top:auto;width:1px;height:1px;overflow:hidden;"></div>');
  $announceDiv.text(message);
  $("body").append($announceDiv);
  setTimeout(function () {
    $announceDiv.remove();
  }, 1000);
}