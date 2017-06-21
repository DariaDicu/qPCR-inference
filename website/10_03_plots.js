$.getJSON('http://localhost:8000/x0_p_joint_10_3_17.json', function (data) {
	 var myChart = Highcharts.chart('10_03_x0_p_sing_results', {
	    chart: {
	        type: 'scatter'
	    },
	    title: {
	        text: 'x<sub>0</sub> and r joint posterior from single-experiment inference',
	        useHTML: true
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 253, single-experiment inference'
	    },
	    // X0.
	    xAxis: {
	        allowDecimals: false,
	        title: {
	            text: 'Target quantity x<sub>0</sub>',
	            useHTML: true
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
	            text: 'Efficiency r'
	        },
	        labels: {
	            formatter: function () {
	                return this.value;
	            }
	        }
	    },
	    tooltip: {
	        pointFormat: 'x0 = {point.x}, r = {point.y}'
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
	        name: 'Joint posterior P(x0, r | D)',
        	color: 'rgba(223, 83, 83, .4)',
	        data: data
	    }]
	});
});

$.getJSON('http://localhost:8000/x01_p_joint_10_3_17.json', function (data) {
	 var myChart = Highcharts.chart('10_03_x01_p_joint_results', {
	    chart: {
	        type: 'scatter'
	    },
	    title: {
	        text: 'x<sub>0</sub><sup>1</sup> and r joint posterior from joint inference',
			useHTML: true 
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 253, joint inference'
	    },
	    // X0.
	    xAxis: {
	        allowDecimals: false,
	        title: {
	            text: 'Target quantity x<sub>0</sub><sup>1</sup>',
	            useHTML: true
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
	        pointFormat: 'x0 = {point.x}, r = {point.y}'
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
	        name: 'Joint posterior P(x0-1, r | D)',
	        useHTML: true,
        	color: 'rgba(223, 83, 83, .4)',
	        data: data
	    }]
	});
});

function compute_fill_between_bci(y1, y2) {
	var data = [];
	for (i = 0; i < y1.length; i++) {
		data.push([y1[i], y2[i]])
	}
	return data
}

function generate_jeff_prior(range_min, range_max, step) {
	var i, data = [];
	for (i = range_min+step; i <= range_max; i += step) {
		data.push([i, 0.005/Math.sqrt(i)])
	}
	return data
}

function generate_beta_prior(range_min, range_max, step, scale=0.005) {
	var i, data = [];
	var beta_norm = 3.141592653589793238463;
	for (i = Math.max(range_min, step); i <= Math.min(range_max-step, 1.0-step); i += step) {
		p = scale/(beta_norm*Math.sqrt(i)*Math.sqrt(1-i));
		data.push([i, p])
	}
	return data
}

function generate_uniform_prior(range_min, range_max, step) {
	var i, data = [];
	var beta_norm = 3.141592653589793238463;
	for (i = range_min; i <= range_max; i += step) {
		p = 0.005/(range_max - range_min);
		data.push([i, p])
	}
	return data
}

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

