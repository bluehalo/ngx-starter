import { NgModule, ApplicationModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BreadcrumbModule } from '../../common/breadcrumb.module';
import { HelpComponent } from './help.component';
import { HelpRoutingModule } from './help-routing.module';
import { HelpTopicComponent, HelpTopics } from './help-topic.component';
import { HelpTopicWrapperComponent } from './help-topic-wrapper.component';

import { ExternalLinksComponent } from './getting-started/external-links.component';
import { GettingStartedHelpComponent } from './getting-started/getting-started-help.component';

@NgModule({
	imports: [
		ApplicationModule,
		BreadcrumbModule,
		HelpRoutingModule,

		CommonModule,
		FormsModule,
		RouterModule
	],
	exports: [],
	entryComponents: [GettingStartedHelpComponent],
	declarations: [
		ExternalLinksComponent,
		GettingStartedHelpComponent,
		HelpComponent,
		HelpTopicComponent,
		HelpTopicWrapperComponent
	],
	providers: [HelpTopics]
})
export class HelpModule {}
