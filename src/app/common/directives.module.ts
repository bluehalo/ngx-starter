import { NgModule } from '@angular/core';

import { Transclusion } from './directives/transclusion.directive';
import { NamedTemplate } from './directives/named-template.directive';

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

export { Transclusion } from './directives/transclusion.directive';
export { NamedTemplate } from './directives/named-template.directive';