// Loading marginals from joint inference.
$.getJSON('http://localhost:8000/all_marginals_10_3_17_joint_inf.json', function (data) {
	 var myChart = Highcharts.chart('10_03_x0_all_marg_results', {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Marginal distribution for x0 from joint inference'
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR wells 253, 254, 255'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        min: 1,
	        max: 100,
	        plotLines: [{
	            color: 'black',
	            dashStyle: 'dash',
	            width: 1,
	            value: 61,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                y: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'Standard prediction for x<sub>0</sub><sup>1</sup>',
	                useHTML: true
	            }
	        },
	        {
	            color: 'black',
	            dashStyle: 'dash',
	            width: 1,
	            value: 79,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                y: 60,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'Standard prediction for x<sub>0</sub><sup>2</sup>'
	            }
	        },
	        {
	            color: 'black',
	            dashStyle: 'dash',
	            width: 1,
	            value: 58,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                y: 35,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'Standard prediction for x<sub>0</sub><sup>3</sup>'
	            }
	        }]
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'P(X0|D, alpha)'
	        }
	    },
	    series: [{
	        name: 'Marginal posterior of x0-1, well 253, joint inference',
	        type: 'column',
	        data: histogram(data.x01, 1.0),
        	color: 'rgba(223, 83, 83, .4)',
	        pointPadding: 0,
            pointWidth: 10,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    },{
	        name: 'Marginal posterior of x0-2, well 254, joint inference',
	        type: 'column',
	        data: histogram(data.x02, 1.0),
        	color: 'rgba(0, 0, 255, .4)',
	        pointPadding: 0,
	        groupPadding: 0,
            pointWidth: 10,
	        pointPlacement: 'on'
	    },{
	        name: 'Marginal posterior of x0-3, well 255, joint inference',
	        type: 'column',
	        data: histogram(data.x03, 1.0),
        	color: 'rgba(0,255,0,.4)',
	        pointPadding: 0,
	        groupPadding: 0,
            pointWidth: 10,
	        pointPlacement: 'on'
	    }
	    ]
	});

	
	 var myChart2 = Highcharts.chart('10_03_x01_marg_results', {
	    title: {
	        text: 'Marginal distribution for X0 from joint inference'
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 253'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        min: 1,
	        max: 100,
	        plotLines: [{
	            color: 'black',
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
	            text: 'P(x0|D, alpha)'
	        },
	        plotLines: [{
	            color: 'blue',
	            dashStyle: 'dash',
	            width: 2,
	            value: 50,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                x: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'Prior'
	            }
	        }]
	    },
	    series: [{
	        name: 'Marginal posterior of x0, well 253, joint inference',
	        type: 'column',
	        data: histogram(data.x01, 1.0),
        	color: 'rgba(223, 83, 83, .8)',
	        pointPadding: 0,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    },
	    {
            name: 'x0 prior',
	        dashStyle: 'dash',
            data: generate_uniform_prior(0, 100, 0.01),
            type: 'spline',
            tooltip: {
                pointFormat: 'Uniform prior on x0'
            }
        }]
	});
	var myChart3 = Highcharts.chart('10_03_p_marg_results', {
	    title: {
	        text: 'Marginal distribution for efficiency r from joint inference'
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 253'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        min: 0.6,
	        max: 1.0
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'P(r|D, alpha)'
	        },
	        plotLines: [{
	            color: 'blue',
	            dashStyle: 'dash',
	            width: 2,
	            value: 50,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                x: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'Prior'
	            }
	        }]
	    },
	    series: [{
	        name: 'Marginal posterior of efficiency r, well 253, joint inference',
	        type: 'column',
	        data: histogram(data.p, 0.0005),
        	color: 'rgba(237, 129, 29, 0.8)',
	        pointPadding: 0,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    },
	    {
            name: 'r prior',
	        dashStyle: 'dash',
            data: generate_beta_prior(0.6, 1.0, 0.001),
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }
        }]
	});
	var myChart4 = Highcharts.chart('10_03_sigma_marg_results', {
	    title: {
	        text: 'Marginal distribution for noise σ from joint inference'
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 253'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        min: 0.0,
	        max: 6.0
	    },
	    yAxis: {
	        allowDecimals: true,
	        max: 0.06,
	        title: {
	            text: 'P(X0|D, alpha)'
	        }
	    },
	    series: [
	    {
            name: 'σ prior',
	        dashStyle: 'dash',
            data: generate_jeff_prior(0.0, 6.0, 0.01),
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }
        },{
	        name: 'Marginal posterior of σ, well 253, joint inference',
	        type: 'column',
	        data: histogram(data.sigma, 0.05),
        	color: 'rgba(14, 156, 251, 0.8)',
	        pointPadding: 0,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    }]
	});
});

