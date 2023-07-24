import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';

import { AlertModule } from 'ngx-bootstrap/alert';

import { SystemAlertIconComponent } from './system-alert-icon.component';
import { SystemAlertService } from './system-alert.service';

@Component({
	selector: 'system-alert',
	templateUrl: 'system-alert.component.html',
	styleUrls: ['system-alert.component.scss'],
	standalone: true,
	imports: [NgFor, AlertModule, SystemAlertIconComponent, NgIf, AsyncPipe]
})
export class SystemAlertComponent {
	constructor(public alertService: SystemAlertService) {}
}
