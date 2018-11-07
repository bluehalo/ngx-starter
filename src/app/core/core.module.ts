import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { HelpModule } from './help/help.module';

import { AboutComponent } from './about.component';
import { AuthenticationService } from './auth/authentication.service';
import { AuthGuard } from './auth/auth.guard';
import { ConfigService} from './config.service';
import { CoreRoutingModule } from './core-routing.module';
import { LoadingSpinnerModule } from '../common/loading-spinner.module';
import { PageTitleService } from './page-title.service';
import { SessionService } from './auth/session.service';
import { SigninComponent } from './signin/signin.component';
import { SiteContainerComponent } from './site-container/site-container.component';
import { SiteNavbarComponent } from './site-navbar/site-navbar.component';

import { User } from './auth/user.model';

import { HttpClientModule } from '@angular/common/http';


export function getConfiguration(configService: ConfigService) {
	return () => {
		return configService.getConfig().toPromise().catch((error) => {
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

		PopoverModule,
		TooltipModule,

		HelpModule,
		CoreRoutingModule,
		LoadingSpinnerModule,
	],
	exports: [
		SiteContainerComponent,
	],
	declarations: [
		AboutComponent,
		SigninComponent,
		SiteContainerComponent,
		SiteNavbarComponent
	],
	providers: [
		AuthGuard,
		AuthenticationService,
		ConfigService,
		SessionService,
		PageTitleService,
		{ provide: APP_INITIALIZER, useFactory: getConfiguration, deps: [ ConfigService ], multi: true },
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
