import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, booleanAttribute, input } from '@angular/core';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';

import { AgoDatePipe, UtcDatePipe } from '../../../pipes';
import { AsyHeaderSortComponent } from '../../sort/asy-header-sort/asy-header-sort.component';
import { DateColumnComponent } from '../date/date-column.component';

@Component({
	selector: 'asy-ago-date-column',
	standalone: true,
	imports: [
		CommonModule,
		CdkTableModule,
		UtcDatePipe,
		AsyHeaderSortComponent,
		AgoDatePipe,
		NgbTooltip
	],
	templateUrl: './ago-date-column.component.html',
	styleUrls: ['./ago-date-column.component.scss']
})
export class AgoDateColumnComponent<T> extends DateColumnComponent<T> {
	readonly hideAgo = input(false, { transform: booleanAttribute });
}
