const WebSocket = require('ws');
const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const fs = require('fs');

app.use(express.static('public'));

const questions = [
    { "question": "¿Qué tipo de empresa es Orbitek?", "options": ["Empresa de telecomunicaciones", "Empresa de construcción", "Empresa de alimentación", "Empresa de transporte"], "answer": "Empresa de telecomunicaciones" },
    { "question": "¿Qué servicio principal ofrece Orbitek?", "options": ["Conexión a Internet por satélite", "Servicios de telefonía móvil", "Venta de electrodomésticos", "Servicios de televisión por cable"], "answer": "Conexión a Internet por satélite" },
    { "question": "¿Qué tipo de conexión ofrece Orbitek?", "options": ["Satelital", "Fibra óptica", "5G", "ADSL"], "answer": "Satelital" },
    { "question": "¿Dónde se creó Orbitek?", "options": ["Somorrostro", "Nikolas Larburu", "San Jorge", "Sopuerta"], "answer": "Somorrostro" },
    { "question": "¿Cuánto cuesta el servicio de Orbitek?", "options": ["108-Año", "200-Año", "308-Año", "59-Año"], "answer": "108-Año" },
    { "question": "¿Cuál es la autonomía de batería de Orbitek?", "options": ["Hasta 8 horas", "Hasta 4 horas", "Hasta 12 horas", "Hasta 24 horas"], "answer": "Hasta 8 horas" },
    { "question": "¿En qué año nació Orbitek?", "options": ["2024", "2020", "2023", "2022"], "answer": "2024" },
    { "question": "¿Orbitek necesita una suscripción mensual?", "options": ["Sí", "No, es un pago único", "Solo en algunos países", "Depende del proveedor"], "answer": "Sí" },
    { "question": "¿Cómo se activa Orbitek?", "options": ["Encendiendo el Orbitek", "Configurando parámetros manualmente", "Llamando a soporte técnico", "Mediante una aplicación"], "answer": "Encendiendo el Orbitek" },
    { "question": "¿Qué tipo de dispositivos pueden conectarse a Orbitek?", "options": ["Cualquier dispositivo con Wi-Fi", "Solo teléfonos móviles", "Solo ordenadores", "Solo dispositivos Android"], "answer": "Cualquier dispositivo con Wi-Fi" },
    { "question": "¿Cuál es el principal beneficio de Orbitek?", "options": ["Internet en cualquier lugar", "Mayor velocidad que la fibra", "No necesita electricidad", "No tiene costos adicionales"], "answer": "Internet en cualquier lugar" },
    { "question": "¿Orbitek funciona en movimiento?", "options": ["Sí", "No", "Solo en zonas urbanas", "Solo con conexión 5G"], "answer": "Sí" },
    { "question": "¿Cuántos dispositivos pueden conectarse a Orbitek?", "options": ["Hasta 10", "Hasta 3", "Hasta 50", "Hasta 20"], "answer": "Hasta 10" },
    { "question": "¿Qué velocidad de Internet ofrece Orbitek?", "options": ["Hasta 100 Mbps", "Hasta 10 Mbps", "Hasta 500 Mbps", "Hasta 1 Gbps"], "answer": "Hasta 10 Mbps" },
    { "question": "¿Orbitek ofrece cobertura en alta mar?", "options": ["Sí", "No", "Solo en puertos", "Solo cerca de la costa"], "answer": "Sí" },
    { "question": "¿Qué garantía ofrece Orbitek?", "options": ["1 año", "3 meses", "5 años", "No tiene garantía"], "answer": "No tiene garantía" },
    { "question": "¿Dónde se puede comprar Orbitek?", "options": ["En su página web", "Solo en tiendas físicas", "En supermercados", "En cualquier operador de telecomunicaciones"], "answer": "En su página web" },
    { "question": "¿Orbitek requiere SIM para funcionar?", "options": ["No, viene incorporada", "Sí, con un operador", "Depende del modelo", "Solo en algunos países"], "answer": "No, viene incorporada" },
    { "question": "¿Cómo se actualiza el software de Orbitek?", "options": ["Automáticamente por Internet", "Con un USB", "A través de una app", "No se necesita actualizar"], "answer": "No se necesita actualizar" },
    { "question": "¿Cuál es la duración de la batería de Orbitek Pro en uso?", "options": ["Hasta 16 horas", "Hasta 24 horas", "Hasta 6 horas", "Hasta 3 horas"], "answer": "Hasta 16 horas" },
    { "question": "¿Qué función especial tiene Orbitek?", "options": ["Funciona sin instalación", "Es más barato que la fibra óptica", "Se conecta a redes 5G", "Permite llamadas de voz"], "answer": "Funciona sin instalación" },
    { "question": "¿Qué hace Orbitek si hay mal clima?", "options": ["Sigue funcionando", "Pierde la conexión", "Se apaga automáticamente", "Solo funciona en interiores"], "answer": "Sigue funcionando" },
    { "question": "¿Cuántos modelos de Orbitek existen?", "options": ["Dos", "Uno", "Tres", "Cinco"], "answer": "Dos" },
    { "question": "¿Orbitek tiene límite de datos?", "options": ["Sí, según el plan contratado", "No, es ilimitado siempre", "Solo en algunas zonas", "Depende del número de dispositivos conectados"], "answer": "No, es ilimitado siempre" },
    { "question": "¿Cómo se transporta Orbitek?", "options": ["Es portátil y ligero", "Solo en una mochila especial", "Debe instalarse en un vehículo", "Solo con soporte técnico"], "answer": "Es portátil y ligero" },
    { "question": "¿En qué situaciones es ideal Orbitek?", "options": ["En zonas sin cobertura y emergencias", "Solo en oficinas", "Solo en eventos deportivos", "Solo para streaming"], "answer": "En zonas sin cobertura y emergencias" },
    { "question": "¿Qué tipo de cobertura ofrece Orbitek?", "options": ["Cobertura en toda el área peninsular", "Solo en áreas urbanas", "Solo en áreas rurales", "Cobertura internacional"], "answer": "Cobertura en toda el área peninsular" },
    { "question": "¿Cómo se describe el sistema de instalación de Orbitek?", "options": ["Es un sistema 'plug and play'", "Requiere instalación por técnicos", "Debe conectarse por cable", "Solo funciona con dispositivos específicos"], "answer": "Es un sistema 'plug and play'" },
    { "question": "¿Qué materiales componen Orbitek?", "options": ["Materiales reciclados", "Plástico convencional", "Metales pesados", "Vidrio templado"], "answer": "Materiales reciclados" }
  ];

