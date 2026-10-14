/* ============================================================
   CONFIGURACIÓN DE EMAILJS
   Reemplaza los tres valores por TUS credenciales
   (EmailJS → Account → Public Key / Email Services / Email Templates)
   ============================================================ */
const EMAILJS_PUBLIC_KEY = "jwo2NPevOD2bWfRpe";
const EMAILJS_SERVICE_ID = "correos_Paloma";
const EMAILJS_TEMPLATE_ID = "template_1234";

// Correo personal o institucional que recibe el mensaje
const CORREO_DESTINO = "2511120024@undc.edu.pe";

// Inicializar EmailJS (igual que en la Praxis del profesor)
(function () {
    emailjs.init(EMAILJS_PUBLIC_KEY);
})();

const formulario = document.getElementById("formulario");
const btnEnviar = document.getElementById("btnEnviar");
const estado = document.getElementById("estado");

const campos = {
    nombre: document.getElementById("nombre"),
    email: document.getElementById("email"),
    mensaje: document.getElementById("mensaje")
};

/* ---------- Mensajes en pantalla ---------- */
function mostrarEstado(tipo, texto) {
    estado.className = "estado visible " + tipo;
    estado.textContent = texto;
}

function ocultarEstado() {
    estado.className = "estado";
    estado.textContent = "";
}

/* ---------- Validación ---------- */
function validarCampo(nombreCampo) {
    const input = campos[nombreCampo];
    const valor = input.value.trim();
    let mensajeError = "";

    if (nombreCampo === "nombre") {
        if (valor.length < 3) {
            mensajeError = "Escribe tu nombre completo (mínimo 3 letras).";
        } else if (!/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'.-]+$/.test(valor)) {
            mensajeError = "El nombre solo puede contener letras y espacios.";
        }
    }

    if (nombreCampo === "email") {
        const patronEmail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (valor === "") {
            mensajeError = "El correo electrónico es obligatorio.";
        } else if (!patronEmail.test(valor)) {
            mensajeError = "Ingresa un correo válido, por ejemplo nombre@correo.com.";
        }
    }

    if (nombreCampo === "mensaje") {
        if (valor.length < 10) {
            mensajeError = "El mensaje debe tener al menos 10 caracteres.";
        } else if (valor.length > 500) {
            mensajeError = "El mensaje no puede superar los 500 caracteres.";
        }
    }

    document.getElementById("error-" + nombreCampo).textContent = mensajeError;
    input.classList.toggle("invalido", mensajeError !== "");
    return mensajeError === "";
}

function validarFormulario() {
    // Se validan todos (sin cortar en el primero) para mostrar todos los errores
    const resultados = Object.keys(campos).map(validarCampo);
    return resultados.every(Boolean);
}

// Validación en vivo: al salir del campo y mientras corriges un error
Object.keys(campos).forEach(function (nombreCampo) {
    campos[nombreCampo].addEventListener("blur", function () {
        validarCampo(nombreCampo);
    });
    campos[nombreCampo].addEventListener("input", function () {
        if (campos[nombreCampo].classList.contains("invalido")) {
            validarCampo(nombreCampo);
        }
    });
});

/* ---------- Envío con EmailJS ---------- */
formulario.addEventListener("submit", function (e) {
    e.preventDefault(); // evitar recarga del formulario
    ocultarEstado();

    if (!validarFormulario()) {
        mostrarEstado("error", "Revisa los campos marcados en rojo antes de enviar.");
        return;
    }

    if (!navigator.onLine) {
        mostrarEstado("error", "No hay conexión a Internet. Verifica tu red e inténtalo de nuevo.");
        return;
    }

    const nombre = campos.nombre.value.trim();
    const email = campos.email.value.trim();
    const mensaje = campos.mensaje.value.trim();

    // Parámetros de la plantilla de EmailJS.
    // Se incluyen los nombres de tu plantilla (name, nombre, email, tiempo, mensaje)
    // y los de la Praxis (from_name, from_email, message) por compatibilidad.
    const parametros = {
        name: nombre,
        nombre: nombre,
        email: email,
        tiempo: new Date().toLocaleString("es-PE"),
        mensaje: mensaje,
        to_email: CORREO_DESTINO,
        from_name: nombre,
        from_email: email,
        message: mensaje
    };

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    mostrarEstado("cargando", "Enviando tu mensaje, un momento por favor...");

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, parametros)
        .then(function (res) {
            console.log("Respuesta:", res);
            mostrarEstado("exito", "¡Listo! Tu mensaje se envió correctamente. Revisa tu bandeja de entrada (y spam).");
            formulario.reset();
            Object.keys(campos).forEach(function (c) {
                campos[c].classList.remove("invalido");
                document.getElementById("error-" + c).textContent = "";
            });
        })
        .catch(function (err) {
            console.error("Error:", err);
            let detalle = "No se pudo enviar el correo. Inténtalo nuevamente.";
            if (err && err.status === 0) {
                detalle = "No se pudo conectar con EmailJS. Revisa tu conexión a Internet.";
            } else if (err && (err.status === 400 || err.status === 401 || err.status === 403)) {
                detalle = "Error de configuración: revisa tu Public Key, Service ID y Template ID.";
            }
            mostrarEstado("error", detalle);
        })
        .finally(function () {
            btnEnviar.disabled = false;
            btnEnviar.textContent = "Enviar mensaje";
        });
});
