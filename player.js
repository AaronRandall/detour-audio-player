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
