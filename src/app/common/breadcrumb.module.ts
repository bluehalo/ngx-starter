import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';

@NgModule({
	imports: [
		CommonModule
	],
	exports: [
		BreadcrumbComponent
	],
	declarations: [
		BreadcrumbComponent
	]
})
export class BreadcrumbModule {}
