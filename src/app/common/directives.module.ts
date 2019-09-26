import { NgModule } from '@angular/core';

import { TransclusionDirective } from './directives/transclusion.directive';
import { NamedTemplateDirective } from './directives/named-template.directive';
import { SkipToDirective } from './directives/skip-to.directive';

@NgModule({
	imports: [],
	exports: [
		TransclusionDirective,
		NamedTemplateDirective,
		SkipToDirective
	],
	declarations: [
		TransclusionDirective,
		NamedTemplateDirective,
		SkipToDirective
	],
	providers: []
})
export class DirectivesModule { }

export { TransclusionDirective } from './directives/transclusion.directive';
export { NamedTemplateDirective } from './directives/named-template.directive';
export { SkipToDirective } from './directives/skip-to.directive';
