import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';

import { SystemAlertIconComponent } from './system-alert/system-alert-icon.component';
import { SystemAlertComponent } from './system-alert/system-alert.component';

@NgModule({
	imports: [CommonModule, FormsModule, AlertModule.forRoot()],
	exports: [SystemAlertComponent],
	declarations: [SystemAlertComponent, SystemAlertIconComponent]
})
export class SystemAlertModule {}
