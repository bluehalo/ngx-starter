import { Injectable, TemplateRef } from '@angular/core';

/**
 * Data store for application specific templates supplied to the site-container.
 */
@Injectable()
export class TemplateDataStore {
	static userPreferencesTemplate: TemplateRef<any>;

	public constructor() {}
}
