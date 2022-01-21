import { Component, HostBinding, Input } from '@angular/core';

@Component({
	selector: 'asy-sidebar',
	templateUrl: './sidebar.component.html',
	styleUrls: ['./sidebar.component.scss'],
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {
		class: 'sidebar',
		'[class.sidebar-left]': 'placement === "left"'
	}
})
export class SidebarComponent {
	@Input()
	headerText = '';

	@HostBinding('class.card')
	@Input()
	showInCard = true;

	@HostBinding('class.sidebar-open')
	open = false;

	@Input()
	placement: 'left' | 'right' = 'right';

	toggle(): void {
		this.open = !this.open;
	}
}
