import { NgModule } from '@angular/core';

import { AgoDatePipe } from './ago-date.pipe';
import { KeysPipe } from './keys.pipe';

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

export { AgoDatePipe } from './ago-date.pipe';
export { KeysPipe } from './keys.pipe';
