// This file is required by karma.conf.js and loads recursively all the .spec and framework files

/* tslint:disable:ordered-imports */
// we need to import this file first in order to use fakeAsync
import 'zone.js/testing';

import { getTestBed } from '@angular/core/testing';
import {
	platformBrowserDynamicTesting,
	BrowserDynamicTestingModule
} from '@angular/platform-browser-dynamic/testing';

declare const require: any;

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting(), {
	teardown: { destroyAfterEach: false }
});
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
