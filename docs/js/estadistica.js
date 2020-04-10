function addData(){
	let x = document.form.y,
		y = document.form.x;
	if(x.value || y.value){
		let xArray, yArray;
		if(x.value){
			xArray = x.value.split(',');
			if(xArray.length == 1){
				chartExample.data.datasets[0].data.push(xArray[0]);
				localStorage.setItem("data", chartExample.data.datasets[0].data);
				x.value = "";
			}
			else{
				chartExample.data.datasets[0].data = xArray;
				localStorage.setItem("data", xArray);
			}
		}
		if(y.value){
			yArray = y.value.split(',');
			if(yArray.length == 1){
				chartExample.data.labels.push(yArray[0]);
				localStorage.setItem("labels", chartExample.data.labels);
				y.value = "";
			}
			else{
				chartExample.data.labels = yArray;
				localStorage.setItem("labels", yArray);
			}
		}
		
		chartExample.update();
	}
}

function addLabelXY(){
	let x = document.form.titleHorizontal,
	    y = document.form.titleVertical,
	    title = document.form.titleCanvas;
	if(x.value||y.value||title.value){
		if(x.value){
			objectOptions.scales.xAxes[0].display = true;
			objectOptions.scales.xAxes[0].scaleLabel.display = true;
			objectOptions.scales.xAxes[0].scaleLabel.labelString = x.value;
			localStorage.setItem("titleX",x.value);
			x.value = "";
		}
		if(y.value){
			objectOptions.scales.yAxes[0].display = true;
			objectOptions.scales.yAxes[0].scaleLabel.display = true;
			objectOptions.scales.yAxes[0].scaleLabel.labelString = y.value;
			localStorage.setItem("titleY",y.value);
			y.value = "";
		}
		if(title.value){
			objectOptions.title.text = title.value;
			localStorage.setItem("title",title.value);
			title.value = "";
		}
		chartExample.options = objectOptions;
		chartExample.update();
	}
}

function changeColor(){
	let newColor = document.form.selectColor.value;
	chartExample.data.datasets[0].backgroundColor = newColor + ".4)";
	chartExample.data.datasets[0].borderColor = newColor + "1)";
	localStorage.setItem("color", newColor);
	chartExample.update();
}

function drawCanvas(tipograf, objeto, objetoOption){
	if(chartExample) chartExample.destroy();
	switch(tipograf){
		case 'pie':
			objectOptions.scales.xAxes[0].display = false;
			objectOptions.scales.yAxes[0].display = false;
			objectOptions.legend.display = true;
			objectOptions.legend.position = 'bottom';
			objectData.datasets[0].backgroundColor = pieColors; //.map(item => {return item.slice(0,-2) + ".3)"});
			objectData.datasets[0].borderColor = 'white';
			objectData.datasets[0].borderAlign = 'inner';
			break;
		case 'horizontalBar':
			objectOptions.scales.xAxes[0].display = true;
			objectOptions.scales.yAxes[0].display = true;
			objectOptions.legend.display = false;
			if(localStorage.getItem("color")) objectData.datasets[0].backgroundColor = localStorage.getItem("color")+".3)"; //.map(item => {return item.slice(0,-2) + ".3)"});
			else{objectData.datasets[0].backgroundColor = 'rgba(255,193,7,.3)'}
			if(localStorage.getItem("color"))objectData.datasets[0].borderColor = localStorage.getItem("color")+"1)";
			else{objectData.datasets[0].borderColor = 'rgba(255,193,7,1)'}
			//canvasExample.height = 600;
			let y = objectOptions.scales.yAxes[0].scaleLabel.labelString;
			if(localStorage.getItem("titleX")) objectOptions.scales.yAxes[0].scaleLabel.labelString = localStorage.getItem("titleX");
			else {objectOptions.scales.yAxes[0].scaleLabel.labelString = objectOptions.scales.xAxes[0].scaleLabel.labelString;}
			if(localStorage.getItem("titleY")) objectOptions.scales.xAxes[0].scaleLabel.labelString = localStorage.getItem("titleY");
			else {objectOptions.scales.xAxes[0].scaleLabel.labelString = y;}
			break;
		default: 
			objectOptions.scales.xAxes[0].display = true;
			objectOptions.scales.yAxes[0].display = true;
			objectOptions.legend.display = false;
			objectData.datasets[0].backgroundColor = localStorage.getItem("color")+".3)";
			objectData.datasets[0].borderColor = localStorage.getItem("color")+"1)";
			if(localStorage.getItem("titleX")) objectOptions.scales.xAxes[0].scaleLabel.labelString = localStorage.getItem("titleX");
			if(localStorage.getItem("titleY"))objectOptions.scales.yAxes[0].scaleLabel.labelString = localStorage.getItem("titleY");
	}
	
	chartExample = new Chart(ctx, {
		type: tipograf,
		data: objeto,
		options: objetoOption
	});
}

var exampleData = [120,173,75,170,160,135,179,159],
    exampleLabels = [9,17,16,5,14,12,17,16],
    pieColors = ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)', 'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)','rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)' ],
    objectData = {
    	labels: exampleLabels,
    	datasets: [{
	    	data: exampleData,
	    	backgroundColor: 'rgba(255, 193, 7,.3)',
	    	borderColor: 'rgba(255,193,7,1)',
	    	borderWidth: 2,
	    	lineTension: 0
    	}]
    },
    objectOptions = {
    	title: {
	    	display: true,
	    	text: 'Gráfico de ejemplo',
	    	fontSize: 18
    	},
    	legend: {
    		display: false
    	},
    	scales: {
	    	yAxes: [{
		    	display: true,
		    	scaleLabel: {
			    	display: true,
			    	labelString: 'Altura en centímetros (cm)',
			    	fontSize: 15
		    	},
		    	ticks: {
		    		beginAtZero: true
		    	}
	    	}],
	    	xAxes: [{
		    	display: true,
		    	ticks: {
		    		beginAtZero: true
		    	},
		    	scaleLabel: {
			    	display: true,
			    	labelString: 'Edad en años',
			    	fontSize: 15
		    	}
	    	}]
    	}
    };
    	
addD.addEventListener('click', addData);
addTitleXY.addEventListener('click', addLabelXY);
document.form.selectColor.addEventListener('change', changeColor);
download.addEventListener('click', () => {
	let canvasurl = document.getElementById("canvasExample").toDataURL("image/jpeg", 1.0);
	download.setAttribute("href", canvasurl);
});

var chartExample;

Chart.plugins.register({
	beforeDraw: function(chartInstance) {
		var ctx = chartInstance.chart.ctx;
			ctx.fillStyle = "white";
			ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
	}
});

var ctx = document.getElementById('canvasExample').getContext('2d');

document.type.selectType.addEventListener('change', () => {
	drawCanvas(document.type.selectType.value, objectData, objectOptions);
});

a = localStorage.getItem("titleX");
b = localStorage.getItem("titleY");
c = localStorage.getItem("title");
d = localStorage.getItem("labels");
e = localStorage.getItem("data");
f = localStorage.getItem("color");

if(a||b||c||d||e||f){
	if(d) objectData.labels = d.split(',');
	if(e) objectData.datasets[0].data = e.split(',');
	if(f){
		objectData.datasets[0].backgroundColor = f+".3)";
		objectData.datasets[0].borderColor = f+"1)";
	}
	if(c) objectOptions.title.text = c;
	if(a) objectOptions.scales.xAxes[0].scaleLabel.labelString = a;
	if(b) objectOptions.scales.yAxes[0].scaleLabel.labelString = b;
}

drawCanvas('bar', objectData,objectOptions);