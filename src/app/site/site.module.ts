import { NgModule } from '@angular/core';

import { SiteRoutingModule } from './site-routing.module';
import { ExampleModule } from './example/example.module';

import { WelcomeComponent } from './welcome/welcome.component';

@NgModule({
  imports: [
    SiteRoutingModule,

    ExampleModule
  ],
  exports: [

  ],
  declarations: [
    WelcomeComponent
  ],
  providers: []
})
export class SiteModule { }
