# Assistant de Réservation Téléphonique Vacances Bleues

Assistant téléphonique intelligent pour la réservation de chambres d'hôtel utilisant l'API Realtime d'OpenAI et le SIP Trunking de Twilio.

## 📋 Description

Ce projet permet aux clients d'appeler un numéro de téléphone et de réserver une chambre d'hôtel en parlant naturellement avec un assistant IA en français. L'assistant :

- Accueille chaleureusement les clients
- Collecte les informations de réservation (dates, nombre de personnes, type de chambre)
- Vérifie la disponibilité
- Enregistre les coordonnées du client
- Confirme la réservation avec un numéro unique

## 🏨 Types de chambres disponibles

- **Chambre Standard** (2 personnes) - À partir de 89€/nuit
- **Chambre Familiale** (4 personnes) - À partir de 139€/nuit
- **Suite Vue Mer** (2 personnes) - À partir de 179€/nuit

## 🚀 Installation

### Prérequis

- Node.js (v22+ recommandé)
- Un compte Twilio avec un numéro de téléphone
- Un compte OpenAI avec accès à l'API Realtime
- ngrok (pour exposer votre serveur local)

### Étapes d'installation

1. **Cloner le repository**
```bash
git clone https://github.com/votre-repo/openai-sip-trunking.git
cd openai-sip-trunking
```

2. **Installer les dépendances**
```bash
npm install
```

3. **Configurer les variables d'environnement**

Créez un fichier `.env` à la racine du projet :
```bash
OPENAI_API_KEY=sk-proj-votre-clé-api
OPENAI_WEBHOOK_SECRET=whsec_votre-secret-webhook
PORT=8000
```

