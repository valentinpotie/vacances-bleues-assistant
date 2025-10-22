#!/bin/bash

# Script de démarrage pour l'Assistant de Réservation Vacances Bleues
# Ce script vérifie la configuration et démarre le serveur

echo "🏨 Assistant de Réservation Vacances Bleues"
echo "==========================================="
echo ""

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé."
    echo "   Téléchargez-le depuis https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js version: $(node --version)"

# Vérifier que npm est installé
if ! command -v npm &> /dev/null; then
    echo "❌ npm n'est pas installé."
    exit 1
fi

echo "✅ npm version: $(npm --version)"

# Vérifier que le fichier .env existe
if [ ! -f .env ]; then
    echo ""
    echo "⚠️  Le fichier .env n'existe pas."
    echo "   Création du fichier .env depuis .env.example..."

    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ Fichier .env créé !"
        echo ""
        echo "🔧 IMPORTANT : Modifiez le fichier .env avec vos clés API :"
        echo "   - OPENAI_API_KEY"
        echo "   - OPENAI_WEBHOOK_SECRET"
        echo ""
        read -p "Appuyez sur Entrée une fois que vous avez configuré .env..."
    else
        echo "❌ Le fichier .env.example n'existe pas non plus."
        echo "   Créez un fichier .env avec les variables requises."
        exit 1
    fi
fi

# Vérifier que les variables d'environnement sont définies
source .env

if [ -z "$OPENAI_API_KEY" ] || [ "$OPENAI_API_KEY" = "sk-proj-" ]; then
    echo "❌ OPENAI_API_KEY n'est pas configurée dans .env"
    echo "   Obtenez votre clé sur https://platform.openai.com/api-keys"
    exit 1
fi

if [ -z "$OPENAI_WEBHOOK_SECRET" ] || [ "$OPENAI_WEBHOOK_SECRET" = "whsec" ]; then
    echo "❌ OPENAI_WEBHOOK_SECRET n'est pas configurée dans .env"
    echo "   Créez un webhook sur https://platform.openai.com/settings/organization/webhooks"
    exit 1
fi

echo "✅ Variables d'environnement configurées"

# Vérifier que node_modules existe
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 Installation des dépendances..."
    npm install

    if [ $? -ne 0 ]; then
        echo "❌ Erreur lors de l'installation des dépendances"
        exit 1
    fi

    echo "✅ Dépendances installées"
fi

# Vérifier que ngrok est installé
if command -v ngrok &> /dev/null; then
    echo "✅ ngrok est installé"
    echo ""
    echo "💡 Pour exposer votre serveur, lancez dans un autre terminal :"
    echo "   ngrok http 8000"
else
    echo "⚠️  ngrok n'est pas installé (optionnel pour les tests locaux)"
    echo "   Téléchargez-le depuis https://ngrok.com/download"
fi

echo ""
echo "🚀 Démarrage du serveur..."
echo "==========================================="
echo ""

# Démarrer le serveur
npm run dev
