import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';

import { Session } from '../auth/session.model';
import { SessionService } from '../auth/session.service';
import { FeedbackModalComponent } from '../feedback/feedback-modal.component';
import { AdminTopic, AdminTopics } from '../admin/admin.module';

@Component({
	selector: 'site-navbar',
	templateUrl: 'site-navbar.component.html',
	styleUrls: [ 'site-navbar.component.scss' ]
})
export class SiteNavbarComponent implements OnInit {

	navbarOpenValue = false;

	adminNavOpen = false;
	helpNavOpen = false;
	userNavOpen = false;

	session: Session = null;

	adminMenuItems: AdminTopic[];

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

	constructor(
		private modalService: BsModalService,
		private sessionService: SessionService
	) {}

	ngOnInit() {
		this.sessionService.getSession()
			.subscribe((session) => {
				this.session = session;
			});

		this.adminMenuItems = AdminTopics.getTopics();
	}

	toggleNavbar() {
		this.navbarOpen = !this.navbarOpen;
	}

	showFeedbackModal() {
		this.modalService.show(FeedbackModalComponent, { ignoreBackdropClick: true, class: 'modal-lg' });
	}

}
