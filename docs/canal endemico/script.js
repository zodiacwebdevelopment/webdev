//Nice labels algoritm for chart
const ntick = 10;

function niceNum(x, round) {
  let exp = 0;
  let f = 0;
  let nf = 0;

  exp = Math.floor(Math.log10(x));
  f = x / Math.pow(10, exp);

  if (round) {
    if (f < 1.5) nf = 1;
    else if (f < 3) nf = 2;
    else if (f < 7) nf = 5;
    else nf = 10;
  } else {
    if (f <= 1) nf = 1;
    else if (f <= 2) nf = 2;
    else if (f <= 5) nf = 5;
    else nf = 10;
  }

  return nf * Math.pow(10, exp);
}

function looseLabel(min, max) {
  let nfrac = 0;
  let d = 0;
  let graphmin,
    graphmax = 0;
  let range = 0;
  let x = [];

  range = niceNum(max - min, false);
  d = niceNum(range / (ntick - 1));
  graphmin = Math.floor(min / d) * d;
  graphmax = Math.ceil(max / d) * d;
  nfrac = Math.max(-Math.floor(Math.log10(d)), 0);

  for (let i = graphmin; i < graphmax + 0.5 * d; i += d) {
    x.push(i.toFixed(nfrac));
  }

  console.log(
    range + "\n" + d + "\n" + graphmin + "\n" + graphmax + "\n" + nfrac
  );
  return {
    labels: x,
    ticks: d,
    exp: nfrac,
    range: range,
    min: graphmin,
    max: graphmax,
  };
}
//END of nice labels