Pour obtenir ces valeurs :
- **OPENAI_API_KEY** : [Plateforme OpenAI](https://platform.openai.com/api-keys)
- **OPENAI_WEBHOOK_SECRET** : Créé lors de la configuration du webhook OpenAI

## ⚙️ Configuration

### 1. Configurer le webhook OpenAI

1. Allez sur [OpenAI Platform Settings](https://platform.openai.com/settings/)
2. Cliquez sur **Webhooks** dans la barre latérale
3. Créez un nouveau webhook avec :
   - **Name** : Vacances Bleues Reservations
   - **URL** : `https://votre-domaine.ngrok.app` (voir section ngrok)
   - **Event type** : `realtime.call.incoming`
4. Copiez le **Webhook Secret** dans votre `.env`

### 2. Configurer Twilio SIP Trunking

1. **Acheter un numéro de téléphone**
   - Allez sur [Twilio Console - Buy Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/search)
   - Recherchez un numéro avec capacités **Voice**
   - Achetez-le

2. **Créer un SIP Trunk**
   - Allez sur [Twilio Console - SIP Trunks](https://console.twilio.com/us1/develop/sip-trunking/trunks)
   - Cliquez sur **+** pour créer un nouveau trunk
   - Nommez-le "OpenAI Realtime"

3. **Configurer l'Origination URI**
   - Dans votre SIP Trunk, allez dans **Origination**
   - Cliquez sur **Add Origination URI**
   - URI : `sip:VOTRE-PROJECT-ID@sip.api.openai.com;transport=tls`
   - Remplacez `VOTRE-PROJECT-ID` par votre ID de projet OpenAI
   - L'ID du projet se trouve dans l'URL ou dans Settings > General

4. **Connecter le numéro au SIP Trunk**
   - Dans SIP Trunk settings, allez dans **Phone Numbers**
   - Cliquez sur **Add Phone Number**
   - Sélectionnez votre numéro acheté

### 3. Configurer ngrok

```bash
# Si vous avez un domaine statique ngrok (plan payant)
ngrok http 8000 --domain=votre-domaine.ngrok.app

# Sans domaine statique (l'URL change à chaque redémarrage)
ngrok http 8000
```

**Important** : Si vous utilisez un domaine non-statique, vous devrez mettre à jour l'URL du webhook OpenAI à chaque redémarrage de ngrok.

## 🎯 Utilisation

### Démarrer le serveur

**Mode développement** (avec rechargement automatique) :
```bash
npm run dev
```

**Mode production** :
```bash
npm run build
npm start
```

Vous devriez voir :
```
🚀 Serveur démarré sur http://localhost:8000
📞 Assistant de réservation Vacances Bleues prêt !
📝 Aucune réservation existante, création d'un nouveau fichier

📋 Endpoints disponibles:
   GET  /health - Vérifier le statut du serveur
   GET  /reservations - Consulter toutes les réservations
   GET  /reservations/:id - Consulter une réservation spécifique
   POST / - Webhook OpenAI (pour les appels entrants)
```

### Tester l'assistant

1. Appelez le numéro Twilio que vous avez configuré
2. L'assistant vous accueillera en français
3. Suivez les instructions pour réserver une chambre

Exemple de conversation :
```
🤖 : Bonjour et bienvenue chez Vacances Bleues ! Comment puis-je vous aider ?
👤 : Je voudrais réserver une chambre
🤖 : Parfait ! Pour quelles dates souhaitez-vous réserver ?
👤 : Du 15 au 20 mars
🤖 : Très bien. Pour combien de personnes ?
👤 : Deux personnes
🤖 : Je peux vous proposer une Chambre Standard ou une Suite Vue Mer. Laquelle préférez-vous ?
👤 : Une suite vue mer s'il vous plaît
🤖 : Excellent choix ! Puis-je avoir votre nom complet ?
👤 : Jean Dupont
🤖 : Merci monsieur Dupont. Quel est votre email ?
...
```

## 📊 API Endpoints

### GET /health
Vérifie que le serveur fonctionne.

```bash
curl http://localhost:8000/health
```

### GET /reservations
Récupère toutes les réservations.

```bash
curl http://localhost:8000/reservations
```

Réponse :
```json
{
  "total": 2,
  "reservations": [
    {
      "id": "RES-1234567890-abc123",
      "nom": "Dupont",
      "prenom": "Jean",
      "email": "jean.dupont@example.com",
      "telephone": "0612345678",
      "date_arrivee": "2025-03-15",
      "date_depart": "2025-03-20",
      "type_chambre": "suite_vue_mer",
      "nombre_personnes": 2,
      "demandes_speciales": "Lit bébé",
      "date_creation": "2025-01-22T10:30:00.000Z"
    }
  ]
}
```

### GET /reservations/:id
Récupère une réservation spécifique.

```bash
curl http://localhost:8000/reservations/RES-1234567890-abc123
```

## 🔧 Fonctionnalités de l'IA

L'assistant utilise deux fonctions OpenAI :

### 1. `check_availability`
Vérifie si des chambres sont disponibles pour des dates données.

**Paramètres** :
- `date_arrivee` : Date d'arrivée (YYYY-MM-DD)
- `date_depart` : Date de départ (YYYY-MM-DD)
- `type_chambre` : Type de chambre (standard, familiale, suite_vue_mer)

### 2. `create_reservation`
Crée une nouvelle réservation dans le système.

**Paramètres** :
- `nom` : Nom du client
- `prenom` : Prénom du client
- `email` : Email du client
- `telephone` : Téléphone du client
- `date_arrivee` : Date d'arrivée
- `date_depart` : Date de départ
- `type_chambre` : Type de chambre
- `nombre_personnes` : Nombre de personnes
- `demandes_speciales` (optionnel) : Demandes particulières

## 💾 Stockage des données

Les réservations sont sauvegardées dans un fichier `reservations.json` à la racine du projet. Le fichier est automatiquement créé et mis à jour.

**Structure du fichier** :
```json
[
  {
    "id": "RES-1234567890-abc123",
    "nom": "Dupont",
    "prenom": "Jean",
    ...
  }
]
```

## 🎨 Personnalisation

### Modifier les types de chambres

Éditez les constantes dans [src/index.ts](src/index.ts#L38-L41) :

```typescript
Types de chambres disponibles:
- Chambre Standard (2 personnes) - À partir de 89€/nuit
- Chambre Familiale (4 personnes) - À partir de 139€/nuit
- Suite Vue Mer (2 personnes) - À partir de 179€/nuit
```

### Changer la voix de l'assistant

Dans [src/index.ts](src/index.ts#L46-L48), modifiez :

```typescript
audio: {
  output: { voice: "alloy" },  // Options: alloy, echo, fable, onyx, nova, shimmer
}
```

### Personnaliser les instructions

Modifiez le prompt dans [src/index.ts](src/index.ts#L22-L43) pour adapter le comportement de l'assistant.

## 📝 Logs et Débogage

Le serveur affiche des logs détaillés :

- 🔌 Connexion WebSocket
- 📞 Appels de fonction
- 💬 Interactions de conversation
- 📅 Nouvelles réservations
- 💾 Sauvegardes
- ❌ Erreurs

## 🔒 Sécurité

- Les webhooks OpenAI sont vérifiés avec la signature HMAC
- Les clés API sont stockées dans des variables d'environnement
- Le fichier `.env` est exclu du contrôle de version

## 🚧 Prochaines améliorations possibles

- [ ] Intégration avec une vraie base de données (PostgreSQL, MongoDB)
- [ ] Envoi d'emails de confirmation automatiques
- [ ] Système de paiement en ligne
- [ ] Vérification réelle de disponibilité avec calendrier
- [ ] Interface web pour gérer les réservations
- [ ] Support multilingue (anglais, espagnol, etc.)
- [ ] Intégration avec un PMS (Property Management System)
- [ ] Notifications SMS via Twilio

## 📚 Ressources

- [Documentation OpenAI Realtime API](https://platform.openai.com/docs/guides/realtime)
- [Documentation Twilio SIP Trunking](https://www.twilio.com/docs/sip-trunking)
- [Guide OpenAI + Twilio](https://www.twilio.com/blog/openai-realtime-api-twilio-sip)

## 📄 Licence

ISC

## 👨‍💻 Auteur

Assistant de réservation Vacances Bleues - Développé avec OpenAI Realtime API et Twilio
