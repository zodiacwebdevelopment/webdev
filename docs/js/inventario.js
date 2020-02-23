function Producto(nombre, sabor, precio, stock, cantidad){
  this.nombre = nombre;
  this.sabor = sabor;
  this.precio = precio;
  this.stock = stock;
}

function limitar(i){
  var element = document.getElementById("input"+i);
  element.setAttribute("min","1");
  element.setAttribute("max", producto[i].stock);
}

function validar(i){
  var form = document.getElementById("input"+i);
  
  if(!form.checkValidity()){
    form.classList.add("is-invalid");
    invalidado = true;
    return false;
  }
  else{
    form.classList.remove("is-invalid");
    return true;
  }
}

function obtenerFecha(){
  var d = new Date();
  var dia = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
  var mes = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
  var fecha = document.getElementById("fecha");
  var date = dia[d.getDay()]+", "+d.getDate()+" de "+mes[d.getMonth()]+" del "+d.getFullYear()+"<br>Hora: "+d.getHours()+":"+d.getMinutes();
  
  return date;
}

function agregar(){
  for(var i=0; i<producto.length; i++){
    var row = document.getElementsByTagName("tr")[i+1];    
    row.classList.remove("table-danger");    
    var input = document.getElementById("input"+i); 
    input.classList.remove("is-invalid");   
    
    if(input.value){
      producto[i].stock = parseInt(producto[i].stock)+parseInt(input.value);
    }
    
    if(producto[i].stock <= 0){
      row.classList.add("table-danger");
    }
    else{
      limitar(i);
    }
    
    document.getElementById("input"+i).value = "";;
    localStorage.setItem("stock"+i, producto[i].stock);
    document.getElementById("tdStock"+i).innerHTML = producto[i].stock;
  }
}

function quitar(){
  for(var i=0; i<producto.length; i++){    
    
    var row = document.getElementsByTagName("tr")[i+1];    
    var input = document.getElementById("input"+i);    
  
    if(input.value&&validar(i)){
      producto[i].stock = parseInt(producto[i].stock)-parseInt(input.value);   
  
      if(producto[i].stock <= 0){
        row.classList.add("table-danger");
      }
      else{
        limitar(i);
        row.classList.remove("table-danger");    
      }
      
      document.getElementById("input"+i).value = "";
    }
    
    localStorage.setItem("stock"+i, producto[i].stock);
    document.getElementById("tdStock"+i).innerHTML = producto[i].stock;
  }
}

function reemplazar(){
  for(var i=0; i<producto.length; i++){
    var row = document.getElementsByTagName("tr")[i+1];    
    row.classList.remove("table-danger");
    row.classList.remove("table-warning");    
    var input = document.getElementById("input"+i);    
    input.classList.remove("is-invalid");   
  
    if(input.value){
	  producto[i].stock = parseInt(input.value);
    }
  
    if(producto[i].stock <= 0){
	  row.classList.add("table-danger");
    }
    else{
      limitar(i);
    }
  
    input.value = "";
    localStorage.setItem("stock"+i, producto[i].stock);
    document.getElementById("tdStock"+i).innerHTML = producto[i].stock;
  }
}

function limpiar(){
  for(var i=0; i<producto.length; i++){
	  var row = document.getElementsByTagName("tr")[i+1];    
	  row.classList.remove("table-danger");    
	  var input = document.getElementById("input"+i);    
	  producto[i].stock = 0;
	  
	  if(producto[i].stock <= 0){
	    row.classList.add("table-danger");
	  }
	  
	  document.getElementById("input"+i).value = "";
	  localStorage.setItem("stock"+i, producto[i].stock);
	  document.getElementById("tdStock"+i).innerHTML = producto[i].stock;
  }
}

function comprar(){
  confirmado = false;
  Comprar = true;
  document.getElementById("listaCompras").innerHTML = "";
  document.getElementById("botones2").classList.add("invisible");
  document.getElementById("imprime").classList.add("invisible");
  //compra = [0];
  
  for(var i=0; i<producto.length; i++){
    var input = document.getElementById("input"+i);
    var vinput = parseInt(input.value);    
    var st = document.getElementById("tdStock"+i);
    
    if(input.value&&validar(i)&&(!invalidado)){
      producto[i].cantidad = vinput;
      compra.push(producto[i]);
      ies[i] = i;
      st.innerHTML = parseInt(producto[i].stock) - vinput;
      st.classList.add("text-muted");
	  //localStorage.setItem("stock"+i, producto[i].stock); 
	       
	  if(vinput>=producto[i].stock){
	    document.getElementsByTagName("tr")[i+1].classList.add("table-warning");
	  }   
	  else{
	    //limitar(i);
	  }
	  
	 // input.value = "";
    }
    else{
      st.classList.remove("text-muted");
      st.innerHTML = parseInt(producto[i].stock);
      producto[i].cantidad = 0;
    }
  }
  
  if(!invalidado){
    recibo();
  }
  else{
    compra = [0];
  }
  
  invalidado = false;
}

