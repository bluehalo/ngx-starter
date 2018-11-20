[![Build Status](https://travis-ci.org/Asymmetrik/ngx-starter.svg?branch=develop)](https://travis-ci.org/Asymmetrik/ngx-starter)
[![Maintainability](https://api.codeclimate.com/v1/badges/73f9115195f090de0556/maintainability)](https://codeclimate.com/github/Asymmetrik/ngx-starter/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/73f9115195f090de0556/test_coverage)](https://codeclimate.com/github/Asymmetrik/ngx-starter/test_coverage)

# ngx-starter
This project was generated with [Angular CLI](https://github.com/angular/angular-cli).
It provides a foundation on which to build custom applications that share common features and functionality.
Towards this goal, it provides common and reusable utilities.
In addition, it provices a reference application that demonstrates conventions and best practices.

This application tries to adhere to the [Angular Style Guide](https://angular.io/guide/styleguide).
The basic project structure is established by [Angular CLI](https://github.com/angular/angular-cli).
This documentation will only discuss aspects that are unique to it.

## Development

### NPM Scripts

This starter application provides a number of NPM tools for ease of development. Following sections go into further detail on some of these scripts:

npm run ... | Description
--- | ---
ng | Enters the Angular CLI.
start | Start the app for development that will rebuild and reload as you change files.
start:prod | Start the app for production by building assets into, and serving them from, the `./dist` directory.
build | Runs a development build that will ensure all code compiles correctly.
build:prod | Runs a production build that will output assets into the `./dist` directory.
build:bundle-report | Builds for development and starts a Webpack Bundle Analyzer on local port 8888. Then, opens a browser to this port. Useful in identifying module optimizations.
test | Run karma tests with a watcher that will update as you change files.
test:ci | Runs karma tests once and outputs code coverage results upon successful execution.
lint | Outputs a lint report to the console.
e2e | Runs end-to-end tests once and outputs test results to the console.

### Running the Development Server
`npm start` starts the development server.

This command will start the Angular.io application running in development mode.
It will run `ng serve --proxy-config proxy.conf.json`.

### Running the Development Server in Production Mode
`npm run start:prod` will run the development server in production mode.
This will run `ng serve --proxy-config proxy.conf.json --prod`.

### Tests
## Running unit tests
Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests
Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Proxy Config
When running the development server, all requests to `api/*` are proxied to `localhost:3000`.

### Proxy Config with PKI
To configure the development server for PKI mode, you can proxy the back-end requests through nginx.
To do this, configure nginx to listen on port 3000 and proxy requests through to your REST API.
You can configure nginx to hardcode append the `X-SSL-Client-S-DN` header for all requests so you don't actually have to use PKI in the browser.

```
# Cluster Definition
upstream app_cluster {
        ip_hash;
        server localhost:3000 fail_timeout=10s max_fails=0;
}

# Server Definition
server {

        listen 3001;
        server_name  localhost;

        # Server-specific access log
        access_log  /usr/local/var/log/nginx/ngx-starter.access.log  fmt_access;

        client_max_body_size 0;
        client_body_buffer_size 500M;

        # Forwarding all locations to the destination
        location / {

                # Set a header with the client DN
                proxy_set_header X-SSL-Client-S-DN 'reblace';
                proxy_set_header verify true;

                # Set the client's IP and Forwarded-For chain
                proxy_set_header Host                   $host;
                proxy_set_header X-Real-IP              $remote_addr;
                proxy_set_header X-Forwarded-For        $proxy_add_x_forwarded_for;

                # Forward traffic to the destination
                proxy_pass http://app_cluster;
                proxy_redirect off;
                proxy_buffering off;

                # Http upgrade settings for websockets
                proxy_http_version 1.1;
                proxy_set_header Upgrade $http_upgrade;
                proxy_set_header Connection "upgrade";

                # Proxy settings for applications
                proxy_set_header X-ProxyScheme $scheme;
                proxy_set_header X-Forwarded-Proto $scheme;
                proxy_set_header X-ProxyHost $host;
                proxy_set_header X-ProxyPort  443;
                proxy_set_header X-ProxyContextPath "";
        }
}
```

## Deployment

### Build
`npm run build` builds the project and outputs artifacts to `./dist`.

## Project Layout and Conventions
### Core, Common, Site
### Styles

## Authentication
### Pki Mode vs Login Mode
### Cookie-based Sessions
### HTTPInterceptors and AuthGuards 

## Further help
To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

