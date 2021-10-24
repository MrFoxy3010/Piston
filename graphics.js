var state_simulation = false, state_pause = true;
var graph_velocity = document.getElementById('graph_velocity'), ctx_graph_velocity  = graph_velocity.getContext('2d');
var graphVelocityChart = new Chart(ctx_graph_velocity, {
    type: 'line',
    data: {
	    labels: [0],
	    datasets: [{
		    data: [0],
		    fill: false,
		    borderColor: 'rgb(75, 192, 192)',
		    pointRadius: 0
	    }]
	},
    options: {
    	responsive: true,
    	maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Средняя скорость частиц'
        },
	    legend: {
	    	display: false
	    },
	    tooltips: {
	        mode: false
	    }
    }
});

var graph_vel = document.getElementById('graph_vel'), ctx_graph_vel  = graph_vel.getContext('2d');
var graphVelChart = new Chart(ctx_graph_vel, {
    type: 'bar',
    data: {
	    labels: [0],
	    datasets: [{
		    data: [0],
		    borderWidth: 1,
		    backgroundColor: 'rgb(75, 192, 192)'
	    }]
	},
    options: {
    	responsive: true,
    	maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Распределение скоростей частиц'
        },
	    legend: {
	    	display: false
	    },
	    animation: {
	        duration: 0
	    },
	    scales: {
	    	xAxes: [{
	    	    barPercentage: 1.0,
		    	categoryPercentage: 1.0
	    	}]
	    }
    }
});

let time = 0, m = [];
setTimeout(drawChart, 1000);

function drawChart(){
	if(state_simulation && state_pause){
		time += 1;
		let speed_molecules = 0, c = 0;
		for (let i = 0; i < molecules_count; i++) {
			if(Math.floor(Math.sqrt(molecules[i].dx*molecules[i].dx + molecules[i].dy*molecules[i].dy)) > 0)
				speed_molecules += Math.floor(Math.sqrt(molecules[i].dx*molecules[i].dx + molecules[i].dy*molecules[i].dy));
			else c += 1;
			if(m[speed_molecules] == null) m[speed_molecules] = 1;
			else m[speed_molecules] += 1;
		}
		addData(graphVelocityChart, time, speed_molecules / (molecules_count - c));
	    removeData(graphVelChart);
		m.forEach(function(element, index) { addData(graphVelChart, index, element) });
		graphVelocityChart.update();
		graphVelChart.update();
	}
	if(document.getElementById("type_modeling").value == "statistics") setTimeout(drawChart, 1);
	else setTimeout(drawChart, 1000);
}

function removeData(chart) {
    chart.data.labels = [0];
    chart.data.datasets[0].data = [0];
}

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => dataset.data.push(data));
}

function clearChart() {
	m = [];
	graphVelocityChart.data.labels = [0];
    graphVelocityChart.data.datasets[0].data = [0];
	graphVelocityChart.update();
	graphVelChart.data.labels = [0];
    graphVelChart.data.datasets[0].data = [0];
    graphVelChart.update();
}
