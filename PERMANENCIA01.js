
const titulo = document.getElementById("titulo");
const boton = document.getElementById("btnCambiar");

boton.addEventListener("click", () => {

  titulo.textContent = "Texto cambiado con JavaScript";

  titulo.style.color = "green";

});



const parrafoEstilo = document.getElementById("parrafoEstilo");
const btnEstilo = document.getElementById("btnEstilo");

btnEstilo.addEventListener("click", () => {

  parrafoEstilo.style.color = "red";

  parrafoEstilo.style.fontSize = "20px";

  parrafoEstilo.style.fontWeight = "bold";

});


const lista = document.getElementById("lista");
const btnAgregar = document.getElementById("btnAgregar");

btnAgregar.addEventListener("click", () => {

  const li = document.createElement("li");

  li.textContent = "JavaScript";

  lista.appendChild(li);

});

const btn = document.getElementById("btn");

btn.addEventListener("click", () => {

  console.log("Se hizo clic");

  alert("¡Botón presionado!");

});

const resultadoTeclado =
  document.getElementById("resultadoTeclado");

document.addEventListener("keydown", (evento) => {

  console.log("Tecla:", evento.key);

  resultadoTeclado.textContent =
    "Presionaste: " + evento.key;

});
const formulario =
  document.getElementById("formulario");

const resultadoFormulario =
  document.getElementById("resultadoFormulario");

formulario.addEventListener("submit", (evento) => {

  evento.preventDefault();

  const nombre =
    document.getElementById("nombre").value;

  console.log("Nombre:", nombre);

  resultadoFormulario.textContent =
    "Dato guardado: " + nombre;

});