$.getJSON('http://localhost:8000/single_inf_all_marginals.json', function (data) {
	 var myChart = Highcharts.chart('10_03_x0_single_results', {
	    title: {
	        text: 'Marginal distribution for x0 from single-experiment inference'
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 253'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        plotLines: [{
	            color: 'black',
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
	                text: 'Standard prediction for x<sub>0</sub><br> (well 253)',
	                useHTML: true
	            }
	        }]
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'P(X0|D, alpha)'
	        },
	        plotLines: [{
        	color: 'blue',
	            dashStyle: 'dash',
	            width: 2,
	            value: 50,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                y: 200,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'Prior'
	            }
	        }]
	    },
	    series: [{
	        name: 'Marginal posterior of X0, well 253, single-experiment inference',
	        type: 'column',
	        data: histogram(data.x0, 1.0),
        	color: 'rgba(223, 83, 83, .8)',
	        pointPadding: 0,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    },
	    {
            name: 'x0 prior',
	        dashStyle: 'dash',
            data: generate_uniform_prior(0, 100, 0.01),
            type: 'spline',
            tooltip: {
                pointFormat: 'Uniform prior on x0'
            }
        }]
	});

	var myChart2 = Highcharts.chart('10_03_p_single_results', {
	    title: {
	        text: 'Marginal distribution for efficiency r from single-experiment inference'
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 253'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        min: 0.6,
	        max: 1.0
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'P(r|D, alpha)'
	        },
	        plotLines: [{
	            color: 'blue',
	            dashStyle: 'dash',
	            width: 2,
	            value: 50,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                x: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'Prior'
	            }
	        }]
	    },
	    series: [{
	        name: 'Marginal posterior of efficiency r, well 253, single-experiment inference',
	        type: 'column',
	        data: histogram(data.p, 0.005),
        	color: 'rgba(237, 129, 29, 0.8)',
	        pointPadding: 0,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    },
	    {
            name: 'r prior',
	        dashStyle: 'dash',
            data: generate_beta_prior(0.6, 1.0, 0.001),
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }
        }]
	});
	var myChart3 = Highcharts.chart('10_03_sigma_single_results', {
	    title: {
	        text: 'Marginal distribution for noise σ from single-experiment inference'
	    },

	    subtitle: {
	        text: 'Source: Experiment from 10/03/2017, qPCR well 253'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        min: 0.0,
	        max: 6.0
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'P(σ|D, alpha)'
	        },
	        max: 0.06,
	        plotLines: [{
	            color: 'blue',
	            dashStyle: 'dash',
	            width: 2,
	            value: 50,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                x: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'Prior'
	            }
	        }]
	    },
	    series: [{
	        name: 'Marginal posterior of noise σ, well 253, single-experiment inference',
	        type: 'column',
	        data: histogram(data.sigma, 0.05),
        	color: 'rgba(14, 156, 251, 0.8)',
	        pointPadding: 0,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    },{
            name: 'σ prior',
	        dashStyle: 'dash',
            data: generate_jeff_prior(0.0, 6.0, 0.01),
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }
        }]
	});
});


$.getJSON('http://localhost:8000/simulated_run_marginals.json', function (data) {
	 var myChart = Highcharts.chart('simulated_x0_marginal', {
	    chart: {
	        type: 'column'
	    },
	    title: {
	        text: 'Marginal distribution for x0 from joint inference on simulated data'
	    },

	    subtitle: {
	        text: 'Source: In-silico qPCR experiment with theta_mean.'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        min: 1,
	        max: 100,
	        plotLines: [{
	            color: 'black',
	            dashStyle: 'dash',
	            width: 1,
	            value: 63,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                y: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'True value for x0_1'
	            }
	        }, {
	            color: 'black',
	            dashStyle: 'dash',
	            width: 1,
	            value: 78,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                y: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'True value for x0_2'
	            }
	        }]
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'P(x0|D, alpha)'
	        }
	    },
	    series: [{
	        name: 'Marginal posterior of x0-1, well 253, joint inference',
	        type: 'column',
	        data: histogram(data.x01, 1.0),
        	color: 'rgba(223, 83, 83, .4)',
	        pointPadding: 0,
            pointWidth: 10,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    },{
	        name: 'Marginal posterior of x0-2, well 253, joint inference',
	        type: 'column',
	        data: histogram(data.x02, 1.0),
        	color: 'rgba(0,255,0,.4)',
	        pointPadding: 0,
            pointWidth: 10,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    }
	    ]
	});

	var myChart2 = Highcharts.chart('simulated_p_marginal', {
	    title: {
	        text: 'Marginal distribution for efficiency r from joint inference'
	    },

	    subtitle: {
	        text: 'Source: In-silico qPCR experiment'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        plotLines: [{
	            color: 'black',
	            dashStyle: 'dash',
	            width: 1,
	            value: 0.745893528627,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                y: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'True value for efficiency r'
	            }
	        }]
	    },
	    yAxis: {
	        allowDecimals: true,
	        title: {
	            text: 'P(r|D, alpha)'
	        }
	    },
	    series: [{
	        name: 'Marginal posterior of efficiency r, well 253, joint inference',
	        type: 'column',
	        data: histogram(data.p, 0.0005),
        	color: 'rgba(237, 129, 29, 0.8)',
	        pointPadding: 0,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    },
	    {
            name: 'r prior',
	        dashStyle: 'dash',
            data: generate_beta_prior(0.725, 0.76, 0.0001, scale=0.005),
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }
        }]
	});
	var myChart3 = Highcharts.chart('simulated_sigma_marginal', {
	    title: {
	        text: 'Marginal distribution for noise σ from joint inference'
	    },

	    subtitle: {
	        text: 'Source: In-silico qPCR experiment'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        plotLines: [{
	            color: 'black',
	            dashStyle: 'dash',
	            width: 1,
	            value: 2.73669506753,
	            zIndex: 10000,
	            label: {
	                rotation: 0,
	                y: 10,
	                style: {
	                    fontStyle: 'italic'
	                },
	                text: 'True value for noise σ'
	            }
	        }]
	    },
	    yAxis: {
	        allowDecimals: true,
	        max: 0.06,
	        title: {
	            text: 'P(σ|D, alpha)'
	        },
	    },
	    series: [
	    {
            name: 'σ prior',
	        dashStyle: 'dash',
            data: generate_jeff_prior(0.0, 6.0, 0.01),
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            }
        },{
	        name: 'Marginal posterior of σ, well 253, joint inference',
	        type: 'column',
	        data: histogram(data.sigma, 0.05),
        	color: 'rgba(14, 156, 251, 0.8)',
	        pointPadding: 0,
	        groupPadding: 0,
	        pointPlacement: 'on'
	    }]
	});
});

