function addData(){
	let x = document.form.x,
		y = document.form.y;
	if(x.value && y.value){
		let xArray = x.value.split(','),
		    yArray = y.value.split(',').map(Number);
		if(xArray.length == 1||yArray.length == 1){
			chartExample.data.datasets[0].data.push(parseFloat(yArray));
			chartExample.data.labels.push(xArray);
		}
		else{
			chartExample.data.labels = xArray;
			chartExample.data.datasets[0].data = yArray;
		}
		chartExample.update();
		x.value = "";
		y.value = "";
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
			x.value = "";
		}
		if(y.value){
			objectOptions.scales.yAxes[0].display = true;
			objectOptions.scales.yAxes[0].scaleLabel.display = true;
			objectOptions.scales.yAxes[0].scaleLabel.labelString = y.value;
			y.value = "";
		}
		if(title.value){
			objectOptions.title.text = title.value;
		}
		chartExample.options = objectOptions;
		//drawCanvas(document.type.selectType.value, objectData, objectOptions);
		chartExample.update();
	}
}

function changeColor(){
	let newColor = document.form.selectColor.value;
	chartExample.data.datasets[0].backgroundColor = newColor + ".4)";
	chartExample.data.datasets[0].borderColor = newColor + "1)";
	chartExample.update();
}

var exampleData = [120,173,75,170,160,135,179,159],
    exampleLabels = [9,17,16,5,14,12,17,16],
    objectData = {
    	labels: exampleLabels,
    	datasets: [{
    	data: exampleData,
    	backgroundColor: 'rgba(0, 123, 255,.3)',
    	borderColor: 'rgba(0,123,255,1)',
    	borderWidth: 1,
    	lineTension: 0
    	}]
    	},
    	objectOptions =  {title: {
    	display: true,
    	text: 'Gráfico de ejemplo'
    	},
    	legend: {
    	display: false
    	},
    	scales: {
    	yAxes: [{
    	display: true,
    	scaleLabel: {
    	display: true,
    	labelString: 'Altura en centímetros (cm)'
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
    	labelString: 'Edad en años'
    	}
    	}]
    	}},
    	objectStorage = new Object;
    	//tipo = 'line';
addD.addEventListener('click', addData);
addTitleXY.addEventListener('click', addLabelXY);
document.form.selectColor.addEventListener('change', changeColor);
//selectType.addEventListener('change', drawCanvas(selectType.value, objectData));
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
function drawCanvas(tipograf, objeto, objetoOption){
 if(chartExample) chartExample.destroy();
 chartExample = new Chart(ctx, {
	type: tipograf,
	data: objeto,
	options: objetoOption
});
}

document.type.selectType.addEventListener('change', () => {

drawCanvas(document.type.selectType.value, objectData, objectOptions);
});

drawCanvas('bar', objectData,objectOptions);