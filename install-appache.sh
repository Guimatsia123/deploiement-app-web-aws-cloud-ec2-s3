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