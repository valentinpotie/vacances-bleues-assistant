#!/bin/bash

# Vérifier que le fichier test-micro.html existe
if [ ! -f "test-micro.html" ]; then
    echo "❌ Erreur: test-micro.html non trouvé"
    exit 1
fi

# Vérifier que Node.js est installé
if ! command -v node &> /dev/null; then
    echo "❌ Erreur: Node.js n'est pas installé"
    echo "Installez Node.js depuis https://nodejs.org"
    exit 1
fi

# Démarrer le serveur Node.js avec support CORS
node serveur-simple.js
