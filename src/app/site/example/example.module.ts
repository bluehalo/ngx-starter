import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { AdminModule } from '../../common/admin.module';
import { ModalModule, ModalService } from '../../common/modal.module';
import { AuthGuard } from '../../core/core.module';
import { AdminExampleComponent } from './admin/admin-example.component';
import { ExampleRoutingModule } from './example-routing.module';
import { ExploreComponent } from './explore.component';
import { FormsComponent } from './forms/forms.component';
import { GridComponent } from './grid/grid.component';
import { ExampleHelpComponent } from './help/example-help.component';
import { ModalComponent } from './modal/modal.component';
import { SearchComponent } from './search.component';
import { WelcomeComponent } from './welcome.component';

@NgModule({
	imports: [FormsModule, AdminModule, ExampleRoutingModule, NgSelectModule, ModalModule],
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
