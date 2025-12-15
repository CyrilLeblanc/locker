# Rapport Technique et Justification des Points du Barème

## **1. Fonctionnalités & Respect du Cahier des Charges (8 points)**

### **Authentification (2 points)**
- **Inscription et connexion avec JWT** :
  - Implémenté dans `src/routes/api/auth.js` avec les routes `/register` et `/login`.
  - Utilisation de `jsonwebtoken` pour générer et vérifier les tokens JWT.
  - Les mots de passe sont hachés avec `bcrypt` avant stockage (voir `src/models/user.js`).
- **Mot de passe oublié** :
  - Route `/forgot-password` pour envoyer un e-mail de réinitialisation (voir `src/core/mailer.js`).
  - Génération de jetons de réinitialisation sécurisés avec `crypto`.

### **Gestion des casiers (2 points)**
- **CRUD des casiers** :
  - Modèle `Locker` dans `src/models/locker.js` avec des méthodes statiques comme `findAvailable`.
  - Routes API pour ajouter, modifier et supprimer des casiers.
- **Informations stockées** :
  - Numéro, taille, statut et prix des casiers sont définis dans le schéma Mongoose.

### **Réservation et gestion des statuts (2 points)**
- **Réservation** :
  - Les utilisateurs peuvent réserver des casiers disponibles via l'interface utilisateur (voir `views/pages/user/dashboard.ejs`).
  - Modèle `Reservation` dans `src/models/reservation.js` pour gérer les statuts (actif, expiré, annulé).
- **Gestion automatique des statuts** :
  - Tâches en arrière-plan dans `src/core/jobs.js` pour gérer l'expiration et envoyer des rappels.

### **Notifications par e-mail (2 points)**
- **E-mails envoyés** :
  - Confirmation de réservation, rappel avant expiration et notification d'expiration (voir `src/core/mailer.js`).
  - Utilisation de `nodemailer` pour l'envoi des e-mails.

---

## **2. Qualité du Code & Architecture (5 points)**

### **Structure du code (2 points)**
- Architecture MVC respectée :
  - Modèles dans `src/models/`, contrôleurs dans `src/controllers/`, routes dans `src/routes/`.
  - Séparation des middlewares dans `src/middlewares/`.
- Utilisation de middlewares pour l'authentification (`authenticate`, `authenticatePage`).

### **Utilisation de MongoDB (1 point)**
- Modèles bien définis avec Mongoose.
- Requêtes optimisées grâce à des méthodes statiques (ex. `findAvailable`, `findExpired`).

### **Sécurisation (2 points)**
- Hachage des mots de passe avec `bcrypt`.
- Validation des entrées utilisateur dans `src/utils/validation.js`.
- Tokens JWT sécurisés avec une clé secrète définie dans les variables d'environnement.

---

## **3. Frontend (4 points)**

### **UI propre et responsive (2 points)**
- Utilisation de Bootstrap 5 pour un design moderne et responsive.
- Composants réutilisables dans `views/partials/` (ex. `nav.ejs`, `footer.ejs`).

### **Navigation fluide (1 point)**
- Scripts JavaScript dédiés pour chaque page dans `public/js/pages/`.
- Exemple : `dashboard.js` pour gérer les données dynamiques sur le tableau de bord utilisateur.

### **Interaction backend (1 point)**
- Requêtes AJAX pour récupérer les données en temps réel (ex. `fetchJson` dans `dashboard.js`).
- Synchronisation des états entre le backend et le frontend.

---

## **4. Présentation Orale (3 points)**

### **Explication claire du projet (1 point)**
- Documentation complète dans `docs/`.
- Explication des choix techniques et des fonctionnalités.

### **Démonstration fluide (1 point)**
- Scénarios de test préparés pour montrer les principales fonctionnalités (réservation, expiration, notifications).

### **Capacité à répondre aux questions (1 point)**
- Maîtrise des choix techniques (ex. pourquoi utiliser Mongoose, gestion des tokens JWT, etc.).

---

## **Conclusion**
Ce projet respecte les critères du barème et démontre une implémentation complète et soignée des fonctionnalités demandées. Chaque point du barème est couvert par des choix techniques justifiés et une architecture robuste.