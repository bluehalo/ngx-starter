import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { Component, input, signal } from '@angular/core';

@Component({
	selector: 'app-flyout',
	templateUrl: './flyout.component.html',
	styleUrls: ['./flyout.component.scss'],
	standalone: true,
	imports: [NgClass, NgTemplateOutlet],
	animations: [
		trigger('flyInOutVertical', [
			state('false', style({ height: '0' })),
			transition('false => true', [animate('500ms ease-in', style({ height: '*' }))]),
			transition('true => false', [animate('500ms ease-in', style({ height: '0' }))])
		]),
		trigger('flyInOutHorizontal', [
			state('false', style({ width: '0' })),
			transition('false => true', [animate('500ms ease-in', style({ width: '*' }))]),
			transition('true => false', [animate('500ms ease-in', style({ width: '0' }))])
		])
	]
})
export class FlyoutComponent {
	readonly label = input('');
	readonly placement = input<
		| 'top'
		| 'bottom'
		| 'left-top'
		| 'left-bottom'
		| 'right-top'
		| 'right-bottom'
		| 'top-left'
		| 'top-right'
		| 'bottom-left'
		| 'bottom-right'
	>('right-top');

	readonly isOpen = signal(false);

	toggle() {
		this.isOpen.set(!this.isOpen());
	}
}
