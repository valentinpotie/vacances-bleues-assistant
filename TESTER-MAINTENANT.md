# 🚀 TESTER L'ASSISTANT VOCAL MAINTENANT

## ⚡ Méthode la plus rapide (1 commande)

```bash
./serveur-test.sh
```

Puis ouvrez : **http://localhost:8080/test-micro.html**

---

## 📋 Ce qui va se passer

1. ✅ Le serveur HTTP démarre sur le port 8080
2. ✅ Votre navigateur s'ouvre sur la page de test
3. ✅ Vous entrez votre clé API OpenAI (une seule fois)
4. ✅ Vous cliquez sur "🎤 Démarrer l'appel test"
5. ✅ Vous autorisez le micro
6. ✅ **L'assistant parle en français !**

---

## 🎤 Testez une vraie conversation

```
VOUS : "Bonjour"
🤖  : "Bonjour et bienvenue chez Vacances Bleues !"

VOUS : "Je voudrais réserver une chambre"
🤖  : "Parfait ! Pour quelles dates ?"

VOUS : "Du 15 au 20 mars"
🤖  : "Pour combien de personnes ?"

VOUS : "Deux personnes"
🤖  : "Je peux vous proposer une Chambre Standard ou une Suite Vue Mer..."

... et ainsi de suite !
```

---

## ❓ FAQ rapide

### Le port 8080 est déjà utilisé ?

```bash
# Tuer le processus
lsof -ti:8080 | xargs kill -9

# Puis relancer
./serveur-test.sh
```

### Pas de Python ?

```bash
# Avec Node.js
npx http-server -p 8080

# Puis ouvrez http://localhost:8080/test-micro.html
```

### Erreur "Load failed" ?

Vérifiez que vous utilisez bien `http://localhost:8080` et PAS `file://`.

### L'assistant ne parle pas français ?

Vérifiez que vous avez bien utilisé la clé API qui a accès à Realtime API.

---

## 🆚 Différences avec un vrai appel téléphonique

| Fonctionnalité | Page de test | Appel Twilio |
|----------------|--------------|--------------|
| Conversation vocale | ✅ Identique | ✅ |
| Reconnaissance française | ✅ Identique | ✅ |
| Instructions Vacances Bleues | ✅ Identique | ✅ |
| Tools/Fonctions (réservations) | ❌ Non | ✅ |
| Sauvegarde dans reservations.json | ❌ Non | ✅ |
| Numéro de téléphone à appeler | ❌ Non | ✅ |

**Cette page teste la CONVERSATION**, pas le système complet.

---

## 🎯 Prochaines étapes après le test

### Si la conversation vous convient :

1. **Attendez la vérification Twilio (3 jours)**
   - Puis configurez le SIP Trunk
   - Lancez `npm run dev`
   - Appelez le numéro → Tout marche !

2. **Ou utilisez Daily.co (pas d'attente)**
   - Je peux vous guider
   - Setup en 1 heure
   - Tout fonctionne (conversation + réservations)

### Si vous voulez ajuster la conversation :

1. Modifiez les instructions dans [test-micro.html](test-micro.html) (ligne ~400)
2. Rechargez la page
3. Testez immédiatement
4. Une fois satisfait, copiez les mêmes instructions dans [src/index.ts](src/index.ts)

---

## 📚 Documentation

- **[SOLUTION-CORS.md](SOLUTION-CORS.md)** - Pourquoi le serveur local est nécessaire
- **[TEST-MICRO.md](TEST-MICRO.md)** - Guide complet de la page de test
- **[LANCER-TEST.md](LANCER-TEST.md)** - Guide ultra-rapide
- **[README.md](README.md)** - Documentation complète

---

## ✅ Récap ultra-rapide

```bash
# 1. Lancer le serveur
./serveur-test.sh

# 2. Ouvrir http://localhost:8080/test-micro.html

# 3. Entrer votre clé API

# 4. Cliquer "Démarrer l'appel test"

# 5. PARLER ! 🎤
```

---

## 🎉 Allez-y !

**Testez MAINTENANT** :

```bash
./serveur-test.sh
```

**L'URL sera** : http://localhost:8080/test-micro.html

Dites-moi comment ça se passe ! 🚀
