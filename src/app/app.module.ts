import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SiteModule } from './site/site.module';
import { SiteStructureModule } from './site/site-structure/site-structure.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    PopoverModule.forRoot(),
    TooltipModule.forRoot(),

    AppRoutingModule,

    SiteModule,
    SiteStructureModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