function recibo(){
  var container = document.getElementById("listaCompras");  
  var calculo = "";
  calculo = "<tr><th>Producto</th><th>Cantidad</th><th>Subtotal</th></tr>";
  var total = 0;
  
  for(var i=0; i<compra.length; i++){
    if(compra[i].cantidad){
      var subtotal = parseFloat(compra[i].precio) * parseInt(compra[i].cantidad); 
      calculo += "<tr class=\"text-monospace\"><td>"+compra[i].nombre+"-"+compra[i].sabor+"</td><td>×"+compra[i].cantidad+"</td><td>"+subtotal.toFixed(1)+"</td></tr>";
      total += subtotal;
	  localStorage.setItem("stock"+ies[i], compra[i].stock); 
    }
  }
  
  compra = [0];
  
  calculo += "<tfoot><th>Total</th><td></td><th class=\"text-monospace\">"+total.toFixed(1)+"</th></tfoot>";
  container.innerHTML = calculo;
  document.getElementById("botones2").classList.remove("invisible");
}

function confirmar(){
  if(Comprar){
  confirmado = true;
  document.getElementById("imprime").classList.remove("invisible");
  document.getElementById("fecha").innerHTML = obtenerFecha();
  
  for(var i=0; i<producto.length; i++){
    var st = document.getElementById("tdStock"+i);
    st.classList.remove("text-muted");
    
    if(producto[i].cantidad){
      var calc= parseInt(producto[i].stock) - parseInt(producto[i].cantidad);
      st.innerHTML = calc;
	  producto[i].stock = calc;
	  localStorage.setItem("stock"+i, calc); 
    
      if(calc<=0){
        document.getElementsByTagName("tr")[i+1].classList.remove("table-warning");
        document.getElementsByTagName("tr")[i+1].classList.add("table-danger");    
      } 
      else{
        limitar(i);
      }
    }
    
    document.getElementById("input"+i).value = "";
    producto[i].cantidad = 0;
  }
  
  compra = [0];
  Comprar = false;
  }
}

function cancelar(){
  if(!confirmado&&Comprar){
    for(var i=0; i<producto.length; i++){
	    document.getElementsByTagName("tr")[i+1].classList.remove("table-warning");    
	    var st = document.getElementById("tdStock"+i);
	    st.classList.remove("text-muted");
	    st.innerHTML = producto[i].stock;
	    localStorage.setItem("stock"+i, producto[i].stock); 
        document.getElementById("input"+i).value = "";
    }
    
    document.getElementById("listaCompras").innerHTML = "";
    document.getElementById("botones2").classList.add("invisible");
  }
  
  compra = [0];
  Comprar = false;
}

function imprimir(){
  if(confirmado){ 
    window.print()
    document.getElementById("imprime").classList.add("invisible");
  }
}

show = "";
invalidado = false;
Comprar = false;
confirmado = false;
tbody = document.getElementById("tbody");
compra = [];
ies = [];
producto = [];

producto.push(new Producto("gelatina", "fresa", 1.0, localStorage.getItem("stock"+producto.length)));
producto.push(new Producto("gelatina", "naranja", 1.0, localStorage.getItem("stock"+producto.length)));
producto.push(new Producto("gelatina", "piña", 1.0, localStorage.getItem("stock"+producto.length)));
producto.push(new Producto("flan", "vainilla", 1.0, localStorage.getItem("stock"+producto.length)));

for(var i=0; i<producto.length; i++){
  show += "<tr><td>"+producto[i].nombre+"</td><td>"+producto[i].sabor+"</td><td>"+producto[i].precio.toFixed(2)+"</td><td id=\"tdStock"+i+"\">"+localStorage.getItem("stock"+i)+"</td><td class=\"botones\"><input type=\"number\" class=\"form-control\" id=\"input"+i+"\" min=\"1\" max=\""+producto[i].stock+"\"></td></tr>";  
}

tbody.innerHTML = show;

for(var i=0; i<producto.length; i++){
  if(producto[i].stock <= 0){
    document.getElementsByTagName("tr")[i+1].classList.add("table-danger");
  }
}