const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Enable CORS for all routes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Serve static files from current directory
app.use(express.static(__dirname));

// Start server
app.listen(PORT, () => {
    console.log('🌐 Serveur HTTP pour test de l\'assistant vocal');
    console.log('===============================================\n');
    console.log(`🚀 Serveur démarré sur le port ${PORT}\n`);
    console.log('📱 Ouvrez votre navigateur et allez sur :\n');
    console.log(`   👉 http://localhost:${PORT}/test-micro.html\n`);
    console.log('⚠️  Appuyez sur Ctrl+C pour arrêter le serveur\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
});
