# 🔧 Solution au problème CORS

## 🚨 Le problème

Quand vous ouvrez `test-micro.html` directement (double-clic), vous voyez :
```
Cross origin requests are only supported for HTTP.
TypeError: Load failed
```

**Cause** : Les navigateurs bloquent les requêtes API depuis les fichiers locaux (`file://`)

---

## ✅ Solution immédiate (30 secondes)

### **Lancer un serveur HTTP local**

```bash
./serveur-test.sh
```

**C'est tout !** Le script :
1. Lance un serveur HTTP sur le port 8080
2. Vous donne l'URL à ouvrir

### **Ensuite :**

1. Ouvrez votre navigateur
2. Allez sur : **http://localhost:8080/test-micro.html**
3. Entrez votre clé API
4. Cliquez sur "🎤 Démarrer l'appel test"
5. **Ça marche !** ✅

---

## 🌐 Pourquoi ça marche ?

| Méthode | Protocole | CORS | Status |
|---------|-----------|------|--------|
| Double-clic | `file://` | ❌ Bloqué | Ne marche pas |
| Serveur local | `http://` | ✅ OK | ✅ Marche |
| GitHub Pages | `https://` | ✅ OK | ✅ Marche |

Les navigateurs n'autorisent les requêtes API que depuis `http://` ou `https://`, pas depuis `file://`.

---

## 🚀 Alternative : GitHub Pages (pour partager)

Si vous voulez partager la page avec d'autres personnes :

### **Étapes :**

1. **Créez un repository GitHub**
   - Allez sur https://github.com/new
   - Nom : `vacances-bleues-assistant`
   - Public ou Private

2. **Poussez votre code**
   ```bash
   git remote remove origin
   git remote add origin https://github.com/VOTRE_USERNAME/vacances-bleues-assistant.git
   git push -u origin main
   ```

3. **Activez GitHub Pages**
   - Settings du repo > Pages
   - Source : `main` branch
   - Save

4. **Attendez 2 minutes**, puis votre page sera sur :
   ```
   https://VOTRE_USERNAME.github.io/vacances-bleues-assistant/test-micro.html
   ```

**Avantage** : Vous pouvez partager ce lien avec d'autres personnes !

---

## 🎯 Résumé

| Solution | Rapidité | Utilité |
|----------|----------|---------|
| **Serveur local** | ⚡ 30 sec | Tester maintenant |
| **GitHub Pages** | 🕐 5 min | Partager avec d'autres |
| **Playground OpenAI** | ⚡ 0 sec | Alternative officielle |

---

## 💡 Recommandation

**Pour tester MAINTENANT :**
```bash
./serveur-test.sh
# Puis ouvrez http://localhost:8080/test-micro.html
```

**Pour montrer à d'autres :**
- Utilisez GitHub Pages (suivez les étapes ci-dessus)

**Pour une démo rapide :**
- Utilisez le Playground OpenAI : https://platform.openai.com/playground/realtime

---

## 🆘 Problème avec le serveur local ?

### "Port 8080 already in use"

Un autre processus utilise le port 8080.

**Solution :**
```bash
# Tuer le processus sur le port 8080
lsof -ti:8080 | xargs kill -9

# Ou utiliser un autre port
python3 -m http.server 8081
# Puis ouvrez http://localhost:8081/test-micro.html
```

### "Python not found"

Python n'est pas installé.

**Solution :**
```bash
# Avec Node.js
npx http-server -p 8080

# Puis ouvrez http://localhost:8080/test-micro.html
```

---

## ✅ Prochaine étape

**Lancez le serveur et testez !**

```bash
./serveur-test.sh
```

Puis dites-moi si ça marche ! 🚀
