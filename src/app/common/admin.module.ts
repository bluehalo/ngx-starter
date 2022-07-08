import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin/admin.component';

@NgModule({
	imports: [CommonModule, RouterModule],
	exports: [AdminComponent],
	declarations: [AdminComponent],
	providers: []
})
export class AdminModule {}
