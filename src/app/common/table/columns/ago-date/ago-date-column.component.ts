import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { TooltipModule } from 'ngx-bootstrap/tooltip';

import { AgoDatePipe } from '../../../pipes/ago-date.pipe';
import { UtcDatePipe } from '../../../pipes/utc-date-pipe/utc-date.pipe';
import { AsySortHeaderComponent } from '../../sort/asy-sort-header/asy-sort-header.component';
import { DateColumnComponent } from '../date/date-column.component';

@Component({
	selector: 'asy-ago-date-column',
	standalone: true,
	imports: [
		CommonModule,
		CdkTableModule,
		UtcDatePipe,
		AsySortHeaderComponent,
		AgoDatePipe,
		TooltipModule
	],
	templateUrl: './ago-date-column.component.html',
	styleUrls: ['./ago-date-column.component.scss']
})
export class AgoDateColumnComponent<T> extends DateColumnComponent<T> {
	@Input()
	hideAgo = false;
}
