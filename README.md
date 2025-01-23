## Description du projet
Déploiement  d'une application web de soumission d'assurance automobile sur AWS cloud en utilisant  AWS EC2, S3, et le serveur apache. 
-  **AWS EC2**: est un serveur virtuel dans le cloud qui offre une capacité de calcul flexible en fonction du traffic sur le site web. Nous l'utiliserons pour héberger notre application web. 
-  **Amazon S3** : est un compartiment de stockage dans le cloud offrant un capacité de stockage théoriquement illimité. Dans notre projet nous l'utiliserons pour stocker les fichiers publiques(logos, images, icônes,...)

##  Étapes du déploiement 
### Etape 1: Creer et configurer le serveur 
###  Lancer une instance EC2
- **Créer un groupe de sécurité**: Le groupe de sécurité permet de définir les connexions entrantes et sortante sur notre serveur Web. Pour cela rechercher `groupe de sécurité` dans la barre de recherche.  Puis créer un groupe de sécurité `web-access` en définissant les connexions entrante et sortantes. Pour plus de details, [lire l'article sur AWS](https://docs.aws.amazon.com/vpc/latest/userguide/security-group-rules.html)  
- **Lancer une instance AWS EC2** : Dans  la barre de recherche saisir EC2 puis cliquer sur la premiere proposition. Choisir `Lancer des instances` , donner un nom au serveur, choisir le système d'exploitation (AMI) a installer sur le serveur Dans notre cas nous utiliseront `Amazon Linux`. Choisir le type d'instance `t2.micro` , générer une paire de clé qui permettra une connexion sécurise SSH. 
***Attention*** : le fichier générer doit être telecharger et sauvegarder en lieu sure. Toute personne ayant access pourrait se connecter a votre serveur. 
Par la suite, cliquer sur selectionner un groupe de securite et choisissez le groupe de securite creer precedement.  Finalement lancer votre instance. 

### Se connecter en mode ssh
- Ouvrez la le terminal et placer le fichier SSH générer précédemment (marius-login-server-web.pem dans mon cas ) dans le repertoire courant. 
- Exécuter la commande suivant pour éviter que la clé soit visible publiquement. 
`chmod 400 marius-login-server-web.pem`
- Puis se connecter avec la commande 
`ssh -i "marius-login-server-web.pem" ec2- user@ec2-52-91-230-249.compute-1.amazonaws.com`

### Installer le serveur apache. 
Une fois connecter sur le serveur EC2, créer un fichier avec la commande `sudo nano install-apache.sh` dans le fichier saisir le script shell suivant:
```
#!/bin/bash
# Mettre a jour les paquets
yum  update -y && yum upgrade -y

# Installer apache2
yum install -y  httpd

# Activer Apache
systemctl enable  httpd

# Demarrer le serveur
systemctl start httpd
#That's it :)
```
Verifier si le serveur est bien installer pour cela, copier l'adresse public de l'instance AWS EC2 et le placer dans votre navigateur le message  "It works!" devrait apparaître 
Créer le repertoire de l'application web et se déplacer `mkdir  /var/www/html/reclamation-assurance ; cd   /var/www/html/reclamation-assurance`

Y mettre tous les codes sources et fichier nécessaire pour la creation de l'application web. Verifier si tout fonctionne en utilisant l'adresse http://52.91.230.249/reclamation-assurance/
Tous fonctionne sauf les images qui ne s'affiche pas. Pour palier a cela nous aurons besoin de AWS S3

### Étape 2: Créer un compartiment de stockage AWS S3 pour y mettre les fichiers publique de l'application.
#### Créer un compartiment S3
Dans la barre de recherche, choisir S3 puis cliquez sur créer un compartiment. Donner un nom au compartiment puis décocher ***Bloquer tous les accès publics*** pour permettre a l'application de lire les images. Puis cliquer sur créer un compartiment. 
### Definir la strategies du compartiment
La stratégie de compartiment, écrite au format JSON, permet d'accéder aux objets stockés dans le compartiment. Les stratégies de compartiment ne s'appliquent pas aux objets appartenant à d'autres comptes. 
```
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::arn:aws:s3:::marius-uqam-web/*"
    }
  ]
}
```
### Charger les images
Charger les images dans le compartiments créer puis copier l'url de chaque images pour le placer a l'endroit dans le code de l'application.

## Lancer l'application 
Copier l'adresse publique dans le navigateur http://52.91.230.249/reclamation-assurance/
L'application est désormais déployer dans AWS cloud. 
Capture d'ecran du projet [screenshot](https://github.com/Guimatsia123/deploiement-app-web-aws-cloud-ec2-s3/blob/main/screenshot025-01-22%2021-26-12.png)


