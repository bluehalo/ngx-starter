import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { ExampleModule } from './example/example.module';

@NgModule({
	imports: [CoreModule, ExampleModule],
	exports: [],
	declarations: [],
	providers: []
})
export class SiteModule {}
