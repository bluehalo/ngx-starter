import { NgModule } from '@angular/core';

import { SkipToDirective } from './directives/skip-to.directive';

@NgModule({
	imports: [],
	exports: [SkipToDirective],
	declarations: [SkipToDirective],
	providers: []
})
export class DirectivesModule {}

export { SkipToDirective } from './directives/skip-to.directive';
