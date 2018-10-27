# ngx-starter

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 6.1.5.

Provides an Angular.io front-end single page application with common functionality already built in.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).


## Notes

### FF issue with Prod Mode
https://github.com/angular/angular-cli/issues/9340
Will potentially be fixed in Angular cli 7.x

Added explicit references
```
    "uglify-es": "3.2.2",
    "uglifyjs-webpack-plugin": "1.1.5",
```

And, added resolutions section
```
  "resolutions": {
    "uglify-es": "3.2.2",
    "uglifyjs-webpack-plugin": "1.1.5"
  }
```
