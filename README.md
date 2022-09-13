# Application Social-Media

[![forthebadge](https://forthebadge.com/images/badges/made-with-javascript.svg)](https://forthebadge.com)

Réseau social interne pour l'entreprise Groupomania

## Pour commencer

Ajoutez la clé secrète du token, les informations de la base de donnée et les informations de la plateforme Cloudinary au fichier "exemple.env" dans le répertoire "serveur" et à nouveau les informations de Cloudinary dans le même fichier du répertoire "client" puis renommer les fichiers ".env".

### Pré-requis

- Node JS
- MySQL

### Installation

Executez la commande `npm install --global yarn` dans un terminal pour utiliser Yarn sur votre ordinateur local et la commande `yarn install` depuis les répertoires "client" et "server" pour installer les modules des applications front-end et back-end. Mettez en place la base de donnée en commencant par vous connecter à MySQL et en créant un nouveau schema avec la commande `CREATE DATABASE groupomania;`. Ensuite importer le fichier Dump.sql grâce à l'invite de commande en ajoutant le chemin vers MySQL pour vous connecter et en utilisant la commande `mysql -u username -p groupomania < Dump.sql` depuis le répertoire où se trouve le fichier.

## Démarrage

Executez la commande `yarn start` dans un terminal depuis le répertoire "client" pour lancer l'application front-end et la commande `node server` depuis le répertoire "server" pour l'application back-end.

## Fabriqué avec

- [React JS](http://materializecss.com) - Une bibliothèque JavaScript pour créer des interfaces utilisateurs
- [Node JS](https://nodejs.org) - Runtime JS
- [Express JS](https://expressjs.com) - Framework Node.JS
- [MySQL](https://www.mysql.com) - Système de gestion de bases de données
- [Cloudinary](https://cloudinary.com) - Plateforme spécialisée dans le traitement et la distribution d'images pour les applications Web

## Versions

**Dernière version :** 0.1

## Auteurs

- **Quentin Cuoc** _alias_ [@Quentin7722](https://github.com/Quentin7722)
