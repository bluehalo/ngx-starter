import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ModalModule as BsModalModule } from 'ngx-bootstrap/modal';

import { ModalComponent } from './modal/modal.component';
import { ModalService } from './modal/modal.service';

@NgModule({
	imports: [
		BsModalModule.forRoot(),
		CommonModule
	],
	entryComponents: [
		ModalComponent
	],
	exports: [
		ModalComponent
	],
	declarations: [
		ModalComponent
	],
	providers: [
	]
})
export class ModalModule { }

export { ModalComponent } from './modal/modal.component';
export { ModalAction } from './modal/modal.model';
export { ModalService } from './modal/modal.service';
