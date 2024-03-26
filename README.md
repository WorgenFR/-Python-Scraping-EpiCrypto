####  DOCUMENTATION DAT-901 - EpiCrypto

  

# I - Choix des technologies :

  

### 1- Back :

  

Côté Back, pour réaliser le scraping, nous avons fait un script Python avec deux librairies :

- Beautiful_Soup pour extraire des données des fichiers HTML

- Confluent_Kafka pour produire des messages vers un sujet Kafka

  

Nous avons également utilisé Socket IO ainsi que Flask, un framework pour construire des applications web.

  

### 2- Front :

  

Côté Front, nous avons opté pour une page unique HTML faisant appel à du CSS(Bootstrap)/JS pour les styles et le dynamisme.

Nous avons utilisé la library Chart.JS pour réalier les graphiques synthétisant les données.

  
  

# II - Cheminement des données :

  

- Récupération des données sur le site CoinGecko

- Traitement des données récupérées dans le script de scraping

- Envoi des données au format JSON au listener Kafka

- Réception des données et envoi des données via Socket IO vers le front

- Remplissage des tableaux/graphiques avec les données en JS

  

# III - Problèmes rencontrés :

  

- Nous avions dans un premier temps choisi Symfony pour l'interface graphique mais nous avons dû abandonner ce choix car nous

n'avons pas trouvé le moyen de réceptionner les données que nous envoyait le Kafka. Nous avons donc finalement opté pour un site

plus classique en HTML sans framework.

  

- Nous avons d'abord utilisé une base de données avant l'implémentation du Kafka en utilisant des requêtes SQL pour récupérer les données,

mais nous nous sommes rendus compte qu'après avoir implémenté Kafka, la base n'avait plus de réelle utilitée.

  

- Enfin, nous avons dû changer de site car les données récupérées initialement n'avait pas une durée d'actualisation suffisante pour ce que

nous souhaitions, cela a donc dû demander de réadapter le script de scraping.