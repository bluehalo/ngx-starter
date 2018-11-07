import { NgModule } from '@angular/core';

import { Transclusion } from './transclusion.directive';
import { NamedTemplate } from './named-template.directive';

@NgModule({
	imports: [],
	exports: [
		Transclusion,
		NamedTemplate,
	],
	declarations: [
		Transclusion,
		NamedTemplate,
	],
	providers: []
})
export class DirectivesModule { }
