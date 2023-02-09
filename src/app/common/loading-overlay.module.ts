import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { LoadingSpinnerModule } from './loading-spinner.module';
import { NotificationModule } from './notification.module';

@NgModule({
	imports: [NotificationModule, LoadingSpinnerModule, CommonModule],
	exports: [LoadingOverlayComponent],
	declarations: [LoadingOverlayComponent]
})
export class LoadingOverlayModule {}
