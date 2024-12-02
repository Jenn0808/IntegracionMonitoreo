const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');  // Para interactuar con la base de datos
const cors = require('cors');
const path = require('path');


const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));



app.get('/', (req, res) => {
    res.send('Bienvenido al servidor de Orquídeas Integración');
    // Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
});


// Ruta para simular los datos
app.get('/simular-datos', (req, res) => {
    const datosSimulados = [
        { fecha_hora: '2024-11-01 10:00', humedad: 70, temperatura: 22 },
        { fecha_hora: '2024-11-01 11:00', humedad: 68, temperatura: 23 },
        { fecha_hora: '2024-11-01 12:00', humedad: 65, temperatura: 24 },
        // Agregar más datos simulados...
    ];
    res.json(datosSimulados);
});

// Ruta para obtener datos históricos
app.get('/datos', (req, res) => {
    db.query('SELECT * FROM datos_ambientales', (err, results) => {
        if (err) {
            console.error('Error al obtener datos históricos:', err);
            res.status(500).send('Error al obtener datos históricos');
        } else {
            console.log('Datos históricos obtenidos:', results);
            res.json(results);
        }
    });
});

// Ruta para agregar horarios de riego
app.post('/calendario', (req, res) => {
    const { fecha_hora, id_usuario, dia, hora} = req.body;

    

    if (!fecha_hora|| !id_usuario || dia === undefined) {
        return res.status(400).send('La fecha y hora son obligatorias');
    }

    const query = 'INSERT INTO calendario_riego (fecha_hora, id_usuario, dia, hora) VALUES (?, ?, ?, ?)';
    db.query(query, [fecha_hora, id_usuario, dia, hora], (err, result) => {
        if (err) {
            console.error('Error al guardar el horario de riego:', err);
            res.status(500).send('Error al guardar el horario de riego');
        } else {
            console.log(`Horario de riego guardado: { id: ${result.insertId}, fecha_hora: ${fecha_hora}, id_usuario: ${id_usuario}, dia: ${dia}, hora: ${hora}}`);
            res.status(201).send(`Horario de riego guardado con ID: ${result.insertId}`);
        }
    });
});


app.get('/calendario', (req, res) => {
    db.query('SELECT * FROM calendario_riego', (err, results) => {
        if (err) {
            console.error('Error al obtener los horarios de riego:', err);
            res.status(500).send('Error al obtener los horarios de riego');
        } else {
            console.log('Horarios de riego obtenidos:', results);
            res.json(results);
        }
    });

    // Endpoint para eliminar una programación
app.delete('/calendario/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = programaciones.findIndex(p => p.id === id);
    
    if (index !== -1) {
        programaciones.splice(index, 1); // Elimina la programación del array
        res.status(200).send('Programación eliminada');
    } else {
        res.status(404).send('Programación no encontrada');
    }
});

});


// Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

