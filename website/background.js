var myChart_qpcr = Highcharts.chart('qpcr_plot', {
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
            name: 'Exponential phase',
            data: [-2.9843912, -3.500936, -3.0409336, -3.1643357, -2.7622252, -2.7776258, -2.375027, -2.4586647, -1.8583272, -1.587549, -1.2040541, -1.0458095, -1.2144692, -0.824642, -0.41247588, -0.48210606, -0.45844397, -0.21189678, 0.034055337, 0.041924562, -0.02901786, -0.15696712, -0.052326653, 0.28021908, -0.11332465, 0.061460465, 0.5802092, 0.3371324, 0.7466435, 2.1853447, 4.4825053, 9.235721, 17.086393, 32.21566, 55.45563],
            width: 1,
            color:'rgb(180, 50, 100)',
            pointStart: 1,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }},{
            name: 'Linear phase',
            data: [55.45563, 84.45778, 113.788086, 140.14575, 159.53291, 173.48251, 182.1414, 189.41588, 195.12259, 200.0211, 205.79031],
            width: 1,
            color:'rgb(124, 181, 236)',
            pointStart: 35,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }},{
            name: 'Plateau phase',
            data: [205.79031, 206.79031, 207.1212, 207.323232, 207.1211, 207.111],
            width: 1,
            color:'black',
            pointStart: 45,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }}]
	});

var myChart_standard_curve = Highcharts.chart('standard_curve', {
	    title: {
            text: 'Standard calibration curve, C<sub>T</sub> vs. log(X<sub>0</sub>)',
            useHTML: true
	    },

	    subtitle: {
	        text: 'Source: Dilution series from 16/12/2017 experiment',
	        useHTML: true
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        
	        title: {
	        	text: 'Initial copy number X<sub>0</sub>',
	        	useHTML: true
	        }, 
	        labels: {
	            formatter: function () {
	                return '10<sup>'+(this.value)+'</sup>';
	            },
	            useHTML: true
            },
	        plotLines: [{
	            color: 'rgb(124, 181, 236)',
	            dashStyle: 'dash',
	            width: 2,
	            value: 3.73037846859,
	            zIndex: 10000,
            	label: {
	                rotation: 0,
	                y: 200,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'X<sub>0</sub> = 5375<br>(estimated from curve)',
	                useHTML: true
	            }
	        }]
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'C<sub>T</sub>',
	            useHTML: true
	        },
	        plotLines: [{
	            color: 'rgb(124, 181, 236)',
	            dashStyle: 'dash',
	            width: 2,
	            value: 27.6555589527,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                x: 10,
	                y: 20,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'C<sub>T</sub> = 27.6555589527<br>(known)',
	                useHTML: true
	            }
	        }]
	    },
	    plotOptions: {
		    spline: {
		        marker: {
		            enabled: false
		        }
		    }
		},
	    series: [{
            name: 'Calibration curve in log space',
            /*data: [[1, 19.8236493], [2, 23.0408707], [3, 26.68611]], */
            data: [[2, 32.3638577], [3, 30.0385027], [4, 26.7758877], [5, 23.0731528], [6, 20.0826936667]],
            width: 1,
            color:'rgb(180, 50, 100)',
            pointStart: 1,
            type: 'line',},
            {
            name: 'Sample with known CT, unknown copy number',
            type: 'scatter',
            color: 'rgb(124, 181, 236)',
		    tooltip: {
		        pointFormat: 'X0 = 5375, CT = {point.y}'
		    },
            /*data: [[1, 19.8236493], [2, 23.0408707], [3, 26.68611]], */
            data: [[3.73037846859, 27.6555589527]],
            width: 1}]
	});

function compute_fill_between_bci(y1, y2) {
	var data = [];
	for (i = 0; i < y1.length; i++) {
		data.push([y1[i], y2[i]])
	}
	return data
}

// Stochasticity data.
$.getJSON('stochasticity_p075.json', function (data) {
	var myChart2 = Highcharts.chart('stochasticity2', {
	    title: {
	        text: 'Stochasticity in amplification for the same X<sub>0</sub>',
          useHTML: true
	    },

	    subtitle: {
	        text: 'Data from 1000 simulations of the qPCR process with efficiency r = 0.75 and X<sub>0</sub> = 50',
	        useHTML: true
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        min: 27,
	        title: {
	        	text: 'Cycles'
	        }
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'Copy number'
	        },
	        labels: {
	            formatter: function () {
	                return (this.value/1000000000) + '&middot;10<sup>9</sup>';
	            },
	            useHTML: true
            }
	    },
	    plotOptions: {
		    spline: {
		        marker: {
		            enabled: false
		        }
		    }
		},
	    series: [
        {
            name: 'Mean of simulated fluorescence',
            data: data.y_mean,
            color: 'black',
            width: 1,
            pointStart: 1,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            },
            zIndex:1000
        },        {
            type: 'arearange',
            zoomType: 'x',
            name: 'Confidence interval 5-95%',
            pointStart: 1,
            color: 'rgba(26, 216, 234, 0.6)',
            data: compute_fill_between_bci(data.y_q5, data.y_q95)
        }]
	});
});


function histogram(data, step) {
    var histo = {},
        x,
        i,
        arr = [];

    // Group down
    for (i = 0; i < data.length; i++) {
        x = Math.round(data[i] / step) * step;
        if (!histo[x]) {
            histo[x] = 0;
        }
        histo[x]++;
    }

    // Make the histo group into an array
    for (x in histo) {
        if (histo.hasOwnProperty((x))) {
            arr.push([parseFloat(x), histo[x]/data.length]);
        }
    }

    // Finally, sort the array
    arr.sort(function (a, b) {
        return a[0] - b[0];
    });

    return arr;
}


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


$.getJSON('all_marginals_10_3_17_joint_inf.json', function (data) {
	// Apply the theme
	Highcharts.setOptions(Highcharts.theme);
	 var myChart = Highcharts.chart('x0_posterior', {
	    title: {
	        text: 'Marginal distribution for X<sub>0</sub>',
	        useHTML: true
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
          title: {
              text: 'Initial copy number (molecules)',
              useHTML: true
          },
	        plotLines: [{
	            color: 'white',
	            dashStyle: 'dash',
	            width: 2,
	            value: 61,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                y: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'Standard prediction for x<sub>0</sub><sup>1</sup><br> (well 253)',
	                useHTML: true
	            }
	        }]
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'P(X<sub>0</sub>|F<sub>1:n</sub>, α)',
	            useHTML: true
	        }
	    },
	    series: [{
	        name: 'Marginal posterior of X0',
	        type: 'column',
	        data: histogram(data.x01, 1.0),
	        pointPadding: 0,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    }]
	});
});
