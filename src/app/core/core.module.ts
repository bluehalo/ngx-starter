import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PopoverModule } from "ngx-bootstrap/popover";
import { TooltipModule } from "ngx-bootstrap/tooltip";

import { SessionService } from './session/session.service';
import { SiteContainerComponent } from './site-container/site-container.component';
import { SiteNavbarComponent } from './site-navbar/site-navbar.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    PopoverModule,
    TooltipModule
  ],
  exports: [
    SiteContainerComponent,
    SiteNavbarComponent
  ],
  declarations:   [
    SiteContainerComponent,
    SiteNavbarComponent
  ],
  providers:  [
    SessionService
  ]
})
export class CoreModule { }
