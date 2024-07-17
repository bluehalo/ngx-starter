import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { UtcDatePipe } from '../../../pipes';
import { AsyHeaderSortComponent } from '../../sort/asy-header-sort/asy-header-sort.component';
import { AsyAbstractValueColumnComponent } from '../asy-abstract-value-column.component';

@Component({
	selector: 'asy-date-column',
	standalone: true,
	imports: [CommonModule, CdkTableModule, UtcDatePipe, AsyHeaderSortComponent],
	templateUrl: './date-column.component.html',
	styleUrls: ['./date-column.component.scss']
})
export class DateColumnComponent<T> extends AsyAbstractValueColumnComponent<T> {
	readonly format = input<string>();
}
