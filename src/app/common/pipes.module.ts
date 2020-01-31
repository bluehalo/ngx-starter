import { NgModule } from '@angular/core';

import { AgoDatePipe } from './pipes/ago-date.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { SortObjectKeysPipe } from './pipes/sort-object-keys.pipe';
import { UtcDatePipe } from './pipes/utc-date-pipe/utc-date.pipe';

@NgModule({
	imports: [],
	exports: [AgoDatePipe, KeysPipe, SortObjectKeysPipe, UtcDatePipe],
	declarations: [AgoDatePipe, KeysPipe, SortObjectKeysPipe, UtcDatePipe],
	providers: []
})
export class PipesModule {}

export { AgoDatePipe } from './pipes/ago-date.pipe';
export { KeysPipe } from './pipes/keys.pipe';
export { SortObjectKeysPipe } from './pipes/sort-object-keys.pipe';
export { UtcDatePipe } from './pipes/utc-date-pipe/utc-date.pipe';
