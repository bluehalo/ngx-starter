import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { FlyoutComponent } from './flyout/flyout.component';

@NgModule({
	imports: [CommonModule],
	exports: [FlyoutComponent],
	declarations: [FlyoutComponent]
})
export class FlyoutModule {}
