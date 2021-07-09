let inputs = document.getElementsByClassName("input");

let factors = [1,0.10194,0.010194,101.904,0.00987,7.50062,7.50062,0.145038,20.8854,0.01];

function roundTo(number, decimals){
  let power = Math.pow(10, decimals);
  number *= power;
  rounded = Math.round(number);
  rounded /= power;
  return rounded;
}

function returnHandler(index){
  return function(){
    let value = Number(inputs[index].value);
    for(j=0; j<inputs.length; j++){
      let aValue = value * factors[j]/factors[index];
      inputs[j].value = roundTo(aValue,5);
    }
  }
}

for(i=0; i<inputs.length; i++){
  inputs[i].addEventListener('change', returnHandler(i));
}