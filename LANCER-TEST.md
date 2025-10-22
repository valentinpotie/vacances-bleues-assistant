# 🚀 Comment tester MAINTENANT (30 secondes)

## Option simple : Double-cliquez sur le fichier

```bash
# Sur Mac
open test-micro.html

# Sur Windows
start test-micro.html

# Ou simplement double-cliquez sur le fichier test-micro.html
```

## Ce qui va se passer

1. **Votre navigateur s'ouvre** avec une belle interface
2. **Une popup demande votre clé API OpenAI**
   - Allez sur https://platform.openai.com/api-keys
   - Créez une clé si besoin
   - Copiez-la et collez-la
3. **Cliquez sur "🎤 Démarrer l'appel test"**
4. **Autorisez votre micro** quand le navigateur demande
5. **L'assistant vous parle !** "Bonjour et bienvenue chez Vacances Bleues..."

## Testez une vraie conversation

Essayez ce dialogue :

```
Vous : "Bonjour, je voudrais réserver une chambre"
🤖  : "Parfait ! Pour quelles dates ?"

Vous : "Du 15 au 20 mars"
🤖  : "Très bien. Pour combien de personnes ?"

Vous : "Deux personnes"
🤖  : "Je propose une Chambre Standard à 89€ ou une Suite Vue Mer à 179€..."

Vous : "La suite vue mer s'il vous plaît"
🤖  : "Excellent choix ! Quel est votre nom complet ?"

...
```

## Interface

L'écran montre :
- ✅ **Statut** : Rouge/Orange/Vert
- 📊 **Volume** : Barre qui bouge quand vous parlez
- 💬 **Conversation** : Tout ce qui est dit (vous + assistant)
- 🔍 **Logs** : Événements techniques en temps réel

## Limitations de ce test

⚠️ **Important** : Cette page teste UNIQUEMENT la conversation vocale.

**Ce qui marche :**
- ✅ Voix de l'assistant
- ✅ Reconnaissance de votre voix
- ✅ Conversation complète
- ✅ Instructions Vacances Bleues

**Ce qui ne marche PAS :**
- ❌ Création de réservations (pas de tools)
- ❌ Sauvegarde dans reservations.json
- ❌ Appels des fonctions create_reservation

**Pourquoi ?** Parce que les tools/fonctions nécessitent le serveur Node.js qui communique avec OpenAI via webhook. Cette page se connecte directement sans serveur.

## Pour tester les réservations complètes

Deux options :

### Option 1 : Attendre Twilio (3 jours)
- Finir la config Twilio
- Lancer le serveur (`npm run dev`)
- Appeler le vrai numéro
- → Tout marchera (conversation + réservations)

### Option 2 : Daily.co (1 heure)
- Pas besoin d'attendre
- Je peux vous guider
- Vos clients cliquent sur un lien
- → Conversation vocale + réservations complètes

## Questions ?

Lisez le guide complet : [TEST-MICRO.md](TEST-MICRO.md)

---

**Allez-y, testez maintenant ! 🎉**
