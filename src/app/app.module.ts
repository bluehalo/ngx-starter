import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SessionService } from './core/auth/session.service';
import { CoreModule } from './core/core.module';
import { SiteModule } from './site/site.module';

@NgModule({
	declarations: [AppComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,

		PopoverModule.forRoot(),
		TooltipModule.forRoot(),

		AppRoutingModule,
		CoreModule,
		SiteModule
	],
	providers: [SessionService],
	bootstrap: [AppComponent]
})
export class AppModule {}
