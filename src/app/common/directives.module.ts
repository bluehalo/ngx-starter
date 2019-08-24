import { NgModule } from '@angular/core';

import { Transclusion } from './directives/transclusion.directive';
import { NamedTemplate } from './directives/named-template.directive';
import { SkipToDirective } from './directives/skip-to.directive';

@NgModule({
	imports: [],
	exports: [
		Transclusion,
		NamedTemplate,
		SkipToDirective
	],
	declarations: [
		Transclusion,
		NamedTemplate,
		SkipToDirective
	],
	providers: []
})
export class DirectivesModule { }

export { Transclusion } from './directives/transclusion.directive';
export { NamedTemplate } from './directives/named-template.directive';
