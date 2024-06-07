import { Component, booleanAttribute, input, signal } from '@angular/core';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

@Component({
	selector: 'asy-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {
		class: 'sidebar',
		'[class.sidebar-open]': 'open()',
		'[class.sidebar-left]': 'placement() === "left"',
		'[class.card]': 'showInCard()'
	},
	imports: [TooltipModule],
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
