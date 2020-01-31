import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AlertModule } from 'ngx-bootstrap/alert';

import { SystemAlertComponent } from './system-alert/system-alert.component';
import { SystemAlertIconComponent } from './system-alert/system-alert-icon.component';

import { SystemAlertService } from './system-alert/system-alert.service';

@NgModule({
	imports: [CommonModule, FormsModule, AlertModule.forRoot()],
	exports: [SystemAlertComponent],
	declarations: [SystemAlertComponent, SystemAlertIconComponent],
	providers: [SystemAlertService]
})
export class SystemAlertModule {}
export { SystemAlertService } from './system-alert/system-alert.service';
