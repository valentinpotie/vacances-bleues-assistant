#!/bin/bash

echo "🎤 Test Assistant Vocal Vacances Bleues"
echo "========================================"
echo ""

# Vérifier que le fichier existe
if [ ! -f "test-micro.html" ]; then
    echo "❌ Erreur: Le fichier test-micro.html n'existe pas"
    exit 1
fi

echo "✅ Fichier de test trouvé"
echo ""
echo "🌐 Ouverture dans votre navigateur..."
echo ""

# Détecter l'OS et ouvrir le fichier
if [[ "$OSTYPE" == "darwin"* ]]; then
    # macOS
    open test-micro.html
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    # Linux
    xdg-open test-micro.html
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    # Windows
    start test-micro.html
else
    echo "⚠️  OS non reconnu. Ouvrez manuellement le fichier test-micro.html"
    exit 1
fi

echo "✅ Page ouverte !"
echo ""
echo "📋 Prochaines étapes :"
echo "   1. Entrez votre clé API OpenAI (sk-proj-...)"
echo "   2. Cliquez sur '🎤 Démarrer l'appel test'"
echo "   3. Autorisez votre microphone"
echo "   4. Parlez avec l'assistant !"
echo ""
echo "📖 Pour plus d'aide, lisez : TEST-MICRO.md"
echo ""
