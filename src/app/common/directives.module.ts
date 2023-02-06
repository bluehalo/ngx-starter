import { NgModule } from '@angular/core';

import { LinkAccessibilityDirective } from './directives/link-accessibility.directive';
import { SkipToDirective } from './directives/skip-to.directive';

@NgModule({
	imports: [],
	exports: [SkipToDirective, LinkAccessibilityDirective],
	declarations: [SkipToDirective, LinkAccessibilityDirective],
	providers: []
})
export class DirectivesModule {}
