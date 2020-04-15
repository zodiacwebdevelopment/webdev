function readCsv(){
			let file = document.getElementById("fileName");
			const reader = new FileReader();
			reader.onload = function(){
				let lines = reader.result.split('\n');
				lines.map(item => {
					if(item){
						let row = item.split(',');
						datoArchivo.push(...row);
					}
				});
				document.form.datos.value = datoArchivo;
				datoArchivo = [];
			}
			reader.readAsText(archivo.files[0]);
		}
		
		function clearTextarea(){
			document.form.datos.value = "";
		}
		
		function getRound(num, decimals, up){
			let rounded = num;
			for(let i=0; i<decimals; i++) rounded *= 10;
			if(up) rounded = Math.ceil(rounded);
			else rounded = Math.round(rounded);
			for(let i=0; i<decimals;i++) rounded /= 10;
			return rounded;
		} 
		
		function lenDecimals(num){
			var altNum = num,
			    decimals = 0;
			while((Math.round(altNum) - altNum)!=0){
				altNum *= 10;
				decimals++;
			}
			return parseFloat(decimals);
		}
		
		function drawCanvas(){
			let nuevolci = lci;
			nuevolci.push(lcs[lcs.length-1]);
			console.log(nuevolci);
			var dataset1 = {
				type: 'bar',
				data: {
					labels: nuevolci,
					datasets: [{
						data: fi,
						backgroundColor: 'rgba(0,223,255,.4)',
						borderColor: '#007bff',
						borderWidth: 2
					}]	
				},
				options: {
					title: {
						display: true,
						text: 'Histograma',
						fontSize: 18
					},
					legend: {
						display: false
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}],
						xAxes: [{
							display: false,
							barPercentage: 1.3,
							ticks: {
								max: nuevolci[nuevolci.length-2]
							}
						},{
							display: true,
							ticks: {
								autoSkip: false,
								max: nuevolci[nuevolci.length-1]
							}
						}]
					},
					"animation": {
					"duration": 1,
					"onComplete": function() {
					var chartInstance = this.chart,
					ctx = chartInstance.ctx;
					
					ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
					ctx.textAlign = 'end';
					ctx.textBaseline = 'bottom';
					
					this.data.datasets.forEach(function(dataset, i) {
					var meta = chartInstance.controller.getDatasetMeta(i);
					meta.data.forEach(function(bar, index) {
					var data = dataset.data[index];
					ctx.fillText(data, bar._model.x+5, bar._model.y-5);
					});
					});
					}
					}
				}
			};
			var dataset2 = {
				type: 'line',
				data: {
					labels: xi,
					datasets: [{
						data: fi,
						backgroundColor: 'rgba(255, 99, 132, .4)',
						borderColor: 'rgba(255, 99, 132, 1)',
						borderWidth: 2,
						lineTension: 0
					}]
				},
				options: {
					title: {
						display: true,
						text: 'Polígono de frecuencias',
						fontSize: 18
					},
					legend: {
						display: false
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					}
				}
			};
			var dataset3 = {
				type: 'line',
				data: {
					labels: xi,
					datasets: [{
						data: Fi,
						backgroundColor: 'rgba(255, 206, 86, .4)',
						borderColor: 'rgba(255, 206, 86, 1)',
						borderWidth: 2,
						fill: false,
						pointStyle: 'rect'
					}]
				},
				options: {
					title: {
						display: true,
						text: 'Ojiva',
						fontSize: 18
					},
					legend: {
						display: false
					},
					scales: {
						yAxes: [{
							ticks: {
								beginAtZero: true
							}
						}]
					}
				}
			};
			
			if(arrayCharts.length != 0){
				for(let i=0; i<arrayCharts.length; i++){
					arrayCharts[i].destroy();
				}
			}
			
			var canvasHist = new Chart(ctx1, dataset1);
			var canvasPoli = new Chart(ctx2, dataset2);
			var canvasOjiv = new Chart(ctx3, dataset3);
			
			arrayCharts = [canvasHist, canvasPoli, canvasOjiv];
		}
		
		function calcMedia(){ //calcula la media aritmética
			let sum = 0;
			let media = 0;
			for(let i=0; i<k; i++) sum += fi[i] * xi[i]
			media = getRound(sum/n, rlen+1);
			return media;
		}
		
		function calcMediana(){ //calcula la mediana de los datos
			let indexMedClass = 0; //posición de la clase mediana
			let mediana = 0;
			for(let i=0; i<k; i++){
				if(Fi[i]>(n/2)){
					indexMedClass = i;
					break;
				}
			}
			mediana = lci[indexMedClass] + ((n/2 - Fi[indexMedClass - 1])/fi[indexMedClass])*c;
			return getRound(mediana,rlen);
		}
		
		function calcModa(){ //calcula la moda
			let moda = 0;
			let indexModClass = fi.indexOf(Math.max(...fi));
			let d1 = fi[indexModClass] - fi[indexModClass-1];
			let d2 = -fi[indexModClass+1] + fi[indexModClass];
			moda = lci[indexModClass] + (d1/(d1+d2))*c;
			return getRound(moda, rlen);
		}
		
		function showTrendingM(){
			let showT = "<tr>";
			let trendingMes = [calcMedia(), calcMediana(), calcModa()]; //medidas de tendencia
			let trendingNam = ["Media","Mediana","Moda"]; //nombres de las medidas
			for(let i=0; i<trendingMes.length; i++) showT += "<th class=\"td-left td-purple\">"+trendingNam[i]+"</th><td>"+trendingMes[i].toFixed(rlen+1)+"</td></tr>";
			MTC.innerHTML = showT;
		}
		
		function showDispersionM(){
			let showD = "<tr>";
			let dispersionMes = [n,min,max,r,k,c]; //Medidas de dispersión
			let dispersionNam = ["N","mín.", "máx.","Rango","K","A"]; //Nombre de esas medidas
			for(let i=0; i<dispersionMes.length; i++) showD += "<th class=\"td-blue\">"+dispersionNam[i]+"</th><td>"+dispersionMes[i]+"</td></tr>"
			dispersionM.innerHTML = showD;
		}
		
		function createTable(){
			if(document.form.datos.value){
				datos = document.form.datos.value.split(',').map(Number);
				n = datos.length;
				min = Math.min(...datos);
				max = Math.max(...datos);
				rlen = lenDecimals(min);
				r = getRound(Math.abs(max - min), rlen);
				fi    = [];									          //Frecuencia: cuántos datos hay en el intervalo
				lci   = []; 						                      //Límites de clase inferior
				lri   = []; 								              //Límites de clase real inferior
				lcs   = [];								                  //Límite de clase superior
				lrs   = []; 						                      //Límites de clase real superior
				xi    = [];								                  //Marca de clase
				Fi    = [];								                  //Frecuencia acumulada
				hi    = []; 						                   	  //Frecuencia relativa
				Hi    = []; 								              //Frecuencia relativa acumulada
				hip   = [];
				if(document.form.inputK.value) k = document.form.inputK.value;
				else{ 
					if(n<40) k = Math.round(Math.sqrt(n));
					else k = Math.round(1 + 3.32 * Math.log10(n));
				}
				if(document.form.inputA.value){
					c = getRound(r/k, document.form.inputA.value,true);
					rlen = document.form.inputA.value;
				}
				else c = getRound(r/k,rlen,true);
				console.log([k, r, rlen, c]);
				localStorage.setItem("data", datos);
				var show = "<tr class=\"td-blue\"><th>Li - Ls</th><th>Lri - Lrs</th><th>x<sub>i</sub></th><th>f<sub>i</sub></th><th>F<sub>i</sub></th><th>h<sub>i</sub></th><th>H<sub>i</sub></th><th>h<sub>i</sub>%</th></tr>";
				for(let i=0; i<k; i++){
					if(i==0){
						lci[i] = min;
						lri[i] = getRound(min - Math.pow(10,(-rlen))/2,rlen+1); 
					}
					else{
						lci[i] = getRound(lci[i-1] + c, rlen);
						lri[i] = getRound(lci[i-1] - Math.pow(10,(-rlen))/2,rlen+1);
					}
					lcs[i] = getRound(lci[i] + c,rlen+1);
					lrs[i] = getRound(lcs[i] + Math.pow(10,(-rlen))/2,rlen+1);
					xi[i] = getRound((lcs[i] + lci[i])/2,rlen+1);
					let count = 0;
					for(let j=0; j<n; j++){
						if((k - i)>1){
							if(datos[j]>=lci[i]&&datos[j]<lcs[i]) count++;
						}
						else{
							if(datos[j]>=lci[i]&&datos[j]<=lcs[i]) count++;
						}
					}
					fi[i] = count;
					hi[i] = parseFloat((fi[i]/n).toFixed(rlen+3));
					hip[i] = (hi[i] * 100).toFixed(1);
					if(i==0){
						Fi[i] = fi[i];
						Hi[i] = hi[i];
					}
					else{
						Fi[i] = Fi[i-1] + fi[i];
						Hi[i] = parseFloat((Hi[i-1] + hi[i]).toFixed(rlen+3));
					}
					show += "<tr><td>["+lci[i]+" - "+lcs[i]+"[</td><td>["+lri[i]+" - "+lrs[i]+"[</td><td>"+xi[i]+"</td><td>"+fi[i]+"</td><td>"+Fi[i]+"</td><td>"+hi[i]+"</td><td>"+Hi[i]+"</td><td>"+hip[i]+" %</td></tr>";
				}
				table.innerHTML = show;
				drawCanvas();
				showDispersionM();
				showTrendingM();
				for(let l=0; l<2; l++) dNones[l].classList.remove('d-none');
			}
		}
		
		Chart.plugins.register({
			beforeDraw: function(chartInstance) {
			var ctx = chartInstance.chart.ctx;
				ctx.fillStyle = "white";
				ctx.fillRect(0, 0, chartInstance.chart.width, chartInstance.chart.height);
			}
		});
		
		const ctx1 = histograma.getContext('2d'),
		      ctx2 = poligono.getContext('2d'),
		      ctx3 = ojiva.getContext('2d');
		      
		var dNones = document.getElementsByClassName('canvas'); //array de div canvas
		
		var datos = [], //Datos
			n     = 0,  //Cantidad de datos
			max   = 0,  //El menor valor
			min   = 0,  //El mayor valor
			r     = 0,  //Rango 
			rlen  = 0,  //Longitud de decimales del rango, servirá para los redondeos
			k     = 0,  //Cantidad de intervalos o clases
			c     = 0,  //Amplitud de clase
			fi    = [], //Frecuencia: cuántos datos hay en el intervalo
			lci   = [], //Límites de clase inferior
			lri   = [], //Límites de clase real inferior
			lcs   = [],	//Límite de clase superior
			lrs   = [], //Límites de clase real superior
			xi    = [],	//Marca de clase
			Fi    = [],	//Frecuencia acumulada
			hi    = [], //Frecuencia relativa
			Hi    = [], //Frecuencia relativa acumulada
			hip   = []; //Frecuencia relativa porcentual
		
		if(localStorage.getItem("data")) document.form.datos.value = localStorage.getItem("data");
		
		var datoArchivo = [];
		var arrayCharts = [];
		
		btn.addEventListener('click', createTable);
		cleanBtn.addEventListener('click', clearTextarea);
		showMTC.addEventListener('click', () => {
			trendingM.classList.toggle('d-none');
		});
		showCharts.addEventListener('click', function (){
			for(let i=2; i<dNones.length; i++) dNones[i].classList.toggle('d-none');
		});
		btnFile.addEventListener('click', function(){
			archivo.click();
		});
		archivo.addEventListener('change', readCsv);
		downloadA.addEventListener('click', () => {
			let canvasurl = document.getElementById("histograma").toDataURL("image/jpeg", 1.0);
			downloadA.setAttribute("href", canvasurl);
		});
		downloadB.addEventListener('click', () => {
			let canvasurl = document.getElementById("poligono").toDataURL("image/jpeg", 1.0);
			downloadB.setAttribute("href", canvasurl);
		});
		downloadC.addEventListener('click', () => {
			let canvasurl = document.getElementById("ojiva").toDataURL("image/jpeg", 1.0);
			downloadC.setAttribute("href", canvasurl);
		});
		btnInfo.addEventListener('click', () => {
			divInfo.classList.toggle('d-none');
		});
		btnInputs.addEventListener('click', () => {
			inputs.classList.toggle('d-none');
		});
		scrollUp.addEventListener('click', () => {
			divInfo.classList.toggle('d-none');
		});