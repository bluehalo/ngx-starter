import { CommonModule } from '@angular/common';
import { ApplicationModule, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BreadcrumbModule } from '../../common/breadcrumb.module';

import { ExternalLinksComponent } from './getting-started/external-links.component';
import { GettingStartedHelpComponent } from './getting-started/getting-started-help.component';
import { HelpRoutingModule } from './help-routing.module';
import { HelpTopicWrapperComponent } from './help-topic-wrapper.component';
import { HelpTopics, HelpTopicComponent } from './help-topic.component';
import { HelpComponent } from './help.component';

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
	declarations: [
		ExternalLinksComponent,
		GettingStartedHelpComponent,
		HelpComponent,
		HelpTopicComponent,
		HelpTopicWrapperComponent
	],
	providers: [HelpTopics, GettingStartedHelpComponent]
})
export class HelpModule {}
