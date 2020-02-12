import { NgModule } from '@angular/core';

import { AgoDatePipe } from './pipes/ago-date.pipe';
import { JoinPipe } from './pipes/join.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { SortObjectKeysPipe } from './pipes/sort-object-keys.pipe';
import { UtcDatePipe } from './pipes/utc-date-pipe/utc-date.pipe';

@NgModule({
	imports: [],
	exports: [AgoDatePipe, JoinPipe, KeysPipe, SortObjectKeysPipe, UtcDatePipe],
	declarations: [AgoDatePipe, JoinPipe, KeysPipe, SortObjectKeysPipe, UtcDatePipe],
	providers: []
})
export class PipesModule {}

export { AgoDatePipe } from './pipes/ago-date.pipe';
export { JoinPipe } from './pipes/join.pipe';
export { KeysPipe } from './pipes/keys.pipe';
export { SortObjectKeysPipe } from './pipes/sort-object-keys.pipe';
export { UtcDatePipe } from './pipes/utc-date-pipe/utc-date.pipe';
