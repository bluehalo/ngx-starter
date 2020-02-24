import { NgModule } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';

import { ExampleRoutingModule } from './example-routing.module';

import { AuthGuard } from '../../core/core.module';
import { SearchComponent } from './search.component';
import { ExploreComponent } from './explore.component';
import { WelcomeComponent } from './welcome.component';
import { ExampleHelpComponent } from './help/example-help.component';
import { FormsComponent } from './forms/forms.component';
import { GridComponent } from './grid/grid.component';
import { AdminExampleComponent } from './admin/admin-example.component';
import { AdminModule } from '../../common/admin.module';

@NgModule({
	imports: [AdminModule, ExampleRoutingModule, NgSelectModule],
	entryComponents: [ExampleHelpComponent],
	exports: [],
	declarations: [
		ExploreComponent,
		SearchComponent,
		WelcomeComponent,
		ExampleHelpComponent,
		FormsComponent,
		GridComponent,
		AdminExampleComponent
	],
	providers: [AuthGuard]
})
export class ExampleModule {}
