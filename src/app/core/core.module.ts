import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { firstValueFrom } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AdminTopics } from '../common/admin/admin-topic.model';
import { DirectivesModule } from '../common/directives.module';
import { LoadingSpinnerModule } from '../common/loading-spinner.module';
import { SystemAlertModule } from '../common/system-alert.module';
import { AboutComponent } from './about.component';
import { AccessComponent } from './access.component';
import { AuthGuard } from './auth/auth.guard';
import { AuthInterceptor } from './auth/auth.interceptor';
import { AuthenticationService } from './auth/authentication.service';
import { AuthorizationService } from './auth/authorization.service';
import { HasEveryRoleDirective } from './auth/directives/has-every-role.directive';
import { HasRoleDirective } from './auth/directives/has-role.directive';
import { HasSomeRolesDirective } from './auth/directives/has-some-roles.directive';
import { IsAuthenticatedDirective } from './auth/directives/is-authenticated.directive';
import { EuaInterceptor } from './auth/eua.interceptor';
import { SessionService } from './auth/session.service';
import { SigninInterceptor } from './auth/signin.interceptor';
import { ConfigService } from './config.service';
import { CoreRoutingModule } from './core-routing.module';
import { UserEuaComponent } from './eua/user-eua.component';
import { ExportConfigService } from './export-config.service';
import { FeedbackModule } from './feedback/feedback.module';
import { HelpModule } from './help/help.module';
import { MasqueradeModule } from './masquerade/masquerade.module';
import { MessagesModule } from './messages/messages.module';
import { NavigationService } from './navigation.service';
import { PageTitleService } from './page-title.service';
import { SigninComponent } from './signin/signin.component';
import { SignedUpComponent } from './signup/signed-up.component';
import { SignupComponent } from './signup/signup.component';
import { SiteContainerComponent } from './site-container/site-container.component';
import { SiteNavbarComponent } from './site-navbar/site-navbar.component';
import { TeamsModule } from './teams/teams.module';
import { UnauthorizedComponent } from './unauthorized.component';

export function getConfiguration(configService: ConfigService) {
	return () =>
		firstValueFrom(
			configService.getConfig().pipe(
				tap((config) => {
					if (config === null) {
						throw new Error('Error loading application configuration.');
					}
				})
			)
		);
}

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		HttpClientModule,
		RouterModule,

		ModalModule.forRoot(),
		PopoverModule,
		TooltipModule,

		HelpModule,
		FeedbackModule,
		TeamsModule,
		CoreRoutingModule,
		LoadingSpinnerModule,
		SystemAlertModule,
		MessagesModule,
		MasqueradeModule,
		DirectivesModule
	],
	exports: [
		SiteContainerComponent,
		UserEuaComponent,
		IsAuthenticatedDirective,
		HasRoleDirective,
		HasEveryRoleDirective,
		HasSomeRolesDirective
	],
	declarations: [
		AboutComponent,
		AccessComponent,
		SignedUpComponent,
		SigninComponent,
		SignupComponent,
		SiteContainerComponent,
		SiteNavbarComponent,
		UnauthorizedComponent,
		UserEuaComponent,
		IsAuthenticatedDirective,
		HasRoleDirective,
		HasEveryRoleDirective,
		HasSomeRolesDirective
	],
	providers: [
		AuthGuard,
		AuthenticationService,
		AuthorizationService,
		ConfigService,
		ExportConfigService,
		PageTitleService,
		SessionService,
		{
			provide: APP_INITIALIZER,
			useFactory: getConfiguration,
			deps: [ConfigService],
			multi: true
		},
		[
			{ provide: HTTP_INTERCEPTORS, useClass: SigninInterceptor, multi: true },
			{ provide: HTTP_INTERCEPTORS, useClass: EuaInterceptor, multi: true },
			{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
		]
	]
})
export class CoreModule {
	constructor(
		private pageTitleService: PageTitleService,
		private navigationService: NavigationService
	) {
		this.pageTitleService.init();
		this.navigationService.init();
	}
}

export { AuthGuard } from './auth/auth.guard';
export { User } from './auth/user.model';
export { Role } from './auth/role.model';
export { AuthorizationService } from './auth/authorization.service';
export { ConfigService } from './config.service';
export { NavbarTopics } from './site-navbar/navbar-topic.model';
export { AuditObjectTypes, AuditActionTypes } from './audit/audit.classes';

AdminTopics.registerTopic({
	id: 'users',
	title: 'User',
	ordinal: 0,
	path: 'users'
});

AdminTopics.registerTopic({
	id: 'cache-entries',
	title: 'Cache Entries',
	ordinal: 1,
	path: 'cacheEntries'
});

AdminTopics.registerTopic({
	id: 'end-user-agreements',
	title: 'EUAs',
	ordinal: 2,
	path: 'euas'
});

AdminTopics.registerTopic({
	id: 'messages',
	title: 'Messages',
	ordinal: 3,
	path: 'messages'
});

AdminTopics.registerTopic({
	id: 'feedback',
	title: 'Feedback',
	ordinal: 4,
	path: 'feedback'
});
