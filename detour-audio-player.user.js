// ==UserScript==
// @match https://detour.songkick.com/
// @match https://detour.songkick.com/discover
// @match https://detour.songkick.com/leaderboard
// @match https://detour.songkick.com/search*
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

  function createAudioElementForUrl(url) {
    var audioElement = document.createElement('audio');
    audioElement.setAttribute('src', url);
    $.get();
    audioElement.addEventListener("load", function() {
      audioElement.play();
    }, true);
    
    return audioElement;
  }

  function createOverlayWithAudioElement(audioElement) {
    var overlay = $(["<div class='overlay' style='display:none;background-color:black;",
                     "opacity:0.7;color:white;height:100%;width:100%;position:absolute;",
                     "padding-top:44px;font-size:40px;text-align:center;cursor:pointer;'>",
                     "<span>Play</span>",
                     "</div>"].join(''));

    overlay.click(function() {
      overlaySpan = overlay.find('span');

      if (audioElement.paused == false) {
        audioElement.pause();
        overlaySpan.animate({'opacity': 0}, 100, function () {
          overlaySpan.text('Play');
        }).animate({'opacity': 1}, 100);
      } else {
        audioElement.play();
        overlaySpan.animate({'opacity': 0}, 100, function () {
          overlaySpan.text('Pause');
        }).animate({'opacity': 1}, 100);
      }
    });

    return overlay;
  }

  function addAudioOverlayToArtistImage(artistImage, overlay) {
    artistImage.prepend(overlay);

    artistImage.hover(function() {
        artistImage.find('.overlay').stop().fadeIn('fast');
      }, function() {
        artistImage.find('.overlay').stop().fadeOut('fast');
    });

    return artistImage;
  }

  $(document).ready(function() {
    $(".campaign-info").each(function( index ) {
      var callback = function(element, json, query) {
        previewUrl = '';
        try {
          previewUrl = json["results"][0]["previewUrl"];
        } catch (e) {
          console.log('Could not find preview track for query: ' + query);
          return;
        }

        var artistImage  = element.parent().find('.list-image');
        var audioElement = createAudioElementForUrl(previewUrl);
        var audioOverlay = createOverlayWithAudioElement(audioElement);
        addAudioOverlayToArtistImage(artistImage, audioOverlay);
      };

      var artistName = $(this).find('a:first').text();
      queryItunes($(this), callback, artistName);
    });
  });
}

// Load jQuery and execute the main function
addJQuery(main);
