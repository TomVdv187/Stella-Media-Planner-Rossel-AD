# Guide de Déploiement - Le Soir Media Planning

## 📋 Prérequis

1. **Compte Firebase**
   - Projet Firebase créé
   - Authentication activée (Email + Google)
   - Firestore configuré
   - Domaine autorisé pour l'authentification

2. **Compte Vercel**
   - Compte Vercel connecté à GitHub
   - Accès au repository

## 🔥 Configuration Firebase

### 1. Créer le projet Firebase
1. Aller sur [Firebase Console](https://console.firebase.google.com)
2. Cliquer sur "Ajouter un projet"
3. Nommer le projet : "lesoir-media-planning"
4. Activer Google Analytics (optionnel)

### 2. Configurer Authentication
1. Dans la console Firebase, aller dans "Authentication"
2. Onglet "Sign-in method"
3. Activer "Email/Password"
4. Activer "Google" et configurer
5. Dans "Authorized domains", ajouter votre domaine Vercel

### 3. Configurer Firestore
1. Aller dans "Firestore Database"
2. Créer la base de données en mode "test" puis production
3. Appliquer les règles de sécurité :

\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.token.email == 'tom.vandevenne@rossel.be';
    }
    
    match /campaigns/{campaignId} {
      allow read, write: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || 
         request.auth.token.email == 'tom.vandevenne@rossel.be');
      allow create: if request.auth != null;
    }
    
    match /placements/{placementId} {
      allow read, write: if request.auth != null;
    }
    
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    match /rateCards/{rateCardId} {
      allow read: if request.auth != null;
    }
  }
}
\`\`\`

### 4. Récupérer la configuration
1. Aller dans "Project Settings" (roue dentée)
2. Défiler vers "Your apps"
3. Créer une app web
4. Copier la configuration Firebase

## 🚀 Déploiement sur Vercel

### 1. Préparer le repository
1. Pousser le code sur GitHub
2. S'assurer que tous les fichiers sont présents
3. Vérifier que le \`.env.local.example\` est inclus

### 2. Connecter à Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Se connecter avec GitHub
3. Cliquer "New Project"
4. Sélectionner le repository "media-planning-lesoir"

### 3. Configuration du projet
1. **Framework Preset**: Next.js
2. **Root Directory**: \`./\` (racine)
3. **Build Command**: \`npm run build\`
4. **Install Command**: \`npm install\`

### 4. Variables d'environnement
Dans les paramètres Vercel, ajouter :

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=lesoir-media-planning.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=lesoir-media-planning
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=lesoir-media-planning.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
\`\`\`

### 5. Déployer
1. Cliquer "Deploy"
2. Attendre la fin du build
3. Tester l'application

## 🔧 Configuration Post-Déploiement

### 1. Autoriser le domaine Vercel
1. Dans Firebase Console > Authentication > Settings
2. Ajouter le domaine Vercel dans "Authorized domains"
3. Format : \`your-app.vercel.app\`

### 2. Configurer Google OAuth
1. Dans Google Cloud Console
2. Ajouter le domaine Vercel aux origines autorisées
3. Ajouter l'URL de redirection

### 3. Tester l'application
1. Ouvrir l'URL Vercel
2. Tester la connexion email
3. Tester la connexion Google
4. Vérifier les permissions admin pour tom.vandevenne@rossel.be

## 📊 Monitoring et Maintenance

### 1. Monitoring Vercel
- Vérifier les logs de déploiement
- Surveiller les métriques de performance
- Configurer les alertes si nécessaire

### 2. Monitoring Firebase
- Surveiller l'utilisation Firestore
- Vérifier les logs d'authentification
- Monitorer les erreurs dans la console

### 3. Mises à jour
1. Développer localement
2. Tester en local
3. Pousser sur GitHub
4. Vercel redéploie automatiquement

## 🆘 Dépannage

### Problème d'authentification
1. Vérifier les domaines autorisés Firebase
2. Contrôler les variables d'environnement
3. Vérifier la configuration Google OAuth

### Erreurs Firestore
1. Vérifier les règles de sécurité
2. Contrôler les permissions
3. Vérifier la structure des données

### Erreurs de build
1. Vérifier les dépendances dans package.json
2. Contrôler les imports/exports
3. Vérifier les variables d'environnement

## 📞 Support

En cas de problème :
1. Consulter les logs Vercel
2. Vérifier la console Firebase
3. Contacter l'équipe technique

## ✅ Checklist de Déploiement

- [ ] Projet Firebase créé et configuré
- [ ] Authentication activée (Email + Google)
- [ ] Firestore configuré avec les bonnes règles
- [ ] Variables d'environnement définies
- [ ] Application déployée sur Vercel
- [ ] Domaines autorisés configurés
- [ ] Tests de connexion réussis
- [ ] Permissions admin vérifiées pour Tom
- [ ] Monitoring activé

L'application est maintenant prête pour la production ! 🎉