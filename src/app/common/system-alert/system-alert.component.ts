import { Component, OnInit, OnDestroy } from '@angular/core';

import { SystemAlertService } from './system-alert.service';
import { SystemAlert } from './system-alert.model';
import { Subscription } from 'rxjs';

@Component({
	selector: 'system-alert',
	templateUrl: 'system-alert.component.html',
	styleUrls: [ 'system-alert.component.scss' ]
})
export class SystemAlertComponent implements OnInit, OnDestroy {
	constructor(public alertService: SystemAlertService) { }
	private sub: Subscription;
	alerts: SystemAlert[];

	ngOnInit() {
		this.sub = this.alertService.alerts$.subscribe((alerts) => {
			this.alerts = alerts;
		});
	}

	ngOnDestroy() {
		this.sub.unsubscribe();
	}
}
