let pInputs = document.getElementsByClassName("pInput");
let dInputs = document.getElementsByClassName("dInput");

let pFactors = [1,0.10194,0.010194,101.904,0.00987,7.50062,7.50062,0.145038,20.8854,0.01];
let dFactors = [1,10,5,0.5556];

function roundTo(number, decimals){
  let power = Math.pow(10, decimals);
  number *= power;
  rounded = Math.round(number);
  rounded /= power;
  return rounded;
}

function returnHandler(index, array, arrayFactors){
  return function(){
    let value = Number(array[index].value);
    for(j=0; j<array.length; j++){
      let aValue = value * arrayFactors[j]/arrayFactors[index];
      array[j].value = roundTo(aValue,5);
    }
  }
}

for(i=0; i<pInputs.length; i++){
  pInputs[i].addEventListener('change', returnHandler(i,pInputs,pFactors));
}

for(i=0; i<dInputs.length; i++){
  dInputs[i].addEventListener('change', returnHandler(i,dInputs,dFactors));
}

let inst = document.getElementById("instructions");

function showInst(){
  inst.classList.toggle("show");
}