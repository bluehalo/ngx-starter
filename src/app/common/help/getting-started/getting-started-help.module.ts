import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap';

import { ExternalLinksComponent } from './external-links.component';
import { GettingStartedHelpComponent } from './getting-started-help.component';

@NgModule({
	imports: [
		AccordionModule.forRoot(),

		CommonModule
	],
	declarations:   [
		ExternalLinksComponent,
		GettingStartedHelpComponent
	],
	entryComponents: [
		GettingStartedHelpComponent
	]
})
export class GettingStartedHelpModule { }
