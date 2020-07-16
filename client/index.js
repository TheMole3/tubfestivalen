function shuffleArray(array) {for (var i = array.length - 1; i > 0; i--) {var j = Math.floor(Math.random() * (i + 1));var temp = array[i];array[i] = array[j];  array[j] = temp;};return array;}

/* Bidrag */

if(localStorage.voted) {
  window.location.href = '/results';
}

var bidragsArray = []
$.getJSON( "/bidrag.json", function( data ) {
  bidragsArray = shuffleArray(data);
  var itemsProcessed = 0;
  bidragsArray.forEach((item, i) => {
    addBidrag(item)
  });
})  .fail(function() {
  alert('Något gick fel vid laddningen av bidragen.  Testa att ladda om sidan, om felet kvarstår skicka ett mail till hugo@themole.tk')
})

$('body').on("click", '.playButton', function() {
  var audioplayer = document.getElementById($(this).data('bidrag') + "Player");
  if (audioplayer.paused) {
     audioplayer.play();
     $(this).addClass('paused');
  }
  else {
     audioplayer.pause();
     $(this).removeClass('paused');
  }
})

new SimpleBar($('#bidragsList')[0], {
  autoHide: false,
});

var bidragsProcessed = 0;
function addBidrag(bidrag) {
  bidragsProcessed++
  bidrag.object = $(`
    <li class="bidrag">
      <img class="thumb" src="${bidrag.thumb}">
      <button data-bidrag="${bidrag.nameDefine}" class='playButton'></button>
      <span class="SongInfo">${bidrag.name}<br><div class="artist">${bidrag.artist}</div></span>
      <button data-bidrag="${bidrag.nameDefine}" onclick="vote(this)" class=voteButton>Rösta</button>
      <audio preload="none" id="${bidrag.nameDefine}Player">
        <source src="${bidrag.audio}" type="audio/mp3" />
      </audio>
    </li>
  `).appendTo('.simplebar-content')

  if(localStorage.voted) {
    $('.voteButton').prop( "disabled", true ).addClass('DeVoteButton').removeClass('voteButton')
  }
  if(bidragsProcessed === bidragsArray.length) {setTimeout(function() {$('#loading').fadeOut('fast')},2000)}
}


function vote(e) {
  var name = bidragsArray.find(function(element) {
    return element.nameDefine == $(e).data('bidrag');
  }).name
  if(confirm('Vill du rösta på ' + name+ '? \nDu kan inte ändra din röst senare!')) {
    $.get('/vote', {vote: $(e).data('bidrag')}, function(e) {
      if(e == 'country') return alert('Tyvärr kan man bara rösta om man är i Sverige')
    	if(e == 'voted') alert('Du har redan röstat!')
      localStorage.voted = true
      $('.voteButton').prop( "disabled", true ).addClass('DeVoteButton').removeClass('voteButton')
      window.location.href = '/results';
    })
  }
}



/* Floating Images */
var imgArray = [
  {
    src: "/img/bullertrans.png",
    name: "buller"
  },
  {
    src:"/img/graytrans.png",
    name: "gray"
  },
  {
    src:"/img/globbytrans.png",
    name: "globby"
  },
  {
    src:"/img/kladdtrans.png",
    name: "kladd"
  },
  {
    src:"/img/globbytrans2.png",
    name: "globby2"
  },
  {
    src:"/img/graytrans2.png",
    name: "gray2"
  },  {
    src:"/img/bullertrans2.png",
    name: "buller2"
  },
  {
    src:"/img/kladdtrans2.png",
    name: "kladd2"
  }
]

imgArray.forEach((item, i) => {
  item.object = $(`<img class="floater" src="${item.src}">`).appendTo('#backgroundFloaters')

  var width = Math.random()*30 + 10
  var left = (Math.random()*$('#backgroundFloaters').width()) - width
  var top = (Math.random()*$('#backgroundFloaters').height()) - item.object.height()
  var zIndex = Math.floor(Math.random()*5)
  item.object.css('left', left);
  item.object.css('top', top);
  item.object.css('width', 0);
  item.object.css('z-index', zIndex);

  floatImage(item.object)
});

function floatImage(object) {
  var width = Math.random()*30 + 10
  var left = (Math.random()*$('#backgroundFloaters').width()) - width
  var top = (Math.random()*$('#backgroundFloaters').height()) - object.height()
  var duration = Math.random()*20000+5000
  var zIndex = Math.floor(Math.random()*5)

  object.css('z-index', zIndex);
  object.animate({
    left: left,
    top: top,
    width: width + 'vw',
  }, {
    duration: duration,
    easing: 'swing',
    complete: function() {
      floatImage(object)
    }
  })
}
