import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { NavbarComponent } from './navbar/navbar.component';
import { PageContainerComponent } from './page-container/page-container.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,

    BsDropdownModule,
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
