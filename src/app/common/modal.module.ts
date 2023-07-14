import { A11yModule } from '@angular/cdk/a11y';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ModalModule as BsModalModule } from 'ngx-bootstrap/modal';

import { ConfigurableModalComponent } from './modal/configurable-modal/configurable-modal.component';
import { ContainerModalComponent } from './modal/container-modal/container-modal.component';
import { ModalComponent } from './modal/modal/modal.component';

@NgModule({
	imports: [BsModalModule, CommonModule, FormsModule, A11yModule],
	exports: [ConfigurableModalComponent, ModalComponent],
	declarations: [ConfigurableModalComponent, ContainerModalComponent, ModalComponent]
})
export class ModalModule {}
