import { NgModule } from '@angular/core';
import { FlyoutComponent } from './flyout/flyout.component';
import { CommonModule } from '@angular/common';

@NgModule({
	imports: [CommonModule],
	exports: [FlyoutComponent],
	declarations: [FlyoutComponent],
	providers: []
})
export class FlyoutModule {}
