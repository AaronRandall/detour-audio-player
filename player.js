function queryItunes(element, callback, query) {
  $.ajax({
    url:"https://itunes.apple.com/search?term=" + query + "&entity=song",
    dataType: 'jsonp',
    success:function(json){
      return callback(element,json, query);
    },
    error:function(){
        alert("Error");
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
      //audioElement.load()
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




$(document).ready(function() {

  // Create play pause buttons for each listing
  $(".campaign-info").each(function( index ) { 
    $(this).prepend("<div class='play'>PLAY</div>");
    $(this).prepend("<div class='pause'>PAUSE</div>");

    // Search iTunes preview api for the first track by the artist
      $.ajax({
           url:"https://itunes.apple.com/search?term=INXS&entity=song",
           dataType: 'jsonp',
           success:function(json){
              previewUrl = json["results"][0]["previewUrl"];
              console.log('***' + previewUrl);
              // Create an audio element for this preview track
              var audioElement = document.createElement('audio');
              audioElement.setAttribute('src', 'http://a1540.phobos.apple.com/us/r1000/067/Music/3e/cc/7c/mzm.jxvlxboi.aac.p.m4a');
              //audioElement.load()
              $.get();
              audioElement.addEventListener("load", function() {
              audioElement.play();
              }, true);

              console.log('** setting up pause play buttons');
              // Enable play/pause buttons
              $(this).find('.play').click(function() {
                console.log('play clicked');
                audioElement.play();
              });
              $(this).find('.pause').click(function() {
                console.log('pause clicked');
                audioElement.pause();
              });
              console.log('** DONE setting up pause play buttons');
           },
           error:function(){
              console.log("Error");
           },
      });
  }); 
});

