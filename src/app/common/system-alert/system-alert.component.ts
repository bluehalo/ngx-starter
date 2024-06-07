import { animate, style, transition, trigger } from '@angular/animations';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { SystemAlertService } from './system-alert.service';

@Component({
	selector: 'system-alert',
	templateUrl: 'system-alert.component.html',
	styleUrls: ['system-alert.component.scss'],
	animations: [
		trigger('animateAddRemove', [
			transition(':enter', [
				style({ border: 0, height: 0, margin: 0, opacity: 0, overflow: 'hidden' }),
				animate('200ms ease-in-out', style({ height: '*', margin: '*', opacity: 1 })),
				style({ overflow: 'auto' })
			]),
			transition(':leave', [
				style({ overflow: 'hidden' }),
				animate('200ms ease-in-out', style({ border: 0, height: 0, margin: 0, opacity: 0 }))
			])
		])
	],
	standalone: true,
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class SystemAlertComponent {
	readonly alertService = inject(SystemAlertService);
	readonly alerts = this.alertService.alerts;

	clearAlert(index: number) {
		this.alertService.clear(index);
	}
}