// BCI data.
$.getJSON('http://localhost:8000/bci_data.json', function (data) {
	 var myChart = Highcharts.chart('bci', {
	    title: {
	        text: 'Bayesian confidence interval on simulated experiment'
	    },

	    subtitle: {
	        text: 'Source: In-silico qPCR experiment with theta_mean.'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
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
            name: 'Simulation from θ MAP',
            data: data.y_map,
            width: 1,
            pointStart: 1,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            },
            zIndex:1001
        },
        {
            name: 'Mean of simulated fluorescence',
            data: data.y_mean,
            width: 1,
            pointStart: 1,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            },
            zIndex:1000
        },
        {
            name: 'Real fluorescence data',
            data: data.f_data,
            color: 'red',
            width: 1,
	         dashStyle: 'dash',
            pointStart: 1,
            type: 'spline',
            allowPointSelect:false,
            zIndex:1010
        },
        {
            type: 'arearange',
            zoomType: 'x',
            name: 'Confidence interval 5-95%',
            pointStart: 1,
            data: compute_fill_between_bci(data.y_q5, data.y_q95)
        }]
	});
	var myChart2 = Highcharts.chart('bci_zoomed', {
	    title: {
	        text: 'Bayesian confidence interval on simulated experiment (zoomed in)'
	    },

	    subtitle: {
	        text: 'Source: In-silico qPCR experiment with theta_mean.'
	    },
	    xAxis: {
	        allowDecimals: true,
	        gridLineWidth: 1,
	        min: 32
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
            name: 'Simulation from θ MAP',
            data: data.y_map,
            width: 1,
            pointStart: 1,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            },
            zIndex:1001
        },
        {
            name: 'Mean of simulated fluorescence',
            data: data.y_mean,
            width: 1,
            pointStart: 1,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            },
            zIndex:1000
        },
        {
            name: 'Real fluorescence data',
            data: data.f_data,
            color: 'red',
            width: 1,
	         dashStyle: 'dash',
            pointStart: 1,
            type: 'spline',
            tooltip: {
                valueDecimals: 2
            },
            zIndex:1010
        },
        {
            type: 'arearange',
            zoomType: 'x',
            name: 'Confidence interval 5-95%',
            pointStart: 1,
            data: compute_fill_between_bci(data.y_q5, data.y_q95)
        }]
	});
});


// Alpha dependencies.
$.getJSON('http://localhost:8000/alpha_boxplots.json', function (data) {
	formatted_data = prepare_boxplot_data(data)
	console.log(formatted_data)
	var myChart = Highcharts.chart('boxplot', {
    chart: {
        type: 'boxplot'
    },

    title: {
        text: 'Inter- and intra-experimental variability of log(α) (alpha)'
    },

    legend: {
        enabled: false
    },

    xAxis: {
        categories: ['1 (02/03/17; BJCOII)', '2 (02/03/17; BJ-CYB C57)',
        	'3 (16/12/16; BJmmMUP)', '4 (10/03/17; BJmmMUP)'],
        title: {
            text: 'Experiment No.'
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
});


