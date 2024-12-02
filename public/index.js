
let programacionesRiego = []; // Array para almacenar las programaciones de riego

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('activar-notificaciones').addEventListener('click', solicitarPermisoNotificacion);
    solicitarPermisoNotificacion(); // Esto puede ser opcional, dependiendo de tu flujo
});
// Solicitar permiso para mostrar notificaciones
function solicitarPermisoNotificacion() {
if (Notification.permission !== 'granted') {
    Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
            console.log("Permiso de notificación concedido.");
        } else {
            console.log("Permiso de notificación denegado.");
        }
    });
} else {
    console.log("Permiso de notificación ya concedido.");
}
}

// Función para enviar notificaciones
function enviarNotificacion(mensaje) {
    if (Notification.permission === 'granted') {
        new Notification(mensaje);
    } else {
        console.error("Permiso de notificación no concedido.");
    }
}

solicitarPermisoNotificacion();




// Función para verificar las programaciones de riego
function verificarProgramaciones() {
    const ahora = new Date();
    programacionesRiego.forEach(programacion => {
        const fechaHora = new Date(programacion);
        const tiempoRestante = fechaHora - ahora;

        console.log(`Verificando programación: ${fechaHora.toLocaleString()}, Tiempo restante: ${tiempoRestante / 1000} segundos`);

        // Notificación 10 minutos antes
        if (tiempoRestante <= 10 * 60 * 1000 && tiempoRestante > 0) {
            enviarNotificacion(`¡Atención! La programación de riego para ${fechaHora.toLocaleString()} está a punto de comenzar.`);
        }

        // Notificación cuando es la hora de regar
        if (tiempoRestante <= 0 && tiempoRestante > -60000) { // Dentro de un minuto
            enviarNotificacion('¡Es hora del riego!');
        }
    });
}

// Llamar a la función de verificación cada minuto
setInterval(verificarProgramaciones, 60 * 1000);

// Función para simular datos de monitoreo
function realizarAccion() {
    fetch('http://localhost:3000/simular-datos') // Llamada al backend para obtener datos
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            actualizarGrafico(data); // Actualiza el gráfico con los nuevos datos
        })
        .catch((error) => console.error('Error:', error));
}

// Función para actualizar el gráfico
function actualizarGrafico() {
// Verificar si ya existe un gráfico y destruirlo
if (window.chart) {
window.chart.destroy();
}

// Generar nuevos datos dinámicamente
const nuevosDatos = [Math.random() * 100, Math.random() * 100, Math.random() * 100, Math.random() * 100];

// Crear un nuevo gráfico con los datos actualizados
window.chart = new Chart(document.getElementById('grafico').getContext('2d'), {
type: 'line',  // Tipo de gráfico
data: {
    labels: ['Enero', 'Febrero', 'Marzo', 'Abril'],  // Etiquetas de los ejes X
    datasets: [{
        label: 'Datos Actualizados',
        data: nuevosDatos,  // Datos actualizados
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
    }]
},
options: {
    responsive: true,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            enabled: true,
        }
    }
}
});
}


// Mostrar el formulario para agregar una programación de riego
function mostrarFormularioRiego() {
    console.log('Mostrando formulario');
    document.getElementById('formularioRiego').style.display = 'block';
}

// Cerrar el formulario de riego
function cerrarFormulario() {
    document.getElementById('formularioRiego').style.display = 'none';
}

// Función para guardar la programación de riego
// Función para guardar la programación de riego
function guardarRiego() {
    const fechaHora = document.getElementById('fechaHora').value;
    const idUsuario = 1;  // Suponiendo que se calcula a partir de la fecha y hora
    const dia = new Date(fechaHora).getDay();  // Suponiendo que se calcula a partir de la fecha y hora
    const hora = new Date(fechaHora).toLocaleTimeString();

    if (fechaHora) {
        // Enviar la fecha y hora al servidor
        fetch('http://localhost:3000/calendario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fecha_hora: fechaHora, id_usuario: idUsuario, dia: dia, hora: hora }) // Enviar la fecha y hora como JSON
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al guardar el horario de riego');
            }
            return response.text(); // O response.json() si esperas un JSON
        })
        .then(data => {
            console.log(data); // Muestra el mensaje de éxito
            cerrarFormulario();  // Cierra el formulario

            // Agregar la nueva programación al array
            programacionesRiego.push(fechaHora); // Agrega la nueva programación al array

            // Actualizar la lista de programaciones
            mostrarProgramaciones(); 
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Hubo un problema al guardar el horario de riego.');
        });
    } else {
        alert('Por favor, seleccione una fecha y hora.');
    }
}

// Función para mostrar las programaciones de riego
function mostrarProgramaciones() {
    const listaRiegos = document.getElementById('listaRiegos');
    listaRiegos.innerHTML = ''; // Limpia la lista

    programacionesRiego.forEach((programacion, index) => {
        const fechaHora = new Date(programacion);
        const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
        const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };
        
        const fechaFormateada = fechaHora.toLocaleDateString('es-ES', opcionesFecha);
        const horaFormateada = fechaHora.toLocaleTimeString('es-ES', opcionesHora);

        const divRiego = document.createElement('div');
        divRiego.classList.add('programacion');
        divRiego.innerHTML = `
            <span>La fecha programada es: ${fechaFormateada} y la hora es: ${horaFormateada}</span>
            <button onclick="editarRiego(${index})">Editar</button>
            <button onclick="eliminarRiego(${index})">Eliminar</button>
        `;
        listaRiegos.appendChild(divRiego);
    });
}

// Función para editar una programación de riego
function editarRiego(index) {
    const nuevaFecha = prompt("Ingrese la nueva fecha y hora:", programacionesRiego[index]);
    if (nuevaFecha) {
        programacionesRiego[index] = nuevaFecha;
        mostrarProgramaciones();  // Actualiza el listado visual
    }
}

// Función para eliminar una programación de riego
function eliminarRiego(index) {
    if (index < 0 || index >= programacionesRiego.length) {
        console.error("Índice fuera de rango");
        return;
    }

    const fechaHora = programacionesRiego[index];
    programacionesRiego.splice(index, 1);  // Elimina la programación del array
    mostrarProgramaciones();  // Actualiza el listado visual // Suponiendo que cada programación tiene un ID único

    // Realizar la solicitud DELETE al servidor
    fetch(`http://localhost:3000/calendario/${index}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al eliminar la programación');
        }
        return response.text(); // O response.json() si esperas un JSON
    })
    .then(data => {
        console.log(data); // Muestra el mensaje de éxito
          // Elimina la programación del array
        mostrarProgramaciones();  // Actualiza el listado visual
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un problema al eliminar la programación.');
    });
}