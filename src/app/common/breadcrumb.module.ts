import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
	imports: [CommonModule, RouterModule],
	exports: [BreadcrumbComponent],
	declarations: [BreadcrumbComponent]
})
export class BreadcrumbModule {}
