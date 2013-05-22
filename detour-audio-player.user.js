// ==UserScript==
// @match https://detour.songkick.com/
// @match https://detour.songkick.com/discover
// @match https://detour.songkick.com/leaderboard
// @match https://detour.songkick.com/search*
// ==/UserScript==

// Load jQuery
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

  // Available providers: "Deezer", "iTunes"
  var audioProvider = "Deezer";

  function queryItunes(element, callback, query) {
    $.ajax({
      url:"https://itunes.apple.com/search?term=" + query + "&entity=song",
      dataType: 'jsonp',
      success:function(json){
        previewUrl = '';
        try {
          previewUrl = json["results"][0]["previewUrl"];
        } catch (e) {
          console.log('Could not find preview track for query: ' + query);
          return;
        }

        return callback(element, previewUrl, query);
      },
      error:function(){
        console.log("Error for query:" + query);
      },
    });
  }

  function queryDeezer(element, callback, query) {
    DZ.api('/search?q=' + query, function(response){
      previewUrl = '';
      previewUrl = response['data'][0]['preview'];
      return callback(element, previewUrl, query);
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
    // Prepend the required div for the Deezer JavaScript API
    $('body').prepend('<div id="dz-root"></div>');

    // Load the Deezer JavaScript API from an SSL connection
    $.getScript("https://raw.github.com/AaronRandall/detour-audio-player/master/dz.js", function(data, textStatus, jqxhr) {

      // For each campaign on the page
      $(".campaign-info").each(function( index ) {
        // Define the callback, which is responsible for creating an audio overlay
        var callback = function(element, previewUrl, query) {
          var artistImage  = element.parent().find('.list-image');
          var audioElement = createAudioElementForUrl(previewUrl);
          var audioOverlay = createOverlayWithAudioElement(audioElement);
          addAudioOverlayToArtistImage(artistImage, audioOverlay);
        };

        // Find the artist for the current campaign
        var artistName = $(this).find('a:first').text();

        // Query the selected audio provider service
        switch(audioProvider)
        {
          case "iTunes":
            queryItunes($(this), callback, artistName);
            break;
          case "Deezer":
            queryDeezer($(this), callback, artistName);
            break;
        }
      });

    });
  });
}

// Load jQuery and execute the main function
addJQuery(main);
