import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { BsModalService } from 'ngx-bootstrap/modal';

import get from 'lodash/get';

import { Session } from '../auth/session.model';
import { SessionService } from '../auth/session.service';
import { FeedbackModalComponent } from '../feedback/feedback.module';
import { AdminTopic, AdminTopics } from '../../common/admin/admin-topic.model';
import { NavbarTopic, NavbarTopics } from './navbar-topic.model';
import { Config } from '../config.model';
import { ConfigService } from '../config.service';
import { MessageService } from '../messages/message.service';
import { AuthorizationService } from '../auth/authorization.service';

import { TemplateDataStore } from '../template-data.store';

@Component({
	selector: 'site-navbar',
	templateUrl: 'site-navbar.component.html',
	styleUrls: ['site-navbar.component.scss']
})
export class SiteNavbarComponent implements OnInit {
	navbarOpenValue = false;

	adminNavOpen = false;
	auditorNavOpen = false;
	helpNavOpen = false;
	userNavOpen = false;
	teamNavOpen = false;
	messagesNavOpen = false;

	showFeedbackOption = true;

	session: Session = null;

	adminMenuItems: AdminTopic[];

	navbarItems: NavbarTopic[];

	numNewMessages = 0;

	isUserPreferencesTemplate = false;

	@Output()
	readonly navbarOpenChange = new EventEmitter<boolean>();

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
		private configService: ConfigService,
		private sessionService: SessionService,
		private authorizationService: AuthorizationService,
		private messageService: MessageService
	) {}

	ngOnInit() {
		this.sessionService.getSession().subscribe(session => {
			this.session = session;

			if (this.authorizationService.isUser()) {
				this.messageService.updateNewMessageIndicator();
			}
		});

		this.configService.getConfig().subscribe((config: Config) => {
			this.showFeedbackOption = get(config, 'feedback.showInSidebar', true);
		});

		this.adminMenuItems = AdminTopics.getTopics();

		this.navbarItems = NavbarTopics.getTopics();
		this.messageService.numMessagesIndicator.subscribe(count => {
			this.numNewMessages = count;
		});

		if (TemplateDataStore.userPreferencesTemplate != null) {
			this.isUserPreferencesTemplate = true;
		}
	}

	toggleNavbar() {
		this.navbarOpen = !this.navbarOpen;
	}

	showFeedbackModal() {
		this.modalService.show(FeedbackModalComponent, {
			ignoreBackdropClick: true,
			class: 'modal-lg'
		});
	}
}
