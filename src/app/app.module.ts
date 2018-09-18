import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticationService } from './core/auth/authentication.service';
import { CoreModule } from './core/core.module';
import { RouteGuardService } from './core/auth/route-guard.service';
import { SessionService } from './core/auth/session.service';


@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		HttpClientModule,

		PopoverModule.forRoot(),
		TooltipModule.forRoot(),

		AppRoutingModule,
		CoreModule
	],
	providers: [
	],
	bootstrap: [ AppComponent ]
})
export class AppModule { }
