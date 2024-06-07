import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

import { SystemAlert } from './system-alert.model';

@Injectable({
	providedIn: 'root'
})
export class SystemAlertService {
	#id = 0;
	#defaultType = 'danger';
	#alerts = signal<SystemAlert[]>([]);

	alerts = this.#alerts.asReadonly();

	clearAllAlerts() {
		this.#alerts.set([]);
	}

	clear(index: number) {
		this.#alerts.update((a) => {
			a.splice(index, 1);
			return [...a];
		});
	}

	clearAlertById(id: number) {
		const index = this.#alerts().findIndex((value) => value.id === id);
		this.clear(index);
	}

	addAlert(msg: string, type?: string, ttl?: number, subtext?: string) {
		const alert = new SystemAlert(this.#id++, type || this.#defaultType, msg, subtext);

		// If they passed in a ttl parameter, age off the alert after said timeout
		if (ttl ?? 0 > 0) {
			setTimeout(() => this.clearAlertById(alert.id), ttl);
		}
		this.#alerts.update((alerts) => [...alerts, alert]);
	}

	addClientErrorAlert(error: HttpErrorResponse) {
		if (error.status >= 400 && error.status < 500) {
			this.addAlert(error.error.message);
		}
	}
}
