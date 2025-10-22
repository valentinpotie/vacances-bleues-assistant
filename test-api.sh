#!/bin/bash

echo "🔍 Test d'accès à l'API Realtime OpenAI"
echo "========================================"
echo ""

# Demander la clé API si pas fournie
if [ -z "$1" ]; then
    echo "❌ Usage: ./test-api.sh VOTRE_CLE_API"
    echo ""
    echo "Exemple:"
    echo "  ./test-api.sh sk-proj-xxxxx"
    echo ""
    exit 1
fi

API_KEY=$1

echo "📡 Test de création de session éphémère..."
echo ""

# Tester la création d'une session
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST \
  https://api.openai.com/v1/realtime/sessions \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "gpt-4o-realtime-preview-2024-12-17",
    "voice": "alloy"
  }')

# Séparer le corps et le code HTTP
HTTP_BODY=$(echo "$RESPONSE" | head -n -1)
HTTP_CODE=$(echo "$RESPONSE" | tail -n 1)

echo "📊 Code HTTP: $HTTP_CODE"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Succès ! Votre clé API a accès à l'API Realtime"
    echo ""
    echo "📄 Réponse:"
    echo "$HTTP_BODY" | python3 -m json.tool 2>/dev/null || echo "$HTTP_BODY"
elif [ "$HTTP_CODE" = "401" ]; then
    echo "❌ Erreur 401: Clé API invalide ou expirée"
    echo ""
    echo "Solutions:"
    echo "  - Vérifiez que votre clé commence bien par sk-proj-"
    echo "  - Créez une nouvelle clé sur https://platform.openai.com/api-keys"
elif [ "$HTTP_CODE" = "403" ]; then
    echo "❌ Erreur 403: Accès refusé à l'API Realtime"
    echo ""
    echo "Solutions:"
    echo "  - L'API Realtime nécessite un accès spécial"
    echo "  - Demandez l'accès sur https://platform.openai.com/docs/guides/realtime"
    echo "  - Vérifiez votre plan et vos crédits"
elif [ "$HTTP_CODE" = "429" ]; then
    echo "⚠️  Erreur 429: Trop de requêtes"
    echo ""
    echo "Attendez quelques secondes et réessayez"
else
    echo "❌ Erreur $HTTP_CODE"
    echo ""
    echo "Réponse complète:"
    echo "$HTTP_BODY"
fi

echo ""
echo "📚 Documentation:"
echo "  https://platform.openai.com/docs/guides/realtime"
echo ""
