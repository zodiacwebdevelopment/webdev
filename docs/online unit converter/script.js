let pInputs = document.getElementsByClassName("pInput");
let dInputs = document.getElementsByClassName("dInput");

let pFactors = [10000000,1019400,101940,1019400000,98692,75006158,75006158,1450380,208854000,100000];
let dFactors = [18,180,90,10];

function roundTo(number, decimals){
  let power = Math.pow(10, decimals);
  number *= power;
  rounded = Math.round(number);
  rounded /= power;
  return rounded;
}

function returnHandler(index, array, arrayFactors, exp){
  return function(){
    let value = Number(array[index].value);
    for(j=0; j<array.length; j++){
      let aValue = value * arrayFactors[j]/arrayFactors[index];
      array[j].value = roundTo(aValue,exp);
    }
  }
}

for(i=0; i<pInputs.length; i++){
  pInputs[i].addEventListener('input', returnHandler(i,pInputs,pFactors, 5));
}

for(i=0; i<dInputs.length; i++){
  dInputs[i].addEventListener('input', returnHandler(i,dInputs,dFactors, 2));
}

let inst = document.getElementById("instructions");

function showInst(){
  inst.classList.toggle("show");
}
