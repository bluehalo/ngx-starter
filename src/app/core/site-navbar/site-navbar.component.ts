import { A11yModule } from '@angular/cdk/a11y';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkConnectedOverlay, CdkScrollable, ConnectedPosition } from '@angular/cdk/overlay';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { first } from 'rxjs/operators';

import { CdkMenuItemHrefDirective } from '../../common/cdk-menu-item-href.directive';
import { CdkMenuItemRouterLinkDirective } from '../../common/cdk-menu-item-router-link.directive';
import { DialogService } from '../../common/dialog';
import { LinkAccessibilityDirective } from '../../common/directives/link-accessibility.directive';
import { getAdminTopics } from '../admin/admin-topic.model';
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
import { getNavbarTopics } from './navbar-topic.model';

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
		IsAuthenticatedDirective,
		RecentMessagesComponent,
		CdkMenu,
		CdkMenuItem,
		CdkMenuItemHrefDirective,
		CdkMenuItemRouterLinkDirective,
		CdkMenuTrigger,
		CdkConnectedOverlay,
		A11yModule,
		CdkScrollable
	]
})
export class SiteNavbarComponent implements OnInit {
	navbarOpenValue = false;

	adminNavOpen = false;
	helpNavOpen = false;
	userNavOpen = false;
	messagesNavOpen = false;

	apiDocsLink = '';
	showApiDocsLink = false;

	showFeedbackOption = true;

	showUserPreferencesLink = false;
	userPreferencesLink?: string;

	session: Session | null = null;

	adminTopics = getAdminTopics();

	navbarItems = getNavbarTopics();

	masqueradeEnabled = false;
	canMasquerade = false;
	isMasquerade = false;

	numNewMessages = 0;

	menuPositions: ConnectedPosition[] = [
		{
			originX: 'end',
			originY: 'bottom',
			overlayX: 'start',
			overlayY: 'bottom',
			offsetX: 8,
			panelClass: 'nav-menu'
		}
	];

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

	private dialogService = inject(DialogService);

	constructor(
		private configService: ConfigService,
		private sessionService: SessionService,
		private messageService: MessageService,
		private masqueradeService: MasqueradeService
	) {}

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
		this.dialogService.open(FeedbackModalComponent);
	}
}
