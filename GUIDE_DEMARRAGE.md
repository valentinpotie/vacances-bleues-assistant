# Guide de Démarrage Rapide - Vacances Bleues

Ce guide vous aidera à configurer et démarrer votre assistant téléphonique de réservation en **15 minutes**.

## Étape 1 : Prérequis (5 min)

### Comptes nécessaires

1. **Compte OpenAI** avec API Realtime activée
   - Créer un compte : https://platform.openai.com/signup
   - Vérifier l'accès Realtime API : https://platform.openai.com/docs/guides/realtime

2. **Compte Twilio** avec crédits
   - Créer un compte : https://www.twilio.com/try-twilio
   - Vous recevrez des crédits gratuits pour tester

3. **ngrok** installé
   - Télécharger : https://ngrok.com/download
   - Créer un compte gratuit : https://dashboard.ngrok.com/signup

### Installation locale

```bash
# Cloner le projet
git clone <votre-repo>
cd openai-sip-trunking

# Installer les dépendances
npm install
```

## Étape 2 : Configuration OpenAI (3 min)

### 2.1 Obtenir la clé API

1. Allez sur https://platform.openai.com/api-keys
2. Cliquez sur **Create new secret key**
3. Nommez-la "Vacances Bleues" et copiez-la
4. ⚠️ Sauvegardez-la immédiatement (elle ne sera plus visible)

### 2.2 Démarrer ngrok temporairement

```bash
# Dans un nouveau terminal
ngrok http 8000
```

Copiez l'URL affichée (ex: `https://abc123.ngrok.app`)

### 2.3 Créer le webhook OpenAI

1. Allez sur https://platform.openai.com/settings/organization/webhooks
2. Cliquez sur **Create a webhook**
3. Remplissez :
   - **Name** : `Vacances Bleues Reservations`
   - **URL** : `https://abc123.ngrok.app` (votre URL ngrok)
   - **Event type** : Sélectionnez `realtime.call.incoming`
4. Cliquez sur **Create**
5. **Copiez le Webhook Secret** (commence par `whsec_`)

### 2.4 Obtenir votre Project ID

1. Dans l'URL de votre dashboard OpenAI, notez l'ID du projet
   - Exemple : `https://platform.openai.com/projects/proj_abc123/...`
   - Votre Project ID est : `proj_abc123`
2. Ou allez dans **Settings** > **General** et copiez le **Project ID**

## Étape 3 : Configuration Twilio (5 min)

### 3.1 Acheter un numéro

1. Connectez-vous à https://console.twilio.com
2. Allez dans **Phone Numbers** > **Manage** > **Buy a number**
3. Sélectionnez votre pays (France pour un +33)
4. Assurez-vous que **Voice** est coché
5. Achetez le numéro (gratuit avec les crédits de test)

### 3.2 Créer un SIP Trunk

1. Allez dans **Elastic SIP Trunking** > **Trunks**
   - Direct link : https://console.twilio.com/us1/develop/sip-trunking/trunks
2. Cliquez sur **+** (Create new SIP Trunk)
3. Nommez-le : `OpenAI Realtime`
4. Cliquez sur **Create**

### 3.3 Configurer l'Origination URI

1. Dans votre SIP Trunk, cliquez sur **Origination**
2. Cliquez sur **Add new Origination URI**
3. Dans le champ **SIP URI**, entrez :
   ```
   sip:VOTRE_PROJECT_ID@sip.api.openai.com;transport=tls
   ```
   ⚠️ Remplacez `VOTRE_PROJECT_ID` par votre vrai Project ID OpenAI
4. Laissez **Priority** : 10, **Weight** : 10
5. Cliquez sur **Add**

### 3.4 Connecter le numéro au SIP Trunk

1. Dans votre SIP Trunk, cliquez sur **Phone Numbers**
2. Cliquez sur **Add a Phone Number**
3. Sélectionnez le numéro que vous venez d'acheter
4. Cliquez sur **Add**

## Étape 4 : Configuration du serveur (2 min)

### 4.1 Créer le fichier .env

Créez un fichier `.env` à la racine du projet :

```bash
OPENAI_API_KEY=sk-proj-VOTRE_CLE_ICI
OPENAI_WEBHOOK_SECRET=whsec_VOTRE_SECRET_ICI
PORT=8000
```

Remplacez :
- `VOTRE_CLE_ICI` par votre clé API OpenAI
- `VOTRE_SECRET_ICI` par votre webhook secret

### 4.2 Vérifier la configuration

```bash
cat .env
```

Assurez-vous que les 3 variables sont bien remplies.

## Étape 5 : Premier appel test ! (1 min)

### 5.1 Démarrer le serveur

```bash
npm run dev
```

Vous devriez voir :
```
🚀 Serveur démarré sur http://localhost:8000
📞 Assistant de réservation Vacances Bleues prêt !
📝 Aucune réservation existante, création d'un nouveau fichier

📋 Endpoints disponibles:
   GET  /health - Vérifier le statut du serveur
   GET  /reservations - Consulter toutes les réservations
   ...
```

### 5.2 Vérifier que ngrok fonctionne

Dans un autre terminal :
```bash
curl http://localhost:8000/health
```

Devrait retourner : `Health ok`

### 5.3 Appeler votre numéro !

1. Appelez le numéro Twilio que vous avez acheté
2. L'assistant devrait répondre : "Bonjour et bienvenue chez Vacances Bleues !"
3. Suivez la conversation pour tester une réservation

## Vérifier les réservations

Pendant que l'appel est en cours ou après, consultez :

```bash
# Voir toutes les réservations
curl http://localhost:8000/reservations | jq

# Ou dans votre navigateur
open http://localhost:8000/reservations
```

Le fichier `reservations.json` sera créé automatiquement.

## Troubleshooting

### L'assistant ne répond pas

1. Vérifiez que ngrok est actif :
   ```bash
   curl https://votre-url.ngrok.app/health
   ```

2. Vérifiez les logs du serveur pour voir si le webhook arrive

3. Vérifiez que le SIP URI contient le bon Project ID :
   - Allez dans Twilio > SIP Trunk > Origination
   - Le format doit être : `sip:proj_xxxxx@sip.api.openai.com;transport=tls`

### L'assistant parle mais ne répond pas à mes questions

1. Vérifiez que les tools sont bien définis dans `callAccept`
2. Regardez les logs WebSocket pour voir les événements

### Erreur "Invalid signature"

1. Vérifiez que `OPENAI_WEBHOOK_SECRET` est correct dans `.env`
2. Redémarrez le serveur après avoir modifié `.env`

### Le serveur ne démarre pas

```bash
# Réinstaller les dépendances
rm -rf node_modules package-lock.json
npm install

# Vérifier la version de Node
node --version  # Devrait être v22+
```

## Prochaines étapes

Une fois que tout fonctionne :

1. **Configurez un domaine statique ngrok** (si plan payant)
2. **Personnalisez les types de chambres** dans `src/index.ts`
3. **Ajoutez une vraie base de données** (PostgreSQL, MongoDB)
4. **Configurez l'envoi d'emails** de confirmation
5. **Déployez en production** (Railway, Render, etc.)

## Support

- Documentation complète : [README.md](README.md)
- OpenAI Realtime : https://platform.openai.com/docs/guides/realtime
- Twilio SIP Trunking : https://www.twilio.com/docs/sip-trunking

Bon courage ! 🚀
