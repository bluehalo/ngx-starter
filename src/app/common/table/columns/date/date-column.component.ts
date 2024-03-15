import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { UtcDatePipe } from '../../../pipes/utc-date-pipe/utc-date.pipe';
import { AsySortHeaderComponent } from '../../sort/asy-sort-header/asy-sort-header.component';
import { AsyAbstractValueColumnComponent } from '../asy-abstract-value-column.component';

@Component({
	selector: 'asy-date-column',
	standalone: true,
	imports: [CommonModule, CdkTableModule, UtcDatePipe, AsySortHeaderComponent],
	templateUrl: './date-column.component.html',
	styleUrls: ['./date-column.component.scss']
})
export class DateColumnComponent<T> extends AsyAbstractValueColumnComponent<T> {
	@Input()
	format?: string;
}
