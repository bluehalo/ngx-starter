import { NgModule } from '@angular/core';

import { LoadingOverlayComponent } from './loading-overlay/loading-overlay.component';
import { LoadingSpinnerModule } from './loading-spinner.module';
import { NotificationModule } from './notification.module';

@NgModule({
	imports: [NotificationModule, LoadingSpinnerModule],
	exports: [LoadingOverlayComponent],
	declarations: [LoadingOverlayComponent],
	providers: []
})
export class LoadingOverlayModule {}
