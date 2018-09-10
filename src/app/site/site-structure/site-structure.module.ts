import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { NavbarComponent } from './navbar/navbar.component';
import { PageContainerComponent } from './page-container/page-container.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    PopoverModule,
    TooltipModule
  ],
  exports: [
    NavbarComponent,
    PageContainerComponent
  ],
  declarations:   [
    NavbarComponent,
    PageContainerComponent
  ],
  providers:  []
})
export class SiteStructureModule { }
