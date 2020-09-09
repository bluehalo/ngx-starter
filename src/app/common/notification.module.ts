import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NotificationComponent } from './notification/notification.component';

@NgModule({
	imports: [CommonModule],
	exports: [NotificationComponent],
	declarations: [NotificationComponent],
	providers: []
})
export class NotificationModule {}
