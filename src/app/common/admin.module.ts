import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';

@NgModule({
	imports: [CommonModule, RouterModule],
	entryComponents: [AdminComponent],
	exports: [AdminComponent],
	declarations: [AdminComponent],
	providers: []
})
export class AdminModule {}
export { AdminComponent } from './admin/admin.component';
export { AdminTopic, AdminTopics } from './admin/admin-topic.model';
