# Nom du Projet

Description du projet.

## Prérequis

- Node.js (version recommandée: 14.x ou supérieure)
- npm (version recommandée: 6.x ou supérieure)
- MySQL (pour la base de données)

## Installation

### 1. Cloner le dépôt

```bash
git clone https://github.com/votre-repo.git
cd votre-repo

### 2. Configuration du Backend 

#### a. Allez dans le répertoire backend bash Copier le code `cd backend'


#### b. Installer les dépendances bash Copier le code `npm ci'


#### c. Configuration de la base de données 
* Assurez-vous que MySQL est installé et en cours d'exécution. 
* Créez la base de données et les tables nécessaires. 
* Créez un fichier `.env` à la racine du dossier `backend` et configurez les paramètres de la base de données. Exemple :

DB_HOST=localhost 
DB_USER=votre-username 
DB_PASSWORD=votre-password
DB_NAME=votre-database
DB_PORT=votre-DB_PORT
PORT=port_du_front

#### d. Démarrer le serveur backend bash Copier le code `npm start'

### 3. Configuration du Frontend 

#### a. Allez dans le répertoire frontend bash Copier le code `cd ../frontend`

#### b. Installer les dépendances npm bash Copier le code `npm ci`

#### c. Démarrer l'application frontend bash Copier le code `npm start`

### 4. Utilisation 

* Ouvrez votre navigateur et accédez à `http://localhost:3000` pour voir l'application frontend. 

* Le backend écoute par sur le port que vous avez définis dans le .env du backend.

### Dépendances Backend

express
body-parser
cors
dotenv
mysql2
fastpriorityqueue


###  Dépendances Frontend

@react-google-maps/api
@testing-library/jest-dom
@testing-library/react
@testing-library/user-event
@vis.gl/react-google-maps
axios
bootstrap
jwt-decode
leaflet
leaflet.markercluster
lodash
react
react-bootstrap
react-dom
react-leaflet
react-leaflet-markercluster
react-router-dom
react-scripts
web-vitals



### Remarques
Assurez-vous que tous les ports nécessaires sont ouverts et disponibles.
Mettez à jour les variables d'environnement dans le fichier .env selon vos configurations locales.



### Points Clés

- **Utilisation de `npm ci`** : Cette commande installe les dépendances exactement comme spécifiées dans le fichier `package-lock.json`, assurant ainsi une cohérence entre les environnements.
- **Fichier `.env`** : Assurez-vous que les utilisateurs créent et configurent ce fichier pour les variables d'environnement sensibles comme les informations de connexion à la base de données.
- **Structure du projet** : Donnez une vue d'ensemble de la structure du projet pour que les contributeurs sachent où se trouvent les fichiers clés.

En suivant ce `README.md`, vous garantissez une configuration et une installation cohérentes pour votre projet sur différentes machines.