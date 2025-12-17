# **Projet 2 : Réservation de Casiers**

Cette application permet aux utilisateurs de réserver un casier en ligne, sur le même
principe que la réservation de places au cinéma. Chaque casier a une durée de réservation
et est libéré automatiquement une fois expiré.

## **Objectifs**

- Permettre la réservation rapide et intuitive d'un casier.
- Automatiser l'expiration et la libération des casiers.
- Notifier l'utilisateur par e-mail à chaque étape.

**Fonctionnalités**

## 1. **Authentification \& gestion des utilisateurs**

- Inscription et connexion avec JWT.
- Mot de passe oublié (e-mail de récupération).
- Rôles : Utilisateur et Admin.

## 2. **Gestion des casiers**

Ajout, modification et suppression d'un casier par l'admin.

- Informations stockées : Numéro du casier, Taille, Statut, Prix.

## 3. **Réservation d'un casier**

- L'utilisateur sélectionne un casier disponible.
- Il choisit une durée de réservation.
- Paiement fictif via Stripe (optionnel).
- Envoi d'un e-mail de confirmation avec le numéro du casier et la durée.

## 4. **Expiration et libération du casier**

- L'application gère automatiquement l'expiration.
- Envoi d'un e-mail de rappel avant expiration.
- Une fois expiré, le casier est libéré et remis en stock.

## 5. **Notifications par e-mail**

- Confirmation de réservation, Rappel avant expiration du casier, Mot de passe oublié.
