# Rossel - Media Planning Application

Une application complète de planification média pour le groupe Rossel, développée avec Next.js et stockage local.

## Fonctionnalités

### 💾 Stockage Local
- Données sauvegardées dans le navigateur
- Pas de base de données externe requise
- Export/import des données possible
- Accès direct sans authentification

### 📊 Gestion des Campagnes
- Création et édition de campagnes publicitaires
- Gestion des dates et budgets
- Statuts de campagne (Brouillon, Active, Terminée, Annulée)
- Vue détaillée avec métriques

### 📅 Emplacements Publicitaires
- Tarifs basés sur la grille tarifaire Rossel (Le Soir, DH, Sudinfo, dhnet)
- Sélection interactive des dates de diffusion
- Calcul automatique des coûts avec remises
- Support multi-formats (Print, Web, Newsletter)

### 📈 Exports
- Export PDF avec mise en page professionnelle
- Export Excel détaillé avec multiple feuilles
- Récapitulatifs financiers automatiques

### 📊 Tableau de Bord
- Vue d'ensemble des métriques de campagnes
- Statistiques budgétaires et de performance
- Interface intuitive et responsive
- Accès rapide à toutes les fonctionnalités

## Technologies Utilisées

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Stockage**: Local Storage (navigateur)
- **Exports**: jsPDF, XLSX
- **UI**: Lucide React Icons
- **Dates**: date-fns, react-datepicker

## Installation et Configuration

### 1. Cloner le projet
\`\`\`bash
git clone <repository-url>
cd media-planning-lesoir
\`\`\`

### 2. Installer les dépendances
\`\`\`bash
npm install
\`\`\`

### 3. Configuration Firebase

1. Créer un projet Firebase sur [console.firebase.google.com](https://console.firebase.google.com)
2. Activer Authentication (Email et Google)
3. Créer une base Firestore
4. Récupérer la configuration Firebase

### 4. Variables d'environnement

Créer un fichier \`.env.local\` à la racine :

\`\`\`env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
\`\`\`

### 5. Démarrer en développement
\`\`\`bash
npm run dev
\`\`\`

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## Déploiement sur Vercel

### 1. Connecter à Vercel
1. Aller sur [vercel.com](https://vercel.com)
2. Connecter votre repository GitHub
3. Importer le projet

### 2. Configuration des variables
Dans le dashboard Vercel, ajouter les variables d'environnement :
- \`NEXT_PUBLIC_FIREBASE_API_KEY\`
- \`NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN\`
- \`NEXT_PUBLIC_FIREBASE_PROJECT_ID\`
- \`NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET\`
- \`NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID\`
- \`NEXT_PUBLIC_FIREBASE_APP_ID\`

### 3. Déployer
\`\`\`bash
npm run build
\`\`\`

Le déploiement se fait automatiquement à chaque push sur la branche main.

## Configuration Firebase Security Rules

### Firestore Rules
\`\`\`javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      allow read: if request.auth != null && request.auth.token.email == 'tom.vandevenne@rossel.be';
    }
    
    // Campaigns: users can CRUD their own, admin can see all
    match /campaigns/{campaignId} {
      allow read, write: if request.auth != null && 
        (resource.data.createdBy == request.auth.uid || 
         request.auth.token.email == 'tom.vandevenne@rossel.be');
      allow create: if request.auth != null;
    }
    
    // Placements: linked to campaigns
    match /placements/{placementId} {
      allow read, write: if request.auth != null;
    }
    
    // Clients: all authenticated users can read/write
    match /clients/{clientId} {
      allow read, write: if request.auth != null;
    }
    
    // Rate cards: read-only for all authenticated users
    match /rateCards/{rateCardId} {
      allow read: if request.auth != null;
    }
  }
}
\`\`\`

## Structure du Projet

\`\`\`
├── app/                    # App Router pages
├── components/             # Composants React
│   ├── auth/              # Authentification
│   ├── campaigns/         # Gestion campagnes
│   ├── layout/            # Layout components
│   └── admin/             # Panneau admin
├── contexts/              # React contexts
├── data/                  # Données statiques (tarifs)
├── lib/                   # Utilitaires et config
├── types/                 # Types TypeScript
└── public/                # Assets statiques
\`\`\`

## Tarifs Le Soir

Les tarifs sont définis dans \`data/rateCard.ts\` et incluent :

- **Le Soir Print** : Pages entières, 1/2, 1/4, 1/8 pages
- **Le Soir Weekend** : Tarifs weekend spéciaux
- **Site Web lesoir.be** : Display, Leaderboard, Rectangle
- **Newsletter** : Header, Rectangle, Footer

## Support et Maintenance

Pour toute question ou problème :
1. Vérifier les logs Vercel
2. Consulter la console Firebase
3. Contacter l'équipe de développement

## Licence

© 2024 Le Soir / Rossel. Tous droits réservés.