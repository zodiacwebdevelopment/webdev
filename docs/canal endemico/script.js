function appendRowsAndCols(rows, cols){    //setea los valores de filas y columnas proporcionadas por el usuario
  document.myForm.innerHTML = "";
  rows = Number(rows);
  cols = Number(cols);
  for(let i=0; i<rows; i++){
    let newRow = document.createElement("div");
    let className = "";

    for(let k=0; k<cols; k++){
      let newInput = document.createElement("input");

      className = "row"+i+" col"+k;
      newInput.setAttribute("class", className);
      newInput.setAttribute("type", "text");

      newRow.appendChild(newInput);
    }
    document.myForm.appendChild(newRow);
  }
}

/*
function setRowsAndCols(){
  rows = document.getElementById("rows").value;
  cols = document.getElementById("cols").value;

  if(rows && cols){
    appendRowsAndCols(rows, cols);
  }
  else {
    console.log("Debe ingresar tanto las filas como las columnas");
  }
}
*/

function parseCSVFile(){
  if(inputFile.files[0]){
    let file = inputFile.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function(){
      file = reader.result;
      parsedMatrix = Papa.parse(file, {dynamicTyping: true}).data;

      let csvRows = parsedMatrix.length;
      let csvCols = parsedMatrix[0].length;
    
      appendRowsAndCols(csvRows+rowControler-lastRowControler, csvCols+colControler);
    
      for(let i=0; i<csvRows-lastRowControler; i++){
        let inputs = document.getElementsByClassName('row'+Number(i+rowControler));

        for(let j=0; j<csvCols; j++){
          inputs[Number(j+colControler)].value = parsedMatrix[i][j];
        }
      }
    }
  }
  else {
    console.log("No se ha cargado ningún archivo");
  }
}

function sortValues(){    //creates an inverted matrix of the form and sorts values by row
  let rows = parsedMatrix.length+1;
  let cols = parsedMatrix[0].length+1;

  valuesMatrix = [];

  for(let i=1-colControler; i<cols-lastRowControler-1; i++){
    let valuesVector = [];
    //let inputs = document.getElementsByClassName("col"+i);

    for(let j=1-rowControler; j<rows-lastRowControler-1; j++){
      valuesVector.push(parsedMatrix[j][i]);
    }
    valuesVector.sort(function(a,b){
      return a-b;
    });
    valuesMatrix.push(valuesVector);
  }
}

function showSortedMatrix(){    //creates a table element containing the matrix and appends it to the divSortedMatrix element
  divSortedMatrix = document.getElementById("divSortedMatrix");
  divSortedMatrix.innerHTML = "";
  quartilesMatrix = [];
  let newTable = document.createElement("table");

  for(let i=0; i<quartiles.length; i++){
    let quartilesVector = [];
    newTableRow = document.createElement("tr");

    for(let j=0; j<valuesMatrix.length; j++){
      let content = valuesMatrix[j][quartiles[i]];
      newTableData = document.createElement("td");
      newTableData.textContent = content;
      quartilesVector.push(Number(content));
      newTableRow.appendChild(newTableData);
    }
    newTable.appendChild(newTableRow);
    quartilesMatrix.push(quartilesVector);
  }
  divSortedMatrix.appendChild(newTable);
}

function downloadCanvas(){
  let canvasURL = canvas.toDataURL("img/jpeg", 1.0);
  let a = document.createElement("a");
  a.setAttribute("href",canvasURL);
  a.setAttribute("download","Canal_endémico.jpeg");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function drawCanvas(){
  let ctx = canvas.getContext('2d');
  let range = 300;
  let maxValues = quartilesMatrix.map((item) => {
    return Math.max(...item);
  });

  function getMax(){
    let sum = 0;
    for(let i=0; i<maxValues.length; i++){
      sum += maxValues[i];
    }
    return sum;
  };

  max = getMax();

  canvas.width = 750;
  canvas.height = 300;

  ctx.fillStyle = "rgb(255,255,255)"
  ctx.fillRect(0,0,canvas.width,canvas.height);

  let dataset1 = quartilesMatrix[0].map((item) => {
    return canvas.height - (item*canvas.height/max);
  });
  let dataset2 = quartilesMatrix[1].map((item, index) => {
    item *= canvas.height/max;
    return dataset1[index]-item;
  });
  let dataset3 = quartilesMatrix[2].map((item, index) => {
    item *= canvas.height/max;
    return dataset2[index]-item;
  });

  let datasets = [dataset1, dataset2, dataset3];

  let dataset4 = [];

  if(lastRowControler){
    let incidenceRow = parsedMatrix[parsedMatrix.length-1].slice(1);
    console.log(incidenceRow);
    dataset4 = incidenceRow.map((item) => {
      if(typeof item === "number") return canvas.height-item*canvas.height/max
    })

    datasets.push(dataset4);
    console.log(dataset4);
  }

  let strokeColors = ["rgb(66,133,244)","rgb(251,188,4)","rgb(234,67,53)","rgb(0,0,0)"];
  let fillColors = ["rgb(198,218,252)","rgb(254,235,179)","rgb(249,198,194)"];

  for(let i=0; i<datasets.length; i++){
    let x, y, dx = 0;

    dx = canvas.width/datasets[0].length;

    ctx.beginPath();
    ctx.moveTo(0, datasets[i][0]);

    for(let j=0; j<datasets[0].length; j++){
      x = dx * j;
      y = datasets[i][j];
      if(typeof y === "number"){
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = strokeColors[i];
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.closePath();
  }

  let btnDownloadGraph = document.getElementById("downloadGraph");
  btnDownloadGraph.classList.add("show");
  btnDownloadGraph.addEventListener("click", downloadCanvas);
}

function calculate(){
  if(document.myForm.innerHTML !== ""){
    sortValues();
    let n = valuesMatrix[0].length;
    quartil1 = Math.round((n+1)*1/4)-1;
    quartil2 = Math.round((n+1)*2/4)-1;
    quartil3 = Math.round((n+1)*3/4)-1;
    quartiles = [quartil1, quartil2, quartil3];
    showSortedMatrix();
    drawCanvas();
  }
  else {
    console.log("Los datos no han sido ingresados");
  }
}

let valuesMatrix = [];
let sortedValuesMatrix = [];
let quartilesMatrix = [];
let parsedMatrix = [];

let rows = 0;
let cols = 0;

let quartil1 = 0;
let quartil2 = 0;
let quartil3 = 0;
let quartiles = [];

/*
let btnSetRows = document.getElementById("setRowsAndCols");
btnSetRows.addEventListener("click", setRowsAndCols);
*/

let btnCalculate = document.getElementById("calculate");
btnCalculate.addEventListener("click", calculate);

let inputFile = document.getElementById("inputFile");
let btnUploadFile = document.getElementById("btnUploadFile");
btnUploadFile.addEventListener("click", parseCSVFile);

let rowControler = 0;
let colControler = 0;
let lastRowControler = 1;

let headerRow = document.getElementById("headerRow");
headerRow.addEventListener("change", function(){
  rowControler = (headerRow.checked) ? 0 : 1;
});
let headerCol = document.getElementById("headerCol");
headerCol.addEventListener("change", function(){
  colControler = (headerCol.checked) ? 0 : 1;
});
let lastRow = document.getElementById("lastRow");
lastRow.addEventListener("change", function(){
  lastRowControler = (lastRow.checked) ? 1 : 0;
});

let divSortedMatrix = document.getElementById("divSortedMatrix");

let divCanvas = document.getElementById("divCanvas");

let canvas = document.getElementById('myChart');