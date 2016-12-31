# Flash Cards

This application provides a simple interface to create flash cards with hints.
<!-- TOC -->

- [Flash Cards](#flash-cards)
    - [Setup](#setup)
        - [Install dependencies](#install-dependencies)
        - [Install knex](#install-knex)
        - [Run latest migration](#run-latest-migration)
    - [Running application](#running-application)
    - [Make changes to config](#make-changes-to-config)
    - [Modifications to js or css](#modifications-to-js-or-css)

<!-- /TOC -->


## Setup

### Install dependencies

```
npm install

```

### Install knex

```
npm install knex -g
```

### Run latest migration

Application use base sqlite database from [here](https://github.com/jwasham/computer-science-flash-cards/blob/master/cards-jwasham-extreme.db)

```
knex migrate:latest
```

## Running application
```
node app.js
```

[PM2](https://github.com/Unitech/pm2) is recommended.

## Make changes to config

Set default setting and a super strong password in  [config.js](/config.js)

## Modifications to js or css

Make changes to web-app/ and Run

```
gulp
```
 