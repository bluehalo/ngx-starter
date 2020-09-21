import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { AdminModule } from '../../common/admin.module';
import { LoadingOverlayModule } from '../../common/loading-overlay.module';
import { ModalModule, ModalService } from '../../common/modal.module';

import { AuthGuard } from '../../core/core.module';

import { AdminExampleComponent } from './admin/admin-example.component';
import { ExampleRoutingModule } from './example-routing.module';
import { ExploreComponent } from './explore.component';
import { FormsComponent } from './forms/forms.component';
import { GridComponent } from './grid/grid.component';
import { ExampleHelpComponent } from './help/example-help.component';
import { ExampleLoadingOverlayComponent } from './loading-overlay/example-loading-overlay.component';
import { ModalComponent } from './modal/modal.component';
import { SearchComponent } from './search.component';
import { WelcomeComponent } from './welcome.component';

@NgModule({
	imports: [
		FormsModule,
		AdminModule,
		ExampleRoutingModule,
		NgSelectModule,
		ModalModule,
		LoadingOverlayModule,
		CommonModule
	],
	exports: [],
	declarations: [
		ExploreComponent,
		SearchComponent,
		WelcomeComponent,
		ExampleHelpComponent,
		FormsComponent,
		GridComponent,
		AdminExampleComponent,
		ModalComponent,
		ExampleLoadingOverlayComponent
	],
	providers: [AuthGuard, ModalService, ExampleHelpComponent]
})
export class ExampleModule {}
