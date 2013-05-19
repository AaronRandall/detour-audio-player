// ==UserScript==
// @match https://detour-ldn.songkick.com/*
// ==/UserScript==

// a function that loads jQuery and calls a callback function when jQuery has finished loading
function addJQuery(callback) {
  var script = document.createElement("script");
  script.setAttribute("src", "//ajax.googleapis.com/ajax/libs/jquery/1/jquery.min.js");
  script.addEventListener('load', function() {
    var script = document.createElement("script");
    script.textContent = "window.jQ=jQuery.noConflict(true);(" + callback.toString() + ")();";
    document.body.appendChild(script);
  }, false);
  document.body.appendChild(script);
}

function main() {
  function queryItunes(element, callback, query) {
    $.ajax({
      url:"https://itunes.apple.com/search?term=" + query + "&entity=song",
      dataType: 'jsonp',
      success:function(json){
        return callback(element,json, query);
      },
      error:function(){
        console.log("Error for query:" + query);
      },
    });
  }

  $(document).ready(function() {
    $(".campaign-info").each(function( index ) {
      var callback = function(element, json, query) {
        previewUrl = '';
        try {
          previewUrl = json["results"][0]["previewUrl"];
        } catch (e) {
          console.log('Could not find preview track for query=' + query);
          return;
        }

        console.log("in callback with json=" + previewUrl + ' and element' + element);

        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', previewUrl);
        $.get();
        audioElement.addEventListener("load", function() {
          audioElement.play();
        }, true);

        var overlay = $("<div class='overlay' style='display:none;background-color:black;opacity:0.7;color:white;height:100%;width:100%;position:absolute;padding-top:44px;font-size:40px;text-align:center;cursor:pointer;'><span>Play</span></div>");
        overlay.click(function() {
          if (audioElement.paused == false) {
              audioElement.pause();
              overlaySpan = overlay.find('span');
              overlaySpan.animate({'opacity': 0}, 100, function () {
                overlaySpan.text('Play');
              }).animate({'opacity': 1}, 100);
            } else {
              audioElement.play();
              overlaySpan = overlay.find('span');
              overlaySpan.animate({'opacity': 0}, 100, function () {
                overlaySpan.text('Pause');
              }).animate({'opacity': 1}, 100);
          }
        });


        var image = element.parent().find('.list-image')
        image.prepend(overlay);

        image.hover(function() {
            image.find('.overlay').stop().fadeIn('fast');
          }, function() {
            image.find('.overlay').stop().fadeOut('fast');
          });

      };

      var artistName = $(this).find('a').text();
      
      // Query iTunes for the current artist name
      queryItunes($(this), callback, artistName);
    });
  });

}

// load jQuery and execute the main function
addJQuery(main);
