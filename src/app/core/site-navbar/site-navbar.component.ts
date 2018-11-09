import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Session } from '../auth/session.model';
import { SessionService } from '../auth/session.service';

interface AdminMenuItem {
	link: string;
	name: string;
}

@Component({
	selector: 'site-navbar',
	templateUrl: 'site-navbar.component.html',
	styleUrls: [ 'site-navbar.component.scss' ]
})
export class SiteNavbarComponent {

	navbarOpenValue = false;

	adminNavOpen = false;
	helpNavOpen = false;
	userNavOpen = false;

	session: Session = null;

	adminMenuItems: AdminMenuItem[] = [
		{ link: '/admin/users', name: 'Users' },
		{ link: '/admin/cacheEntries', name: 'Cache' },
		{ link: '/admin/euas', name: 'EUA' },
		{ link: '/admin/messages', name: 'Messages' },
		{ link: '/admin/feedback', name: 'Feedback' }
	];

	@Output()
	navbarOpenChange = new EventEmitter<boolean>();

	@Input()
	get navbarOpen() {
		return this.navbarOpenValue;
	}

	set navbarOpen(v: boolean) {
		this.navbarOpenValue = v;
		this.navbarOpenChange.emit(v);

		if (null != window) {
			window.dispatchEvent(new Event('resize', { bubbles: true }));
		}
	}

	constructor(private sessionService: SessionService) {}

	ngOnInit() {
		this.sessionService.getSession()
			.subscribe((session) => {
				this.session = session;
			});
	}

	toggleNavbar() {
		this.navbarOpen = !this.navbarOpen;
	}

}
