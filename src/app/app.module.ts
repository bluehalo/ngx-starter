import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { SiteStructureModule } from './site/site-structure/site-structure.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),

    AppRoutingModule,
    SiteStructureModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
