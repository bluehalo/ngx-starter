import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { PopoverModule } from 'ngx-bootstrap/popover';

import { InlineHelpLabelComponent } from './inline-help/inline-help-label.component';
import { InlineHelpLimitComponent } from './inline-help/inline-help-limit.component';
import { InlineHelpSyntaxComponent } from './inline-help/inline-help-syntax.component';
import { InlineHelpTooltipComponent } from './inline-help/inline-help-tooltip.component';

@NgModule({
	imports: [PopoverModule.forRoot(), CommonModule, RouterModule],
	exports: [
		InlineHelpLabelComponent,
		InlineHelpLimitComponent,
		InlineHelpSyntaxComponent,
		InlineHelpTooltipComponent
	],
	declarations: [
		InlineHelpLabelComponent,
		InlineHelpLimitComponent,
		InlineHelpSyntaxComponent,
		InlineHelpTooltipComponent
	]
})
export class InlineHelpLabelModule {}
