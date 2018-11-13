import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { SystemAlert } from './system-alert.model';

class SystemAlerts {
	list: SystemAlert[] = [];
	map: Map<number, SystemAlert> = new Map<number, SystemAlert>();
}

@Injectable()
export class SystemAlertService {
	private id: number = 0;
	private defaultType: string = 'danger';
	private alerts: SystemAlerts = new SystemAlerts();

	constructor() {}

	clearAllAlerts() {
		this.alerts.list.length = 0;
		this.alerts.map.clear();
	}

	clear(index: number) {
		let alert = this.alerts.list[index];
		this.alerts.list.splice(index, 1);
		this.alerts.map.delete(alert.id);
	}

	clearAlertById(id: number) {
		let alert = this.alerts.map.get(id);
		if (null != alert) {
			let index = this.alerts.list.indexOf(alert);
			this.clear(index);
		}
	}

	addAlert(msg: string, type?: string, ttl?: number, subtext?: string) {
		type = type || this.defaultType;
		let alert = new SystemAlert(
			this.id++,
			type || this.defaultType,
			msg,
			subtext || null);

		this.alerts.list.push(alert);
		this.alerts.map.set(alert.id, alert);

		// If they passed in a ttl parameter, age off the alert after said timeout
		if (null != ttl) {
			setTimeout(() => this.clearAlertById(alert.id), ttl);
		}
	}

	addClientErrorAlert(error: HttpErrorResponse) {
		if (error.status >= 400 && error.status < 500) {
			this.addAlert(error.error.message);
		}
	}

	getAlerts(): SystemAlert[] {
		return this.alerts.list;
	}
}
