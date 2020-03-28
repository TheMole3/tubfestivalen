/* Bidrag */
var bidragsArray = [
  {
    thumb: "/bidrag/rullaRunt.jpg",
    name: "RULLA RUNT",
    artist: "Buller ft. GLOBBY, GRAYUBOI, KLADD",
    audio: "/bidrag/rullaRunt.mp3",
    nameDefine: "rullaRunt"
  },  {
    thumb: "/bidrag/gbg.jpg",
    name: "GBG",
    artist: "Buller",
    audio: "/bidrag/gbg.mp3",
    nameDefine: "GBG"
  },  {
    thumb: "/bidrag/IdontLikeYou.jpg",
    name: "I DON'T LIKE YOU",
    artist: "Buller ft. Anomaly, Teryos, GLOBBY, GRAY",
    audio: "/bidrag/IdontLikeYou.mp3",
    nameDefine: "IdontLikeYou"
  },  {
    thumb: "/bidrag/christianVirgin.jpg",
    name: "CHRISTIAN VIRGIN",
    artist: "GRAYUBOI feat. buller, GLOBBY, Kladd",
    audio: "/bidrag/christianVirgin.mp3",
    nameDefine: "christianVirgin"
  }
]

bidragsArray.forEach((item, i) => {
  addBidrag(item)
});

new SimpleBar($('#bidragsList')[0], {
  autoHide: false,
});

function addBidrag(bidrag) {
  bidrag.object = $(`
    <li class="bidrag">
      <img class="thumb" src="${bidrag.thumb}">
      <button data-bidrag="${bidrag.nameDefine}" class='playButton'></button>
      <span class="SongInfo">${bidrag.name}<br><div class="artist">${bidrag.artist}</div></span>
      <button data-bidrag="${bidrag.nameDefine}" onclick="vote(this)" class=voteButton>Rösta</button>
      <audio id="${bidrag.nameDefine}Player">
        <source src="${bidrag.audio}" type="audio/mp3" />
      </audio>
    </li>
  `).appendTo('#bidragsList')

  if(localStorage.voted) {
    $('.voteButton').prop( "disabled", true ).addClass('DeVoteButton').removeClass('voteButton')
  }
}


$('.playButton').click(function() {
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

function vote(e) {
  var name = bidragsArray.find(function(element) {
    return element.nameDefine == $(e).data('bidrag');
  }).name
  if(confirm('Vill du rösta på ' + name+ '? \nDu kan inte ändra din röst senare!')) {
    $.get('/vote', {vote: $(e).data('bidrag')}, function(e) {
    	if(e = 'voted') alert('Du har redan röstat!')
      localStorage.voted = true
      $('.voteButton').prop( "disabled", true ).addClass('DeVoteButton').removeClass('voteButton')
    })
  }
}



/* Floating Images */
var imgArray = [
  {
    src: "/img/bullerTrans.png",
    name: "buller"
  },
  {
    src:"/img/grayTrans.png",
    name: "gray"
  },
  {
    src:"/img/globbyTrans.png",
    name: "globby"
  },
  {
    src:"/img/kladdTrans.png",
    name: "kladd"
  },
  {
    src:"/img/globbyTrans.png",
    name: "globby"
  },
  {
    src:"/img/grayTrans.png",
    name: "gray"
  },  {
    src:"/img/bullerTrans.png",
    name: "buller"
  },
  {
    src:"/img/kladdTrans.png",
    name: "kladd"
  }
]

imgArray.forEach((item, i) => {
  item.object = $(`<img class="floater" src="${item.src}">`).appendTo('#backgroundFloaters')

  var left = (Math.random()*$('#backgroundFloaters').width()) + (Math.random()*($('#backgroundFloaters').width()/20)-($('#backgroundFloaters').width()/40))
  var top = (Math.random()*$('#backgroundFloaters').height()) + (Math.random()*($('#backgroundFloaters').height()/20)-($('#backgroundFloaters').height()/40))
  var width = Math.random()*30 + 10
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
