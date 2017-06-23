

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