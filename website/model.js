function compute_fill_between_bci(y1, y2) {
	var data = [];
	for (i = 0; i < y1.length; i++) {
		data.push([y1[i], y2[i]])
	}
	return data
}
// Stochasticity data.
$.getJSON('stochasticity_alpha_estimate.json', function (data) {
	var myChart1 = Highcharts.chart('stochasticity_alpha_estimate_1', {
	    title: {
	        text: 'Stochasticity in amplification when X<sub>0</sub> = 50',
	        useHTML: true
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,min: 32,
	        title: {
	        	text: 'Cycles'
	        }
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'Fluorescence intensity'
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
            data: data.y_mean_2,
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
            data: compute_fill_between_bci(data.y_q5_2, data.y_q95_2)
        }]
	});
	var myChart2 = Highcharts.chart('stochasticity_alpha_estimate_2', {
	    title: {
	        text: 'Stochasticity in amplification when X<sub>0</sub> = 100,000',
	        useHTML: true
	    },
	    xAxis: {
	        allowDecimals: true,
	        min: 32,
	        gridLineWidth: 1,
	        title: {
	        	text: 'Cycles'
	        }
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'Fluorescence intensity'
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

function prepare_boxplot_data(data) {
	e1 = data.exp1.sort()
	e1.unshift(0)
	e2 = data.exp2.sort()
	e2.unshift(1)
	e3 = data.exp3.sort()
	e3.unshift(2)
	e4 = data.exp4.sort()
	e4.unshift(3)
    var arr = [e1,e2,e3,e4];
    return arr;
}

function prepare_boxplot_data_same_primer(data) {
	e3 = data.exp3.sort()
	e3.unshift(0)
	e4 = data.exp4.sort()
	e4.unshift(1)
  var arr = [e3,e4];
  return arr;
}

function sigmoid_for_alpha() {
	Fmax=241.83779869
	Chalf=23.0769248066
	k=2.04135663192
	Fb=1.08781133813

	var foo = new Array(45);

	for(var i=1; i<=foo.length; i++) {
		C = i
		foo[i-1] = (Fmax/(1+Math.exp(-(C - Chalf)/k))) + Fb
	}
	return foo

}

function sigmoid1() {
	Fmax=-202.070628074
	Chalf=36.6073537865
	k=-1.70382391048
	Fb=200.629542317

	var foo = new Array(45);

	for(var i=1; i<=foo.length; i++) {
		C = i
		foo[i-1] = (Fmax/(1+Math.exp(-(C - Chalf)/k))) + Fb
	}
	return foo
}

function exponential1() {
	a = 2.9761414403e-16
	b = 1.00000000135
	c = 10.673231176
	var foo = new Array(45);

	for(var i=1; i<=foo.length; i++) {
		C = i
		foo[i-1] = a*Math.exp(b*C) + c
	}
	return foo
}

function sigmoid2() {
	Fmax=3043.98456809   
	Chalf=42.0857566927
	k=1.78868504815
	Fb=-1.24749209672

	var foo = new Array(35);

	for(var i=1; i<=foo.length; i++) {
		C = i
		foo[i-1] = (Fmax/(1+Math.exp(-(C - Chalf)/k))) + Fb
	}
	return foo
}

function exponential2() {
	a = 2.21806411954e-07 
	b = 0.553218539058
	c = -1.25345244992
	var foo = new Array(35);

	for(var i=1; i<=foo.length; i++) {
		C = i
		foo[i-1] = a*Math.exp(b*C) + c
	}
	return foo
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


// Alpha dependencies.
$.getJSON('alpha_boxplots_same_primer.json', function (data) {

	var myChart_sigmoid_fitting = Highcharts.chart('sigmoid_fitting', {
	    title: {
	        text: 'Sigmoid curve fit on experimental fluorescence data'
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
	            text: 'Fluorescence intensity'
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
	        name: 'Sigmoid',
	        data: sigmoid_for_alpha(),
	        width: 1,
	        pointStart: 1,
	        type: 'spline',
	        tooltip: {
	            valueDecimals: 2
	        }},{
	        name: 'Fluorescence intensity reads',
	        data: [-1.620079, -1.0562363, -0.13511658, 0.61642456, 0.5749283, 1.3738327, 2.0398865, 2.5621414, 3.3043213, 3.5854568, 4.0432816, 4.6773148, 4.9386063, 5.5618057, 6.521843, 8.633629, 11.160088, 16.436852, 25.403603, 40.966774, 63.598625, 92.538445, 124.12728, 152.8989, 176.63885, 195.61304, 209.56622, 219.64359, 226.77371, 230.92078, 233.9159, 235.48373, 236.98224, 238.53406, 239.78308, 240.97644, 242.3851, 244.02731, 243.94257, 245.1307, 245.69452, 246.89075, 247.45758, 249.29565, 249.29083],
	        width: 1,
	        pointStart: 1,
	        type: 'scatter',
	        tooltip: {
	            valueDecimals: 2
	        }}]
	});


	formatted_data_same_primer = prepare_boxplot_data_same_primer(data)
	var myChart2 = Highcharts.chart('boxplot2', {
    chart: {
        type: 'boxplot'
    },

    title: {
        text: 'Variability in α between experiments with the same primer (BJmmMUP), on linear scale'
    },

    legend: {
        enabled: false
    },

    xAxis: {
        categories: ['16/12/16, BJmmMUP', '10/03/17, BJmmMUP'],
        title: {
            text: 'Experiment (date, primer)'
        }
    },

    yAxis: {
    	allowDecimals:true,
        title: {
            text: 'Estimated α'
        }
    },

    plotOptions: {
        boxplot: {
            fillColor: '#F0F0E0',
            lineWidth: 2,
            medianColor: '#0C5DA5',
            medianWidth: 3,
            stemColor: '#A63400',
            stemDashStyle: 'dot',
            stemWidth: 1,
            whiskerColor: '#3D9200',
            whiskerLength: '20%',
            whiskerWidth: 3
        }
    },

    series: [{
        name: 'Observations',
        data: formatted_data_same_primer
    }]

});

// Alpha dependencies.
$.getJSON('alpha_boxplots.json', function (data) {
	formatted_data = prepare_boxplot_data(data)
	var myChart = Highcharts.chart('boxplot', {
    chart: {
        type: 'boxplot'
    },

    title: {
        text: 'Inter- and intra-experimental variability of log(α)'
    },

    legend: {
        enabled: false
    },

    xAxis: {
        categories: ['02/03/17, BJCOII', '02/03/17, BJ-CYB C57',
        	'16/12/16; BJmmMUP', '10/03/17, BJmmMUP'],
        title: {
            text: 'Experiment (date, primer)'
        }
    },

    yAxis: {
    	allowDecimals:true,
        title: {
            text: 'Estimated log(α)'
        }
    },

    plotOptions: {
        boxplot: {
            fillColor: '#F0F0E0',
            lineWidth: 2,
            medianColor: '#0C5DA5',
            medianWidth: 3,
            stemColor: '#A63400',
            stemDashStyle: 'dot',
            stemWidth: 1,
            whiskerColor: '#3D9200',
            whiskerLength: '20%',
            whiskerWidth: 3
        }
    },

    series: [{
        name: 'Observations',
        data: formatted_data
    }]

});
Highcharts.setOptions(Highcharts.theme);
var myChart_sigvsexp = Highcharts.chart('sigmoid_vs_exponential', {
    title: {
        text: 'Fitting sigmoid and exponential models'
    },
    xAxis: {
        allowDecimals: true,
        gridLineWidth: 1,
        title: {
            text: 'Cycle number'
        }
    },
    yAxis: {
    	max:200,
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
        name: 'Fluorescence intensity reads',
        data: [-2.9843912, -3.500936, -3.0409336, -3.1643357, -2.7622252, -2.7776258, -2.375027, -2.4586647, -1.8583272, -1.587549, -1.2040541, -1.0458095, -1.2144692, -0.824642, -0.41247588, -0.48210606, -0.45844397, -0.21189678, 0.034055337, 0.041924562, -0.02901786, -0.15696712, -0.052326653, 0.28021908, -0.11332465, 0.061460465, 0.5802092, 0.3371324, 0.7466435, 2.1853447, 4.4825053, 9.235721, 17.086393, 32.21566, 55.45563, 84.45778, 113.788086, 140.14575, 159.53291, 173.48251, 182.1414, 189.41588, 195.12259, 200.0211, 205.79031],
        width: 1,
        color:'rgb(180, 50, 100)',
        pointStart: 1,
        type: 'scatter',
        tooltip: {
            valueDecimals: 2
        }},
        {
        name: 'Sigmoid',
        data: sigmoid1(),
        width: 1,
        pointStart: 1,
        type: 'spline',
        tooltip: {
            valueDecimals: 2
        }},{
        name: 'Exponential',
        data: exponential1(),
        width: 1,
        pointStart: 1,
        type: 'spline',
        tooltip: {
            valueDecimals: 2
        }}]
});

var myChart_sigvsexp2 = Highcharts.chart('sigmoid_vs_exponential2', {
    title: {
        text: 'Fitting sigmoid and exponential models'
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
        name: 'Fluorescence intensity reads',
        data: [-2.9843912, -3.500936, -3.0409336, -3.1643357, -2.7622252, -2.7776258, -2.375027, -2.4586647, -1.8583272, -1.587549, -1.2040541, -1.0458095, -1.2144692, -0.824642, -0.41247588, -0.48210606, -0.45844397, -0.21189678, 0.034055337, 0.041924562, -0.02901786, -0.15696712, -0.052326653, 0.28021908, -0.11332465, 0.061460465, 0.5802092, 0.3371324, 0.7466435, 2.1853447, 4.4825053, 9.235721, 17.086393, 32.21566, 55.45563],
        width: 1,
        color:'rgb(180, 50, 100)',
        pointStart: 1,
        type: 'scatter',
        tooltip: {
            valueDecimals: 2
        }},
        {
        name: 'Sigmoid',
        data: sigmoid2(),
        width: 1,
        pointStart: 1,
        type: 'spline',
        tooltip: {
            valueDecimals: 2
        }},{
        name: 'Exponential',
        dashStyle: 'dash',
        data: exponential2(),
        width: 1,
        pointStart: 1,
        type: 'spline',
        tooltip: {
            valueDecimals: 2
        }}]
});

});

});