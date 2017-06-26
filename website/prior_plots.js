
function generate_jeff_prior(range_min, range_max, step) {
	var i, data = [];
	for (i = range_min+step; i <= range_max; i += step) {
		data.push([i, 1/Math.sqrt(i)])
	}
	return data
}

function generate_beta_prior(range_min, range_max, step, scale=0.005) {
	var i, data = [];
	var beta_norm = 3.141592653589793238463;
	for (i = Math.max(range_min, step); i <= Math.min(range_max-step, 1.0-step); i += step) {
		p = 1/(beta_norm*Math.sqrt(i)*Math.sqrt(1-i));
		data.push([i, p])
	}
	return data
}

function generate_uniform_prior(range_min, range_max, step) {
	var i, data = [];
	var beta_norm = 3.141592653589793238463;
	for (i = range_min; i <= range_max; i += step) {
		p = 1/(range_max - range_min);
		data.push([i, p])
	}
	return data
}

var myChart1 = Highcharts.chart('uniform_prior', {
    title: {
        text: 'Uniform prior on x<sub>0</sub>',
        useHTML: true
    },
    xAxis: {
        allowDecimals: false,
        gridLineWidth: 1,
        min: 1,
        max: 100,
        title: {
            text: 'Initial copy number X<sub>0</sub>(molecules)',
            useHTML: true
        },
    },
    yAxis: {
        allowDecimals: true,
        title: {
            text: 'π(x<sub>0</sub> )',
            useHTML: true
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
    series: [
    {
        showInLegend: false,  
        dashStyle: 'dash',
        data: generate_uniform_prior(0, 100, 0.01),
        type: 'spline',
        tooltip: {
            pointFormat: 'Uniform prior on x0'
        }
    }]
});


var myChart2 = Highcharts.chart('beta_prior', {
    title: {
        text: 'Jeffreys on prior on r (Beta(0.5, 0.5))',
        useHTML: true
    },
    xAxis: {
        allowDecimals: false,
        gridLineWidth: 1,
        min: 0,
        max: 1.0,
        title: {
            text: 'Efficiency r',
            useHTML: true
        },
    },
    yAxis: {
        allowDecimals: true,
        min: 0,
        max: 2.2,
        title: {
            text: 'π(r)',
            useHTML: true
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
    series: [
    {
        showInLegend: false,  
        dashStyle: 'dash',
        data: generate_beta_prior(0, 1.0, 0.001, 1.0),
        type: 'spline',
        tooltip: {
            pointFormat: 'Beta(0.5, 0.5) prior on r'
        }
    }]
});


var myChart3 = Highcharts.chart('jeff_prior', {
    title: {
        text: 'Jeffreys prior on σ<sup>2</sup> (1/√σ)',
        useHTML: true
    },
    xAxis: {
        allowDecimals: false,
        gridLineWidth: 1,
        min: 0,
        max: 100,
        title: {
            text: 'Noise variance σ<sup>2</sup>',
            useHTML: true
        },
    },
    yAxis: {
        allowDecimals: true,
        min: 0,
        max: 1,
        title: {
            text: 'π(σ<sup>2</sup>)',
            useHTML: true
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
    series: [
    {
        showInLegend: false,  
        dashStyle: 'dash',
        data: generate_jeff_prior(0, 100, 0.01),
        type: 'spline',
        tooltip: {
            pointFormat: 'Uniform prior on x0'
        }
    }]
});