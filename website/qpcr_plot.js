
'use strict';
/* global document */
// Load the fonts
Highcharts.createElement('link', {
   href: 'https://fonts.googleapis.com/css?family=Unica+One',
   rel: 'stylesheet',
   type: 'text/css'
}, null, document.getElementsByTagName('head')[0]);

Highcharts.theme = {
   colors: ['#2b908f', '#90ee7e', '#f45b5b', '#7798BF', '#aaeeee', '#ff0066', '#eeaaee',
      '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
   chart: {
      backgroundColor: 'rgba(0,0,0,0)',
      plotBorderColor: '#606063'
   },
   title: {
      style: {
         color: '#E0E0E3',
         fontSize: '20px'
      }
   },
   subtitle: {
      style: {
         color: '#E0E0E3',
      }
   },
   xAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      title: {
         style: {
            color: '#A0A0A3'

         }
      }
   },
   yAxis: {
      gridLineColor: '#707073',
      labels: {
         style: {
            color: '#E0E0E3'
         }
      },
      lineColor: '#707073',
      minorGridLineColor: '#505053',
      tickColor: '#707073',
      tickWidth: 1,
      title: {
         style: {
            color: '#A0A0A3'
         }
      }
   },
   tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      style: {
         color: '#F0F0F0'
      }
   },
   plotOptions: {
      series: {
         dataLabels: {
            color: '#B0B0B3'
         },
         marker: {
            lineColor: '#333'
         }
      },
      boxplot: {
         fillColor: '#505053'
      },
      candlestick: {
         lineColor: 'white'
      },
      errorbar: {
         color: 'white'
      }
   },
   legend: {
      itemStyle: {
         color: '#E0E0E3'
      },
      itemHoverStyle: {
         color: '#FFF'
      },
      itemHiddenStyle: {
         color: '#606063'
      }
   },
   credits: {
      style: {
         color: '#666'
      }
   },
   labels: {
      style: {
         color: '#707073'
      }
   },

   drilldown: {
      activeAxisLabelStyle: {
         color: '#F0F0F3'
      },
      activeDataLabelStyle: {
         color: '#F0F0F3'
      }
   },

   navigation: {
      buttonOptions: {
         symbolStroke: '#DDDDDD',
         theme: {
            fill: '#505053'
         }
      }
   },

   // scroll charts
   rangeSelector: {
      buttonTheme: {
         fill: '#505053',
         stroke: '#000000',
         style: {
            color: '#CCC'
         },
         states: {
            hover: {
               fill: '#707073',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            },
            select: {
               fill: '#000003',
               stroke: '#000000',
               style: {
                  color: 'white'
               }
            }
         }
      },
      inputBoxBorderColor: '#505053',
      inputStyle: {
         backgroundColor: '#333',
         color: 'silver'
      },
      labelStyle: {
         color: 'silver'
      }
   },

   navigator: {
      handles: {
         backgroundColor: '#666',
         borderColor: '#AAA'
      },
      outlineColor: '#CCC',
      maskFill: 'rgba(255,255,255,0.1)',
      series: {
         color: '#7798BF',
         lineColor: '#A6C7ED'
      },
      xAxis: {
         gridLineColor: '#505053'
      }
   },

   scrollbar: {
      barBackgroundColor: '#808083',
      barBorderColor: '#808083',
      buttonArrowColor: '#CCC',
      buttonBackgroundColor: '#606063',
      buttonBorderColor: '#606063',
      rifleColor: '#FFF',
      trackBackgroundColor: '#404043',
      trackBorderColor: '#404043'
   },

   // special colors for some of the
   legendBackgroundColor: 'rgba(0, 0, 0, 0.5)',
   background2: '#505053',
   dataLabelsColor: '#B0B0B3',
   textColor: '#C0C0C0',
   contrastTextColor: '#F0F0F3',
   maskColor: 'rgba(255,255,255,0.3)'
};

// Apply the theme
Highcharts.setOptions(Highcharts.theme);

var myChart = Highcharts.chart('qpcr_plot', {
	    title: {
	        text: 'qPCR amplification curve (fluorescence intensities)'
	    },

	    subtitle: {
	        text: 'Source: Single-cell mtDNA qPCR experiment from 10/03/17, well 253.'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        title: {
	            text: 'Cycle number'
	        }
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'Fluorescence intensity (background corrected)'
	        }
	    },
	    plotOptions: {
		    spline: {
		        marker: {
		            enabled: false
		        }
		    }
		},
	    series: [{
            name: 'Fluorescence intensities',
            data: [-2.9843912, -3.500936, -3.0409336, -3.1643357, -2.7622252, -2.7776258, -2.375027, -2.4586647, -1.8583272, -1.587549, -1.2040541, -1.0458095, -1.2144692, -0.824642, -0.41247588, -0.48210606, -0.45844397, -0.21189678, 0.034055337, 0.041924562, -0.02901786, -0.15696712, -0.052326653, 0.28021908, -0.11332465, 0.061460465, 0.5802092, 0.3371324, 0.7466435, 2.1853447, 4.4825053, 9.235721, 17.086393, 32.21566, 55.45563, 84.45778, 113.788086, 140.14575, 159.53291, 173.48251, 182.1414, 189.41588, 195.12259, 200.0211, 205.79031],
            width: 1,
            pointStart: 1,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }}]
	});