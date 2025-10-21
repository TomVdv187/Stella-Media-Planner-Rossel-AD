# Stella Media Planner - Rossel AD

Application de planification média pour le groupe Rossel, développée avec Next.js et stockage local. **Aucune authentification ou base de données externe requise.**

## ✨ Fonctionnalités

### 💾 **Stockage Local**
- Toutes les données sauvegardées dans le navigateur
- Aucune base de données externe
- Accès instantané sans connexion
- Export/import des données possible

### 📊 **Gestion des Campagnes**
- Création et édition de campagnes publicitaires
- Gestion des budgets et périodes
- Statuts : Brouillon, Active, Terminée, Annulée
- Calculs automatiques des totaux

### 📅 **Emplacements Publicitaires**
- **Le Soir** : Print (pages entières, 1/2, 1/4, 1/8) + Web + Newsletter
- **La Dernière Heure** : Formats print classiques
- **Sudinfo.be** : Formats web avec CPM
- **dhnet.be** : Formats web DH
- Sélection interactive des dates de diffusion
- Calcul automatique des coûts avec remises

### 📈 **Exports**
- **PDF** : Mise en page professionnelle avec branding Rossel
- **Excel** : Détails complets sur plusieurs feuilles
- Récapitulatifs financiers automatiques

### 📱 **Interface**
- Design responsive (mobile, tablette, desktop)
- Interface moderne aux couleurs Rossel
- Statistiques en temps réel

## 🚀 Installation

```bash
# 1. Cloner le projet
git clone https://github.com/TomVdv187/Stella-Media-Planner-Rossel-AD.git
cd Stella-Media-Planner-Rossel-AD

# 2. Installer les dépendances
npm install

# 3. Démarrer en développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📦 Déploiement

### Vercel (Recommandé)
1. Connecter le repository à [vercel.com](https://vercel.com)
2. Cliquer "Deploy"
3. **Aucune configuration requise !**

### Autres Plateformes
- Compatible avec Netlify, Surge, GitHub Pages
- Build statique : `npm run build`

## 🛠 Technologies

- **Next.js 14** - Framework React avec App Router
- **TypeScript** - Typage statique pour la robustesse
- **Tailwind CSS** - Framework CSS utilitaire
- **Local Storage** - Persistance des données
- **jsPDF & XLSX** - Génération d'exports
- **Lucide React** - Icônes modernes

## 📋 Structure des Données

### Campagnes
```typescript
interface Campaign {
  id: string;
  name: string;
  client: string;
  startDate: Date;
  endDate: Date;
  budget: number;
  status: 'draft' | 'active' | 'completed' | 'cancelled';
  totalCost: number;
  totalImpressions: number;
}
```

### Emplacements
```typescript
interface Placement {
  id: string;
  campaignId: string;
  publication: string;
  adType: string;
  position: string;
  size: string;
  dates: Date[];
  quantity: number;
  unitPrice: number;
  finalPrice: number;
  discount: number;
}
```

## 🎯 Guide d'Utilisation

### 1. Créer une Campagne
- Cliquer "Nouvelle campagne"
- Remplir nom, client, dates, budget
- Sélectionner le statut

### 2. Ajouter des Emplacements
- Ouvrir une campagne
- Cliquer "Ajouter un emplacement"
- Choisir publication, format, dates
- Les prix se calculent automatiquement

### 3. Gérer les Coûts
- Appliquer des remises en pourcentage
- Voir les totaux en temps réel
- Comparer avec le budget alloué

### 4. Exporter les Données
- PDF pour présentations client
- Excel pour analyses détaillées
- Tous les calculs inclus

## 📊 Tarification Rossel

| Publication | Types Disponibles | Formats |
|-------------|------------------|---------|
| **Le Soir** | Print, Web, Newsletter | Tous formats (page entière à 1/8) |
| **La Dernière Heure** | Print | Pages entières, 1/2, 1/4 page |
| **Sudinfo.be** | Web | Leaderboard, Rectangle, Skyscraper |
| **dhnet.be** | Web | Display formats avec CPM |

## 🔧 Personnalisation

### Modifier les Tarifs
Éditer le fichier `data/rateCard.ts` :
```typescript
export const rateCardData: RateCard[] = [
  {
    publication: "Nouvelle Publication",
    adTypes: [
      // Ajouter nouveaux formats
    ]
  }
];
```

### Modifier les Couleurs
Éditer `tailwind.config.js` :
```javascript
colors: {
  rossel: {
    blue: '#003366',
    red: '#E53E3E',
    gold: '#FFD700',
  }
}
```

## 📁 Structure du Projet

```
├── app/                    # Pages Next.js (App Router)
├── components/             # Composants React
│   ├── campaigns/         # Gestion des campagnes
│   └── layout/            # Composants de mise en page
├── data/                  # Données statiques (tarifs)
├── lib/                   # Utilitaires (stockage, export)
├── types/                 # Types TypeScript
└── public/                # Assets statiques
```

## 💾 Gestion des Données

### Stockage
- **Local Storage** : Toutes les données dans le navigateur
- **Persistance** : Les données survivent aux redémarrages
- **Sécurité** : Aucune donnée n'est envoyée vers l'extérieur

### Sauvegarde
```typescript
// Export manuel des données
const data = exportAllData();
console.log(JSON.stringify(data));

// Import de données
importData(jsonData);
```

## 🐛 Dépannage

### Données Perdues
1. Vérifier que JavaScript est activé
2. Contrôler l'espace de stockage disponible
3. Éviter le mode navigation privée

### Problèmes d'Export
1. Autoriser les téléchargements popup
2. Vérifier l'espace disque disponible
3. Tester avec un autre navigateur

## 🚀 Déploiement Production

### Variables d'Environnement
**Aucune variable requise** - L'application fonctionne entièrement côté client.

### Optimisations
- Build optimisé avec Next.js
- Compression automatique des assets
- Cache navigateur configuré

## 📞 Support

- **GitHub Issues** : [Créer un ticket](https://github.com/TomVdv187/Stella-Media-Planner-Rossel-AD/issues)
- **Documentation** : README et guides inclus
- **Contact** : Équipe technique Rossel

---

## 📄 Licence

© 2024 Groupe Rossel. Tous droits réservés.

**Développé avec ❤️ pour le groupe Rossel**