function appendRowsAndCols(rows, cols) {
  //setea los valores de filas y columnas proporcionadas por el usuario
  document.myForm.innerHTML = "";
  rows = Number(rows);
  cols = Number(cols);
  for (let i = 0; i < rows; i++) {
    let newRow = document.createElement("div");
    let className = "";

    for (let k = 0; k < cols; k++) {
      let newInput = document.createElement("input");

      className = "row" + i + " col" + k;
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

function parseCSVFile() {
  if (inputFile.files[0]) {
    let file = inputFile.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function () {
      file = reader.result;
      parsedMatrix = Papa.parse(file, { dynamicTyping: true }).data;

      let csvRows = parsedMatrix.length;
      let csvCols = parsedMatrix[0].length;

      appendRowsAndCols(
        csvRows + rowControler - lastRowControler,
        csvCols + colControler
      );

      for (let i = 0; i < csvRows - lastRowControler; i++) {
        let inputs = document.getElementsByClassName(
          "row" + Number(i + rowControler)
        );

        for (let j = 0; j < csvCols; j++) {
          inputs[Number(j + colControler)].value = parsedMatrix[i][j];
        }
      }
    };
  } else {
    console.log("No se ha cargado ningún archivo");
  }
}

function sortValues() {
  //creates an inverted matrix of the form and sorts values by row
  let rows = parsedMatrix.length + 1;
  let cols = parsedMatrix[0].length + 1;

  valuesMatrix = [];

  for (let i = 1 - colControler; i < cols - lastRowControler - 1; i++) {
    let valuesVector = [];
    //let inputs = document.getElementsByClassName("col"+i);

    for (let j = 1 - rowControler; j < rows - lastRowControler - 1; j++) {
      valuesVector.push(parsedMatrix[j][i]);
    }
    valuesVector.sort(function (a, b) {
      return a - b;
    });
    valuesMatrix.push(valuesVector);
  }
}

function showSortedMatrix() {
  //creates a table element containing the matrix and appends it to the divSortedMatrix element
  divSortedMatrix = document.getElementById("divSortedMatrix");
  divSortedMatrix.innerHTML = "";
  quartilesMatrix = [];
  let newTable = document.createElement("table");

  for (let i = 0; i < quartiles.length; i++) {
    let quartilesVector = [];
    newTableRow = document.createElement("tr");

    for (let j = 0; j < valuesMatrix.length; j++) {
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

function downloadCanvas() {
  let canvasURL = canvas.toDataURL("img/jpeg", 1.0);
  let a = document.createElement("a");
  a.setAttribute("href", canvasURL);
  a.setAttribute("download", "Canal_endémico.jpeg");
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function drawCanvas() {
  let ctx = canvas.getContext("2d");
  let range = 300;
  let maxValues = quartilesMatrix.map((item) => {
    return Math.max(...item);
  });

  function getMax() {
    let sum = 0;
    for (let i = 0; i < maxValues.length; i++) {
      sum += maxValues[i];
    }
    return sum;
  }

  canvas.width = 1200;
  canvas.height = 900;

  let factorWidth = 0.9;
  let factorHeight = 0.8;

  ctx.fillStyle = "rgb(255,255,255)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  let min = 0;
  let max = getMax();

  //Nice Numbers Object
  let nno = looseLabel(min, max);

  let labelsY = nno.labels;

  function drawLabels() {
    for (let i = 0; i < labelsY.length; i++) {
      let y =
        canvas.height -
        (labelsY[i] * (canvas.height * factorHeight)) / nno.max -
        ((1 - factorHeight) * canvas.height) / 2;
      ctx.beginPath();
      ctx.moveTo((1 - factorWidth) * canvas.width, y);
      ctx.lineTo(canvas.width, y);
      ctx.lineWidth = 1;
      ctx.strokeStyle = i === 0 ? "#000000" : "#aaaaaa";
      ctx.stroke();
      ctx.fillStyle = "#000000";
      ctx.font = "20px Arial";
      ctx.textAlign = "right";
      ctx.fillText(labelsY[i], (0.98 - factorWidth) * canvas.width, y);
    }
  }

  max = nno.range;

  let dataset1 = quartilesMatrix[0].map((item) => {
    return canvas.height - (item * factorHeight * canvas.height) / max;
  });
  let dataset2 = quartilesMatrix[1].map((item, index) => {
    item *= (factorHeight * canvas.height) / max;
    return dataset1[index] - item;
  });
  let dataset3 = quartilesMatrix[2].map((item, index) => {
    item *= (factorHeight * canvas.height) / max;
    return dataset2[index] - item;
  });

  let datasets = [dataset3, dataset2, dataset1];

  let dataset4 = [];

  if (lastRowControler) {
    let incidenceRow = parsedMatrix[parsedMatrix.length - 1].slice(1);
    console.log(incidenceRow);
    dataset4 = incidenceRow.map((item) => {
      if (typeof item === "number")
        return canvas.height - (item * factorHeight * canvas.height) / max;
    });

    datasets.push(dataset4);
    console.log(dataset4);
  }

  let strokeColors = [
    "rgb(234,67,53)",
    "rgb(251,188,4)",
    "rgb(66,133,244)",
    "rgb(0,0,0)",
  ];
  let fillColors = ["rgb(249,198,194)", "rgb(254,235,179)", "rgb(198,218,252)"];

  for (let i = 0; i < datasets.length; i++) {
    let x,
      y,
      dx = 0;

    dx = (canvas.width * factorWidth) / (datasets[0].length - 1);

    ctx.beginPath();
    ctx.moveTo(
      (1 - factorWidth) * canvas.width,
      datasets[i][0] - 0.1 * canvas.height
    );

    for (let j = 0; j < datasets[0].length; j++) {
      x = dx * j + (1 - factorWidth) * canvas.width;
      y = datasets[i][j] - 0.1 * canvas.height;
      if (typeof y === "number") {
        ctx.lineTo(x, y);
      }
    }
    ctx.strokeStyle = strokeColors[i];
    ctx.lineWidth = 6;
    if(i===3){
      ctx.lineWidth = 3;
    }
    ctx.stroke();
    ctx.lineTo(x,0.9*canvas.height);
    ctx.lineTo(canvas.width*(1-factorWidth),0.9*canvas.height);
    ctx.closePath();
    if(i!==3){
      ctx.fillStyle = fillColors[i];
      ctx.fill();
    }
  }

  drawLabels();

  let btnDownloadGraph = document.getElementById("downloadGraph");
  btnDownloadGraph.classList.add("show");
  btnDownloadGraph.addEventListener("click", downloadCanvas);
}

function calculate() {
  if (document.myForm.innerHTML !== "") {
    sortValues();
    let n = valuesMatrix[0].length;
    quartil1 = Math.round(((n + 1) * 1) / 4) - 1;
    quartil2 = Math.round(((n + 1) * 2) / 4) - 1;
    quartil3 = Math.round(((n + 1) * 3) / 4) - 1;
    quartiles = [quartil1, quartil2, quartil3];
    showSortedMatrix();
    drawCanvas();
  } else {
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
headerRow.addEventListener("change", function () {
  rowControler = headerRow.checked ? 0 : 1;
});
let headerCol = document.getElementById("headerCol");
headerCol.addEventListener("change", function () {
  colControler = headerCol.checked ? 0 : 1;
});
let lastRow = document.getElementById("lastRow");
lastRow.addEventListener("change", function () {
  lastRowControler = lastRow.checked ? 1 : 0;
});

let divSortedMatrix = document.getElementById("divSortedMatrix");

let divCanvas = document.getElementById("divCanvas");

let canvas = document.getElementById("myChart");
