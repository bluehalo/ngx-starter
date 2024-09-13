import { Component, booleanAttribute, input, signal } from '@angular/core';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

@Component({
	selector: 'asy-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	host: {
		class: 'sidebar',
		'[class.sidebar-open]': 'open()',
		'[class.sidebar-left]': 'placement() === "left"',
		'[class.card]': 'showInCard()'
	},
	imports: [NgbTooltip],
	standalone: true
})
export class SidebarComponent {
	readonly headerText = input('');

	readonly showInCard = input(true, { transform: booleanAttribute });

	readonly placement = input<'left' | 'right'>('right');

	readonly open = signal(false);

	toggle(): void {
		this.open.update((open) => !open);
	}
}
