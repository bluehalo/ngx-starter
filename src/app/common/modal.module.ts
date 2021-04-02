import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalModule as BsModalModule } from 'ngx-bootstrap/modal';
import { ContainerModalComponent } from './modal/container-modal/container-modal.component';
import { ModalComponent } from './modal/modal/modal.component';

@NgModule({
	imports: [BsModalModule.forRoot(), CommonModule, FormsModule, A11yModule],
	exports: [ModalComponent],
	declarations: [ModalComponent, ContainerModalComponent],
	providers: []
})
export class ModalModule {}

export { ModalComponent } from './modal/modal/modal.component';
export { ModalAction } from './modal/modal.model';
export { ModalService } from './modal/modal.service';
