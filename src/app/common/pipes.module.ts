import { NgModule } from '@angular/core';

import { AgoDatePipe } from './pipes/ago-date.pipe';
import { KeysPipe } from './pipes/keys.pipe';

@NgModule({
	imports: [],
	exports: [
		AgoDatePipe,
		KeysPipe
	],
	declarations: [
		AgoDatePipe,
		KeysPipe
	],
	providers: []
})
export class PipesModule { }

export { AgoDatePipe } from './pipes/ago-date.pipe';
export { KeysPipe } from './pipes/keys.pipe';
