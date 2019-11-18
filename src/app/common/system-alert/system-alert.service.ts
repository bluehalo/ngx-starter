import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { SystemAlert } from './system-alert.model';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class SystemAlertService {
	private id = 0;
	private defaultType = 'danger';
	private alerts: SystemAlert[] = [];
	alerts$: BehaviorSubject<SystemAlert[]> = new BehaviorSubject(this.alerts);

	constructor() {}

	clearAllAlerts() {
		this.alerts.length = 0;
		this.alerts$.next(this.alerts);
	}

	clear(index: number) {
		this.alerts.splice(index, 1);
		this.alerts$.next(this.alerts);
	}

	clearAlertById(id: number) {
		const index = this.alerts.findIndex((value) => value.id === id);
		this.clear(index);
	}

	addAlert(msg: string, type?: string, ttl?: number, subtext?: string) {
		type = type || this.defaultType;
		const alert = new SystemAlert(
			this.id++,
			type || this.defaultType,
			msg,
			subtext || null);

		this.alerts.push(alert);

		// If they passed in a ttl parameter, age off the alert after said timeout
		if (null != ttl) {
			setTimeout(() => this.clearAlertById(alert.id), ttl);
		}
		this.alerts$.next(this.alerts);
	}

	addClientErrorAlert(error: HttpErrorResponse) {
		if (error.status >= 400 && error.status < 500) {
			this.addAlert(error.error.message);
		}
	}

	getAlerts(): SystemAlert[] {
		return this.alerts;
	}
}
