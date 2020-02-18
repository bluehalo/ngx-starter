import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { ModalModule } from 'ngx-bootstrap/modal';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { HelpModule } from './help/help.module';
import { FeedbackModule } from './feedback/feedback.module';

import { AboutComponent } from './about.component';
import { AccessComponent } from './access.component';
import { AuthenticationService } from './auth/authentication.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthorizationService } from './auth/authorization.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { ConfigService } from './config.service';
import { CoreRoutingModule } from './core-routing.module';
import { ExportConfigService } from './export-config.service';
import { LoadingSpinnerModule } from '../common/loading-spinner.module';
import { PageTitleService } from './page-title.service';
import { SessionService } from './auth/session.service';
import { SignedUpComponent } from './signup/signed-up.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';
import { SiteContainerComponent } from './site-container/site-container.component';
import { SiteNavbarComponent } from './site-navbar/site-navbar.component';
import { NavbarTopics } from './site-navbar/navbar-topic.model';
import { SystemAlertModule } from '../common/system-alert.module';
import { AuthorizationDirective } from './auth/authorization.directive';
import { UnauthorizedComponent } from './unauthorized.component';
import { UserEuaComponent } from './eua/user-eua.component';
import { TeamsModule } from './teams/teams.module';
import { MessagesModule } from './messages/messages.module';
import { AdminTopics } from '../common/admin/admin-topic.model';

export function getConfiguration(configService: ConfigService) {
	return () => {
		return configService
			.getConfig()
			.toPromise()
			.catch(error => {
				return { error };
			});
	};
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
		MessagesModule
	],
	exports: [SiteContainerComponent, UserEuaComponent, AuthorizationDirective],
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
		AuthorizationDirective
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
		{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
	]
})
export class CoreModule {
	constructor(private pageTitleService: PageTitleService) {
		this.pageTitleService.init();
	}
}

export { AuthGuard } from './auth/auth.guard';
export { User } from './auth/user.model';
export { Role } from './auth/role.model';
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
