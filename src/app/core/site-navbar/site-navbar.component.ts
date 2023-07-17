import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BsModalService } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { first } from 'rxjs/operators';

import { AdminTopic, AdminTopics } from '../../common/admin/admin-topic.model';
import { LinkAccessibilityDirective } from '../../common/directives/link-accessibility.directive';
import { HasRoleDirective } from '../auth/directives/has-role.directive';
import { HasSomeRolesDirective } from '../auth/directives/has-some-roles.directive';
import { IsAuthenticatedDirective } from '../auth/directives/is-authenticated.directive';
import { Session } from '../auth/session.model';
import { SessionService } from '../auth/session.service';
import { ConfigService } from '../config.service';
import { FeedbackModalComponent } from '../feedback/feedback-modal/feedback-modal.component';
import { MasqueradeService } from '../masquerade/masquerade.service';
import { MessageService } from '../messages/message.service';
import { RecentMessagesComponent } from '../messages/recent-messages/recent-messages.component';
import { NavbarTopic, NavbarTopics } from './navbar-topic.model';

@UntilDestroy()
@Component({
	selector: 'site-navbar',
	templateUrl: 'site-navbar.component.html',
	styleUrls: ['site-navbar.component.scss'],
	standalone: true,
	imports: [
		NgClass,
		NgFor,
		NgIf,
		HasSomeRolesDirective,
		RouterLinkActive,
		TooltipModule,
		RouterLink,
		HasRoleDirective,
		LinkAccessibilityDirective,
		PopoverModule,
		IsAuthenticatedDirective,
		RecentMessagesComponent
	]
})
export class SiteNavbarComponent implements OnInit {
	navbarOpenValue = false;

	adminNavOpen = false;
	auditorNavOpen = false;
	helpNavOpen = false;
	userNavOpen = false;
	teamNavOpen = false;
	messagesNavOpen = false;

	apiDocsLink = '';
	showApiDocsLink = false;

	showFeedbackOption = true;

	showUserPreferencesLink = false;
	userPreferencesLink?: string;

	session: Session | null = null;

	adminMenuItems: AdminTopic[];

	navbarItems: NavbarTopic[];

	masqueradeEnabled = false;
	canMasquerade = false;
	isMasquerade = false;

	numNewMessages = 0;

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
		private messageService: MessageService,
		private masqueradeService: MasqueradeService
	) {
		this.adminMenuItems = AdminTopics.getTopics();
		this.navbarItems = NavbarTopics.getTopics();
	}

	ngOnInit() {
		this.sessionService
			.getSession()
			.pipe(untilDestroyed(this))
			.subscribe((session) => {
				this.session = session;
				this.canMasquerade = session?.user?.userModel?.canMasquerade ?? false;
			});

		this.configService
			.getConfig()
			.pipe(first(), untilDestroyed(this))
			.subscribe((config) => {
				this.masqueradeEnabled = config?.masqueradeEnabled ?? false;
				this.showApiDocsLink = config?.apiDocs?.enabled ?? false;
				this.apiDocsLink = config?.apiDocs?.path ?? '';
				this.showFeedbackOption = config?.feedback?.showInSidebar ?? true;
				this.showUserPreferencesLink = config?.userPreferences?.enabled ?? false;
				this.userPreferencesLink = config?.userPreferences?.path ?? '';
			});

		this.messageService.numMessagesIndicator$.pipe(untilDestroyed(this)).subscribe((count) => {
			this.numNewMessages = count;
		});

		this.isMasquerade = this.masqueradeService.getMasqueradeDn() !== undefined;
	}

	toggleNavbar() {
		this.navbarOpen = !this.navbarOpen;
	}

	showFeedbackModal() {
		this.modalService.show(FeedbackModalComponent, {
			ignoreBackdropClick: true,
			class: 'modal-dialog-scrollable modal-lg'
		});
	}
}
