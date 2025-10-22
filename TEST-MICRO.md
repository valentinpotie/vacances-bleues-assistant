# 🎤 Guide de Test avec Micro

Ce guide vous explique comment tester votre assistant vocal **IMMÉDIATEMENT** avec votre micro, sans attendre la vérification Twilio.

## 🚀 Démarrage rapide (2 minutes)

### Étape 1 : Ouvrir la page de test

```bash
# Ouvrez le fichier dans votre navigateur
open test-micro.html

# Ou double-cliquez sur le fichier test-micro.html
```

### Étape 2 : Entrer votre clé API

Quand vous ouvrez la page, elle vous demandera votre clé API OpenAI.

**Où trouver votre clé ?**
- Allez sur https://platform.openai.com/api-keys
- Créez une nouvelle clé si nécessaire
- Copiez-la (commence par `sk-proj-...`)

**Important** : La clé est sauvegardée dans votre navigateur (localStorage), vous n'aurez à la rentrer qu'une seule fois.

### Étape 3 : Cliquer sur "Démarrer l'appel test"

1. Cliquez sur le bouton **🎤 Démarrer l'appel test**
2. Autorisez l'accès à votre microphone
3. Attendez quelques secondes (connexion WebRTC)
4. L'assistant dira : "Bonjour et bienvenue chez Vacances Bleues !"

### Étape 4 : Parlez !

Testez une conversation complète :

```
Vous : "Bonjour, je voudrais réserver une chambre"
🤖 : "Parfait ! Pour quelles dates souhaitez-vous réserver ?"

Vous : "Du 15 au 20 mars"
🤖 : "Très bien. Pour combien de personnes ?"

Vous : "Deux personnes"
🤖 : "Je peux vous proposer une Chambre Standard ou une Suite Vue Mer..."

... et ainsi de suite !
```

---

## 📊 Interface expliquée

### Zone de statut (en haut)
- 🔴 **Rouge** : Déconnecté
- 🟡 **Orange** : Connexion en cours
- 🟢 **Vert** : Connecté - vous pouvez parler !

### Barre de volume
Montre l'intensité de votre voix en temps réel :
- Vert : Volume normal
- Orange : Volume moyen
- Rouge : Volume fort

### Conversation
Affiche tout l'échange :
- 👤 **Bleu** : Vos messages
- 🤖 **Violet** : Réponses de l'assistant
- ℹ️ **Jaune** : Messages système

### Logs techniques
Montre tout ce qui se passe en coulisses :
- 🔵 Info : Événements normaux
- 🟢 Success : Actions réussies
- 🔴 Error : Erreurs
- 🟡 Warning : Avertissements

---

## 🔧 Différences avec un vrai appel téléphonique

### ✅ Ce qui fonctionne EXACTEMENT pareil :
- La voix de l'assistant (identique)
- La reconnaissance vocale (identique)
- La conversation (identique)
- Les instructions Vacances Bleues (identiques)

### ⚠️ Ce qui est différent :
- **Pas de tools/fonctions** : Les fonctions `create_reservation` et `check_availability` ne sont pas appelées
- **Interface visuelle** : Vous voyez la conversation écrite (pratique pour déboguer !)
- **Logs en temps réel** : Vous voyez tout ce qui se passe

### 💡 Pourquoi les tools ne marchent pas ?

Les tools nécessitent votre serveur Node.js (localhost:8000). Cette page se connecte **directement** à OpenAI sans passer par votre serveur.

**Solutions :**
1. **Pour tester uniquement la conversation** : Utilisez cette page (parfait pour ajuster les instructions)
2. **Pour tester les réservations complètes** : Attendez Twilio (3 jours) ou utilisez Daily.co

---

## 🎯 Cas d'usage de cette page

### ✅ Parfait pour :
- Tester si l'assistant parle bien français
- Ajuster le ton et la personnalité
- Vérifier que les questions sont bien posées
- Tester le flow de conversation
- Déboguer les instructions
- Montrer une démo rapide

### ❌ Pas adapté pour :
- Tester les réservations réelles (pas de tools)
- Partager avec des clients (trop technique)
- Production (pas de stockage des données)

---

## 🐛 Troubleshooting

### Le micro ne fonctionne pas

**Problème** : "Permission denied" ou pas de son détecté

**Solutions** :
1. Vérifiez les permissions du navigateur (🔒 icône à gauche de l'URL)
2. Utilisez Chrome ou Edge (meilleur support WebRTC)
3. Testez votre micro : https://www.onlinemictest.com/

### Erreur "Invalid API Key"

**Problème** : La clé API ne fonctionne pas

**Solutions** :
1. Vérifiez que la clé commence par `sk-proj-`
2. Vérifiez qu'elle n'a pas expiré
3. Créez une nouvelle clé sur https://platform.openai.com/api-keys
4. Rechargez la page et rentrez la nouvelle clé

### L'assistant ne répond pas

**Problème** : Connexion établie mais pas de réponse audio

**Solutions** :
1. Vérifiez le volume de votre ordinateur
2. Vérifiez les logs (en bas de la page)
3. Essayez de fermer et rouvrir la connexion
4. Rechargez la page

### Erreur "Failed to create session"

**Problème** : Erreur lors de la création de la session

**Solutions** :
1. Vérifiez votre connexion Internet
2. Vérifiez que vous avez des crédits OpenAI
3. Vérifiez que l'API Realtime est activée sur votre compte
4. Regardez les logs pour plus de détails

---

## 🎨 Personnalisation

### Changer les instructions

Modifiez directement dans le fichier [test-micro.html](test-micro.html) :

Cherchez la ligne qui contient `instructions:` (vers la ligne 350) et modifiez le texte.

### Changer la voix

Dans le code, ligne ~340 :
```javascript
voice: 'alloy',  // Options: alloy, echo, fable, onyx, nova, shimmer
```

Remplacez par la voix souhaitée.

### Changer le modèle

Ligne ~339 :
```javascript
model: 'gpt-4o-realtime-preview-2024-12-17',
```

---

## 📈 Prochaines étapes

Une fois que vous avez testé et que tout fonctionne :

1. **Ajustez les instructions** dans [src/index.ts](src/index.ts) avec les mêmes que dans test-micro.html
2. **Attendez la vérification Twilio** (3 jours) pour avoir un vrai numéro
3. **Ou explorez Daily.co** pour lancer plus rapidement
4. **Testez les tools complets** une fois Twilio configuré

---

## 💡 Astuce Pro

Gardez cette page ouverte pendant le développement !

Elle est **parfaite** pour :
- Tester rapidement des modifications d'instructions
- Vérifier le comportement de l'assistant
- Montrer des démos aux collègues
- Déboguer la conversation

---

## 🆘 Support

Si vous rencontrez des problèmes :

1. Regardez les **logs techniques** en bas de la page
2. Ouvrez la **console du navigateur** (F12)
3. Vérifiez votre **clé API** et vos **crédits OpenAI**

---

## 🎉 C'est tout !

Vous pouvez maintenant tester votre assistant vocal **immédiatement** sans attendre Twilio !

**Amusez-vous bien ! 🚀**
