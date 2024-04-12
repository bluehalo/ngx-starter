import { A11yModule } from '@angular/cdk/a11y';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkConnectedOverlay, CdkScrollable, ConnectedPosition } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { Component, DestroyRef, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';

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

@Component({
	selector: 'site-navbar',
	templateUrl: 'site-navbar.component.html',
	styleUrls: ['site-navbar.component.scss'],
	standalone: true,
	imports: [
		NgClass,
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

	private destroyRef = inject(DestroyRef);
	private dialogService = inject(DialogService);
	private configService = inject(ConfigService);
	private sessionService = inject(SessionService);
	private messageService = inject(MessageService);
	private masqueradeService = inject(MasqueradeService);

	ngOnInit() {
		this.sessionService
			.getSession()
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((session) => {
				this.session = session;
				this.canMasquerade = session?.user?.canMasquerade ?? false;
			});

		this.configService
			.getConfig()
			.pipe(first(), takeUntilDestroyed(this.destroyRef))
			.subscribe((config) => {
				this.masqueradeEnabled = config?.masqueradeEnabled ?? false;
				this.showApiDocsLink = config?.apiDocs?.enabled ?? false;
				this.apiDocsLink = config?.apiDocs?.path ?? '';
				this.showFeedbackOption = config?.feedback?.showInSidebar ?? true;
				this.showUserPreferencesLink = config?.userPreferences?.enabled ?? false;
				this.userPreferencesLink = config?.userPreferences?.path ?? '';
			});

		this.messageService.numMessagesIndicator$
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe((count) => {
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
