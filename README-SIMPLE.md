# Rossel - Media Planning Application

Application simplifiée de planification média pour le groupe Rossel, sans authentification ni base de données externe.

## ✨ Fonctionnalités Principales

### 💾 **Stockage Local**
- Toutes les données sont sauvegardées dans le navigateur
- Aucune base de données externe requise
- Accès direct sans connexion

### 📊 **Gestion des Campagnes**
- Création et édition de campagnes publicitaires
- Gestion des budgets et périodes
- Statuts : Brouillon, Active, Terminée, Annulée

### 📅 **Emplacements Publicitaires**
- **Le Soir** : Print (pages entières, 1/2, 1/4, 1/8) + Web + Newsletter
- **La Dernière Heure** : Formats print classiques
- **Sudinfo.be & dhnet.be** : Formats web avec CPM
- Calcul automatique des coûts avec remises
- Sélection interactive des dates de diffusion

### 📈 **Exports**
- **PDF** : Mise en page professionnelle avec logo Rossel
- **Excel** : Détails complets sur plusieurs feuilles
- Récapitulatifs financiers automatiques

### 📱 **Interface**
- Design responsive (mobile, tablette, desktop)
- Interface intuitive et moderne
- Statistiques en temps réel

## 🚀 Installation Rapide

```bash
# 1. Cloner le projet
git clone <repository-url>
cd media-planning-rossel

# 2. Installer les dépendances
npm install

# 3. Démarrer en développement
npm run dev
```

L'application sera disponible sur [http://localhost:3000](http://localhost:3000)

## 📦 Déploiement Vercel

1. Connecter le repository à [vercel.com](https://vercel.com)
2. Cliquer "Deploy"
3. C'est tout ! Aucune configuration supplémentaire requise

## 🛠 Technologies

- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Styles
- **Local Storage** - Persistance données
- **jsPDF & XLSX** - Exports
- **Lucide React** - Icônes

## 📋 Structure des Données

### Campagnes
- Nom, client, dates, budget, statut
- Calcul automatique des totaux
- Historique des modifications

### Emplacements
- Publication, type, position, taille
- Dates de diffusion multiples
- Prix unitaire et remises
- Notes optionnelles

## 🎯 Tarification Rossel

| Publication | Types | Formats |
|-------------|-------|---------|
| **Le Soir** | Print, Web, Newsletter | Tous formats disponibles |
| **DH** | Print | Pages entières à 1/4 page |
| **Sudinfo.be** | Web | Leaderboard, Rectangle, Skyscraper |
| **dhnet.be** | Web | Display formats avec CPM |

## 💡 Utilisation

1. **Créer une campagne** : Cliquer "Nouvelle campagne"
2. **Ajouter des emplacements** : Sélectionner publication, format, dates
3. **Suivre les coûts** : Calculs automatiques en temps réel
4. **Exporter** : PDF pour présentation ou Excel pour analyse

## 🔧 Personnalisation

Pour modifier les tarifs ou ajouter de nouveaux formats :
- Éditer le fichier `data/rateCard.ts`
- Redémarrer l'application

## 📞 Support

- **Issues** : Créer un ticket GitHub
- **Documentation** : README complet disponible
- **Contact** : Équipe développement Rossel

---

**Groupe Rossel © 2024** - Application développée pour la planification média interne