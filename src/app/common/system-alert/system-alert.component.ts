import { Component } from '@angular/core';

import { SystemAlertService } from './system-alert.service';

@Component({
	selector: 'system-alert',
	templateUrl: 'system-alert.component.html',
	styleUrls: [ 'system-alert.component.scss' ]
})
export class SystemAlertComponent {
	constructor(public alertService: SystemAlertService) {}
}
