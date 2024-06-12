import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { AsySortHeaderComponent } from '../../sort/asy-sort-header/asy-sort-header.component';
import { AsyAbstractValueColumnComponent } from '../asy-abstract-value-column.component';

@Component({
	selector: 'asy-text-column',
	standalone: true,
	imports: [CommonModule, AsySortHeaderComponent, CdkTableModule],
	templateUrl: './text-column.component.html',
	styleUrls: ['./text-column.component.scss']
})
export class TextColumnComponent<T> extends AsyAbstractValueColumnComponent<T> {
	readonly defaultValue = input('');
}