let leaderboard = {};

wss.on('connection', ws => {
    let user = null;
    let score = 0;
    let askedQuestions = [];

    function sendQuestion() {
        if (askedQuestions.length >= 5) {
            leaderboard[user] = score;
            broadcastLeaderboard();
            ws.send(JSON.stringify({ type: 'success', score: score }));
            return;
        }
        let q;
        do {
            q = questions[Math.floor(Math.random() * questions.length)];
        } while (askedQuestions.includes(q.question));
        askedQuestions.push(q.question);
        ws.send(JSON.stringify({ type: 'question', question: q.question, options: q.options }));
    }

    ws.on('message', message => {
        const data = JSON.parse(message);
        if (data.type === 'start') {
            user = data.name;
            score = 0;
            askedQuestions = [];
            sendQuestion();
        } else if (data.type === 'answer') {
            let currentQuestion = questions.find(q => q.question === askedQuestions[askedQuestions.length - 1]);
            if (currentQuestion && data.answer === currentQuestion.answer) {
                score++;
                sendQuestion();
            } else {
                leaderboard[user] = score;
                ws.send(JSON.stringify({ type: 'fail', score: score }));
                broadcastLeaderboard();
            }
        }
    });
});

function broadcastLeaderboard() {
    const leaderboardData = JSON.stringify({ type: 'leaderboard', leaderboard });
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(leaderboardData);
        }
    });
    saveLeaderboard();
}

function saveLeaderboard() {
    const leaderboardText = Object.entries(leaderboard)
        .sort((a, b) => b[1] - a[1])
        .map(([name, score], index) => `${index + 1}. ${name}: ${score}`)
        .join('\n');
    fs.writeFileSync('leaderboard.txt', leaderboardText);
    console.log("He intentado guardar en el ")
}

server.listen(3000, () => console.log('Servidor iniciado correctamente: http://localhost:3000'));


