getBidrag();

$(window).resize(function() {
  render();
});

function getBidrag() {
  $.getJSON("/adminRequest", function(adminData) {
    $.getJSON("/bidrag.json", function(bidragsData) {
      bidragsArray = bidragsData;

      list = {};
      adminData.forEach((item, i) => {
        if (!list[item.bidrag]) list[item.bidrag] = 0;
        list[item.bidrag] += 1;
      });

      bidragsArray.forEach((item, i) => { // Add votes to each bidrag
        var name = Object.keys(list).find(function(element) {
          return element == item.nameDefine;
        });
        if (name) {
          item.votes = list[name];
        } else {
          item.votes = 0;
        }
      });

      render();
    });
  });
}

function render() {
  bidragsArray = bidragsArray.sort((a, b) => parseFloat(b.votes) - parseFloat(a.votes));

  if ($('body').width() >= 800) {
    var tempArr = [];
    tempArr[0] = bidragsArray[0];
    tempArr[1] = bidragsArray[5];
    tempArr[2] = bidragsArray[1];
    tempArr[3] = bidragsArray[6];
    tempArr[4] = bidragsArray[2];
    tempArr[5] = bidragsArray[7];
    tempArr[6] = bidragsArray[3];
    tempArr[7] = bidragsArray[8];
    tempArr[8] = bidragsArray[4];
    tempArr[9] = bidragsArray[9];
    bidragsArray = tempArr;
  }

  $('.bidrag').remove();

  var itemsProcessed = 0;
  bidragsArray.forEach((item, i) => {
    addBidrag(item);
  });
}

$('body').on("click", '.playButton', function() {
  var audioplayer = document.getElementById($(this).data('bidrag') + "Player");
  if (audioplayer.paused) {
    audioplayer.play();
    $(this).addClass('paused');
  } else {
    audioplayer.pause();
    $(this).removeClass('paused');
  }
});

new SimpleBar($('#bidragsList')[0], {
  autoHide: false,
});

var bidragsProcessed = 0;

function addBidrag(bidrag) {
  bidragsProcessed++;

  var rost = 'röster';
  if (bidrag.votes == 1) {
    rost = 'röst';
  }

  bidrag.object = $(`
    <li class="bidrag">
      <img class="thumb" src="${bidrag.thumb}">
      <button data-bidrag="${bidrag.nameDefine}" class='playButton'></button>
      <span class="SongInfo">${bidrag.name}<br><div class="artist">${bidrag.artist}</div></span>
      <span class="roster">${bidrag.votes} ${rost}</span>
      <audio preload="none" id="${bidrag.nameDefine}Player">
        <source src="${bidrag.audio}" type="audio/mp3" />
      </audio>
    </li>
  `).appendTo('.simplebar-content');

  if (bidragsProcessed === bidragsArray.length) {
    setTimeout(function() {
      $('#loading').fadeOut('fast');
    }, 2000);
  }
}