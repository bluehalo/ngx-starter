import { makeEnvironmentProviders } from '@angular/core';

import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';

import { NgbDateCustomAdapter } from './ngb-date-custom-adapter';

export function provideNgbDateAdapter() {
	return makeEnvironmentProviders([
		{
			provide: NgbDateAdapter,
			useClass: NgbDateCustomAdapter
		}
	]);
}
