var bidragsArray;
$( document ).ready(function() {
  var ctx = document.getElementById('myChart').getContext('2d');
  $.getJSON( "/adminRequest", function( adminData ) {
    $.getJSON( "/bidrag.json", function( bidragsData ) {
      bidragsArray = bidragsData;
      console.log(bidragsArray)

      list = {}
      adminData.forEach((item, i) => {
        if(!list[item.bidrag]) list[item.bidrag] = 0
        list[item.bidrag] += 1
      });

      nameList = []
      Object.keys(list).forEach((item, i) => {
        var name = bidragsArray.find(function(element) {
          return element.nameDefine == item;
        }).name
        nameList.push(name)
      });

      chart = new Chart(ctx, {
          // The type of chart we want to create
          type: 'bar',

          // The data for our dataset
          data: {
              labels: nameList,
              datasets: [{
                  label: '',
                  backgroundColor: ['#FF6633', '#FFB399', '#FF33FF', '#FFFF99', '#00B3E6','#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D','#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#CCFF1A', '#FF1A66', '#E6331A', '#33FFCC','#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC','#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399','#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680','#4D8066', '#809980', '#E6FF80', '#1AFF33', '#999933','#FF3380', '#CCCC00', '#66E64D', '#4D80CC', '#9900B3','#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'],
                  borderColor: 'rgb(255, 99, 132)',
                  data: Object.values(list),
            minBarLength: 0,
              }]
          },

          // Configuration options go here
          options: {
            responsive : true,
            legend: { display: false },
            title: {
              display: true,
              text: 'Tubfestivalen resultat'
            },
            scales: {
                xAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
          }
      });
    });
  })
});
