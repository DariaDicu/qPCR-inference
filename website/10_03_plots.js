$.getJSON('http://localhost:8000/x0_samples_10_3_17.json', function (data) {
	 var myChart = Highcharts.chart('10_03_x0_posterior', {
	    chart: {
	        type: 'area'
	    },
	    title: {
	        text: 'Posterior distribution for X0'
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 352'
	    },
	    xAxis: {
	        allowDecimals: false,
	        labels: {
	            formatter: function () {
	                return this.value; // clean, unformatted number for year
	            }
	        },
	        plotLines: [{
	            color: 'black',
	            dashStyle: 'dash',
	            width: 1,
	            value: 266,
	            label: {
	                rotation: 0,
	                y: 15,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'X0 predicted by standard curve'
	            },
	            zIndex: 10000
	        }]
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'P(X0|D, alpha)'
	        },
	        labels: {
	            formatter: function () {
	                return this.value / 1000000;
	            }
	        }
	    },
	    tooltip: {
	        pointFormat: '{series.name} has <b>{point.y:,.0f}</b><br/> samples for X0={point.x}'
	    },
	    plotOptions: {
	        area: {
	            pointStart: 0,
	            marker: {
	                enabled: false,
	                symbol: 'circle',
	                radius: 2,
	                states: {
	                    hover: {
	                        enabled: true
	                    }
	                }
	            }
	        }
	    },
	    series: [{
	        name: 'Posterior for mean alpha',
	        data: data
	    }]
	});
});

$.getJSON('http://localhost:8000/x0_p_joint_10_3_17.json', function (data) {
	 var myChart = Highcharts.chart('10_03_x0_p_joint', {
	    chart: {
	        type: 'scatter'
	    },
	    title: {
	        text: 'Joint posterior distribution for X0 and p'
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 352'
	    },
	    // X0.
	    xAxis: {
	        allowDecimals: false,
	        title: {
	            text: 'Target quantity X0'
	        },
	        labels: {
	            formatter: function () {
	                return this.value;
	            }
	        }
	    },
	    // Probability.
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'Efficiency p'
	        },
	        labels: {
	            formatter: function () {
	                return this.value;
	            }
	        }
	    },
	    tooltip: {
	        pointFormat: 'X0 = {point.x}, p = {point.y}'
	    },
	    plotOptions: {
	        scatter: {
	            pointStart: 0,
	            marker: {
	                symbol: 'circle',
	                radius: 1,
	                states: {
	                    hover: {
	                        enabled: true
	                    }
	                }
	            }
	        }
	    },
	    series: [{
	        name: 'Joint posterior P(X0, p | D)',
        	color: 'rgba(223, 83, 83, .4)',
	        data: data
	    }]
	});
});