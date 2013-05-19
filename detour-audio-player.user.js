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

// the guts of this userscript
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
        element.prepend("<div class='play'>PLAY</div>");
        element.prepend("<div class='pause'>PAUSE</div>");

        var audioElement = document.createElement('audio');
        audioElement.setAttribute('src', previewUrl);
        $.get();
        audioElement.addEventListener("load", function() {
          audioElement.play();
        }, true);

        // Enable play/pause buttons
        element.find('.play').click(function() {
          audioElement.play();
        });
        element.find('.pause').click(function() {
          audioElement.pause();
        });
      };

      var artistName = $(this).find('a').text();

      queryItunes($(this), callback, artistName);
    });
  });

}

// load jQuery and execute the main function
addJQuery(main);
