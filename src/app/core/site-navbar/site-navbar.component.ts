import { A11yModule } from '@angular/cdk/a11y';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkConnectedOverlay, CdkScrollable, ConnectedPosition } from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import {
	Component,
	DestroyRef,
	OnInit,
	computed,
	effect,
	inject,
	model,
	signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { CdkMenuItemHrefDirective } from '../../common/cdk-menu-item-href.directive';
import { CdkMenuItemRouterLinkDirective } from '../../common/cdk-menu-item-router-link.directive';
import { DialogService } from '../../common/dialog';
import { LinkAccessibilityDirective } from '../../common/directives/link-accessibility.directive';
import { getAdminTopics } from '../admin/admin-topic.model';
import { HasRoleDirective, HasSomeRolesDirective, IsAuthenticatedDirective } from '../auth';
import { FeedbackModalComponent } from '../feedback/feedback-modal/feedback-modal.component';
import { MasqueradeService } from '../masquerade/masquerade.service';
import { MessageService } from '../messages/message.service';
import { RecentMessagesComponent } from '../messages/recent-messages/recent-messages.component';
import { APP_CONFIG, APP_SESSION } from '../tokens';
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
	navbarOpen = model(false);
	adminNavOpen = signal(false);
	helpNavOpen = signal(false);
	userNavOpen = signal(false);
	messagesNavOpen = signal(false);

	adminTopics = getAdminTopics();

	navbarItems = getNavbarTopics();

	isMasquerade = signal(false);
	numNewMessages = signal(0);

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

	#destroyRef = inject(DestroyRef);
	#dialogService = inject(DialogService);
	#messageService = inject(MessageService);
	#masqueradeService = inject(MasqueradeService);
	#config = inject(APP_CONFIG);

	session = inject(APP_SESSION);

	masqueradeEnabled = computed(() => this.#config()?.masqueradeEnabled ?? false);
	showApiDocsLink = computed(() => this.#config()?.apiDocs?.enabled ?? false);
	apiDocsLink = computed(() => this.#config()?.apiDocs?.path ?? '');
	showFeedbackOption = computed(() => this.#config()?.feedback?.showInSidebar ?? true);
	showUserPreferencesLink = computed(() => this.#config()?.userPreferences?.enabled ?? false);
	userPreferencesLink = computed(() => this.#config()?.userPreferences?.path ?? '');
	canMasquerade = computed(() => this.session().user?.canMasquerade ?? false);

	constructor() {
		effect(() => {
			this.navbarOpen();
			if (null != window) {
				window.dispatchEvent(new Event('resize', { bubbles: true }));
			}
		});
	}

	ngOnInit() {
		this.#messageService.numMessagesIndicator$
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe((count) => {
				this.numNewMessages.set(count);
			});

		this.isMasquerade.set(this.#masqueradeService.getMasqueradeDn() !== undefined);
	}

	toggleNavbar() {
		this.navbarOpen.set(!this.navbarOpen());
	}

	showFeedbackModal() {
		this.#dialogService.open(FeedbackModalComponent);
	}
}
