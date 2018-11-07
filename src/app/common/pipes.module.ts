import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';

@NgModule({
	imports: [],
	exports: [
		KeysPipe
	],
	declarations: [
		KeysPipe
	],
	providers: []
})
export class PipesModule { }

export { KeysPipe } from './keys.pipe';
