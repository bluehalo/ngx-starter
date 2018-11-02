import { NgModule, ApplicationModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from './breadcrumb.module';
import { HelpComponent } from './help/help.component';
import { HelpRoutingModule } from './help/help-routing.module';
import { HelpTopicComponent, HelpTopics } from './help/help-topic.component';
import { HelpTopicWrapperComponent } from './help/help-topic-wrapper.component';
import { GettingStartedHelpModule } from './help/getting-started/getting-started-help.module';

@NgModule({
	imports: [
		ApplicationModule,
		BreadcrumbModule,
		HelpRoutingModule,
		GettingStartedHelpModule,

		CommonModule,
		FormsModule,
		RouterModule
	],
	exports: [],
	declarations:   [
		HelpComponent,
		HelpTopicComponent,
		HelpTopicWrapperComponent
	],
	providers:  [
		HelpTopics
	]
})
export class HelpModule { }
