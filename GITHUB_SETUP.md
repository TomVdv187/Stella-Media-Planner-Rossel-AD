# 🚀 GitHub Setup Instructions

## Étape 1: Créer le Repository GitHub

1. **Aller sur GitHub.com** et se connecter
2. **Cliquer sur "New repository"** (bouton vert)
3. **Remplir les informations** :
   - **Repository name**: `rossel-media-planning`
   - **Description**: `Application de planification média pour le groupe Rossel - Next.js avec stockage local`
   - **Visibility**: Public ✅
   - **Initialize**: ❌ Ne PAS cocher (le code existe déjà)

4. **Cliquer "Create repository"**

## Étape 2: Pousser le Code

Copier ces commandes dans le terminal (dossier actuel) :

```bash
# Ajouter l'origine GitHub (remplacer YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/rossel-media-planning.git

# Renommer la branche principale
git branch -M main

# Pousser le code
git push -u origin main
```

## Étape 3: Vérification

✅ Le repository devrait maintenant contenir :
- Tous les fichiers de l'application
- README avec documentation complète
- Configuration prête pour Vercel

## Étape 4: Déploiement Vercel (Optionnel)

1. **Aller sur vercel.com**
2. **Se connecter avec GitHub**
3. **Cliquer "New Project"**
4. **Sélectionner "rossel-media-planning"**
5. **Cliquer "Deploy"** (aucune configuration requise)

---

## URLs Utiles

- **Repository**: `https://github.com/YOUR_USERNAME/rossel-media-planning`
- **Vercel App**: `https://rossel-media-planning.vercel.app` (après déploiement)
- **Documentation**: README.md dans le repository

## Support

Si vous rencontrez des problèmes :
1. Vérifier que Git est configuré avec vos credentials GitHub
2. Utiliser GitHub Desktop si vous préférez une interface graphique
3. Consulter la documentation GitHub pour l'authentification

---

**Application créée avec Claude Code** 🤖