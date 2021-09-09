#!/bin/bash

# Script Setup
sudo su
yum update -y

# PHP
sudo amazon-linux-extras install -y php8.0
# yum install -y php-mbstring php-xml php-fpm php-zip php-common php-fpm php-cli unzip curl

# Nginx
sudo amazon-linux-extras install -y nginx1
systemctl enable nginx
systemctl start nginx

# Install Composer
curl -s https://getcomposer.org/installer | php
mv composer.phar /usr/local/bin/composer

# Sample page
echo "<h1>Hello World from $(hostname -f)</h1>" > /var/www/html/index.html

mkdir /var/www/utilities

