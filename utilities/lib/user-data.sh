#!/bin/bash

# Script Setup
sudo su
yum update -y

# PHP
sudo amazon-linux-extras install -y php8.0
# yum install -y php-mbstring php-xml php-fpm php-zip php-common php-fpm php-cli unzip curl

# Setup application folder
mkdir /var/www
mkdir /var/www/utilities
mkdir /var/www/utilities/public
touch /var/www/utilities/public/index.php
touch /etc/nginx/conf.d/utilities.conf

# Nginx
amazon-linux-extras install -y nginx1
wget -O /etc/nginx/conf.d/utilities.conf https://raw.githubusercontent.com/JamesLilliott/deployment/main/utilities/lib/nginx.conf

chmod -R 755 /var/www/utilities
echo "<?php phpinfo(); ?>" > /var/www/utilities/public/index.php

systemctl enable nginx
systemctl start nginx

# Composer
# curl -s https://getcomposer.org/installer | php
# mv composer.phar /usr/local/bin/composer
