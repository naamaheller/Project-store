FROM php:8.2-fpm

RUN apt-get update && apt-get install -y \
    git \
    unzip \
    zip \
    libzip-dev \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install zip pdo pdo_mysql gd \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www/html

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

COPY . .

RUN composer install --no-interaction --prefer-dist

EXPOSE 9000

CMD ["php-fpm"]
