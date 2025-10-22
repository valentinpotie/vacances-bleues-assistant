#!/bin/bash

echo "🌐 Serveur HTTP pour test de l'assistant vocal"
echo "==============================================="
echo ""

# Vérifier que le fichier test-micro.html existe
if [ ! -f "test-micro.html" ]; then
    echo "❌ Erreur: test-micro.html non trouvé"
    exit 1
fi

echo "✅ Fichier trouvé"
echo ""
echo "🚀 Démarrage du serveur HTTP sur le port 8080..."
echo ""
echo "📱 Ouvrez votre navigateur et allez sur :"
echo ""
echo "   👉 http://localhost:8080/test-micro.html"
echo ""
echo "⚠️  Appuyez sur Ctrl+C pour arrêter le serveur"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Démarrer le serveur Python
if command -v python3 &> /dev/null; then
    python3 -m http.server 8080
elif command -v python &> /dev/null; then
    python -m SimpleHTTPServer 8080
else
    echo "❌ Python n'est pas installé"
    echo "Installez Python ou utilisez: npx http-server -p 8080"
    exit 1
fi
