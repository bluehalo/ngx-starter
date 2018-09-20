import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { APP_INITIALIZER, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AuthenticationService } from './auth/authentication.service';
import { AuthGuard } from './auth/auth.guard';
import { ConfigService} from './config.service';
import { CoreRoutingModule } from './core-routing.module';
import { SessionService } from './auth/session.service';
import { SigninComponent } from './signin/signin.component';
import { SiteContainerComponent } from './site-container/site-container.component';
import { SiteNavbarComponent } from './site-navbar/site-navbar.component';

import { HttpClientModule } from '@angular/common/http';


function getConfiguration(configService: ConfigService) {
	return () => {
		configService.getConfig().toPromise().catch((error) => {
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

		CoreRoutingModule
	],
	exports: [
		SigninComponent,
		SiteContainerComponent,
		SiteNavbarComponent
	],
	declarations: [
		SigninComponent,
		SiteContainerComponent,
		SiteNavbarComponent
	],
	providers: [
		AuthGuard,
		AuthenticationService,
		ConfigService,
		SessionService,
		{ provide: APP_INITIALIZER, useFactory: getConfiguration, deps: [ ConfigService ], multi: true },
	]
})
export class CoreModule { }
