import { A11yModule } from '@angular/cdk/a11y';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkConnectedOverlay, CdkScrollable, ConnectedPosition } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { Component, OnInit, computed, effect, inject, model, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { WINDOW } from '@ng-web-apis/common';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CdkMenuItemHrefDirective } from '../../common/cdk-menu-item-href.directive';
import { CdkMenuItemRouterLinkDirective } from '../../common/cdk-menu-item-router-link.directive';
import { DialogService } from '../../common/dialog';
import { LinkAccessibilityDirective } from '../../common/directives/link-accessibility.directive';
import { injectAdminTopics } from '../admin/admin-topic.model';
import { HasRoleDirective, HasSomeRolesDirective, IsAuthenticatedDirective } from '../auth';
import { FeedbackModalComponent } from '../feedback/feedback-modal/feedback-modal.component';
import { MasqueradeService } from '../masquerade/masquerade.service';
import { MessageService } from '../messages/message.service';
import { RecentMessagesComponent } from '../messages/recent-messages/recent-messages.component';
import { APP_CONFIG, APP_SESSION } from '../tokens';
import { injectNavbarTopics } from './navbar-topic.model';

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
	readonly #dialogService = inject(DialogService);
	readonly #messageService = inject(MessageService);
	readonly #masqueradeService = inject(MasqueradeService);
	readonly #config = inject(APP_CONFIG);
	readonly #window = inject(WINDOW);

	readonly session = inject(APP_SESSION);
	readonly adminTopics = injectAdminTopics();
	readonly navbarItems = injectNavbarTopics();

	readonly navbarOpen = model(false);
	readonly adminNavOpen = signal(false);
	readonly helpNavOpen = signal(false);
	readonly userNavOpen = signal(false);
	readonly messagesNavOpen = signal(false);
	readonly isMasquerade = signal(false);
	readonly numNewMessages = this.#messageService.newMessageCount;

	readonly masqueradeEnabled = computed(() => this.#config()?.masqueradeEnabled ?? false);
	readonly showApiDocsLink = computed(() => this.#config()?.apiDocs?.enabled ?? false);
	readonly apiDocsLink = computed(() => this.#config()?.apiDocs?.path ?? '');
	readonly showFeedbackOption = computed(() => this.#config()?.feedback?.showInSidebar ?? true);
	readonly showUserPreferencesLink = computed(
		() => this.#config()?.userPreferences?.enabled ?? false
	);
	readonly userPreferencesLink = computed(() => this.#config()?.userPreferences?.path ?? '');
	readonly canMasquerade = computed(() => this.session().user?.canMasquerade ?? false);

	readonly menuPositions: ConnectedPosition[] = [
		{
			originX: 'end',
			originY: 'bottom',
			overlayX: 'start',
			overlayY: 'bottom',
			offsetX: 8,
			panelClass: 'nav-menu'
		}
	];

	constructor() {
		effect(() => {
			this.navbarOpen();
			this.#window?.dispatchEvent(new Event('resize', { bubbles: true }));
		});
	}

	ngOnInit() {
		this.isMasquerade.set(this.#masqueradeService.getMasqueradeDn() !== undefined);
	}

	toggleNavbar() {
		this.navbarOpen.set(!this.navbarOpen());
	}

	showFeedbackModal() {
		this.#dialogService.open(FeedbackModalComponent);
	}
}
