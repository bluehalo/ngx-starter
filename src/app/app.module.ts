import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SiteModule } from './site/site.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    PopoverModule.forRoot(),
    TooltipModule.forRoot(),

    AppRoutingModule,

    CoreModule,
    SiteModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
