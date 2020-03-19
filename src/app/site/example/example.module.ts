import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { ExampleRoutingModule } from './example-routing.module';

import { AdminModule } from '../../common/admin.module';
import { ModalModule, ModalService } from '../../common/modal.module';

import { AuthGuard } from '../../core/core.module';

import { SearchComponent } from './search.component';
import { ExploreComponent } from './explore.component';
import { WelcomeComponent } from './welcome.component';
import { ExampleHelpComponent } from './help/example-help.component';
import { FormsComponent } from './forms/forms.component';
import { GridComponent } from './grid/grid.component';
import { AdminExampleComponent } from './admin/admin-example.component';
import { ModalComponent } from './modal/modal.component';

@NgModule({
	imports: [FormsModule, AdminModule, ExampleRoutingModule, NgSelectModule, ModalModule],
	entryComponents: [ExampleHelpComponent],
	exports: [],
	declarations: [
		ExploreComponent,
		SearchComponent,
		WelcomeComponent,
		ExampleHelpComponent,
		FormsComponent,
		GridComponent,
		AdminExampleComponent,
		ModalComponent
	],
	providers: [AuthGuard, ModalService]
})
export class ExampleModule {}
