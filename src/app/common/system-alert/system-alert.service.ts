import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

import { SystemAlert } from './system-alert.model';
import { BehaviorSubject } from 'rxjs';

class SystemAlerts {
	list: SystemAlert[] = [];
	map: Map<number, SystemAlert> = new Map<number, SystemAlert>();
}

@Injectable()
export class SystemAlertService {
	private id = 0;
	private defaultType = 'danger';
	private alerts: SystemAlerts = new SystemAlerts();
	private alerts$: BehaviorSubject<SystemAlert[]> = new BehaviorSubject(this.alerts.list);

	constructor() {}

	clearAllAlerts() {
		this.alerts.list.length = 0;
		this.alerts.map.clear();
		this.alerts$.next(this.alerts.list);
	}

	clear(index: number) {
		const alert = this.alerts.list[index];
		this.alerts.list.splice(index, 1);
		this.alerts.map.delete(alert.id);
		this.alerts$.next(this.alerts.list);
	}

	clearAlertById(id: number) {
		const alert = this.alerts.map.get(id);
		if (null != alert) {
			const index = this.alerts.list.indexOf(alert);
			this.clear(index);
		}
	}

	addAlert(msg: string, type?: string, ttl?: number, subtext?: string) {
		type = type || this.defaultType;
		const alert = new SystemAlert(
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
		this.alerts$.next(this.alerts.list);
	}

	addClientErrorAlert(error: HttpErrorResponse) {
		if (error.status >= 400 && error.status < 500) {
			this.addAlert(error.error.message);
		}
	}

	getAlerts(): BehaviorSubject<SystemAlert[]> {
		return this.alerts$;
	}
}
