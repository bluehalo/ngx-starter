import { NgFor } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	selector: 'asy-skeleton-rows',
	templateUrl: './asy-skeleton-rows.component.html',
	styleUrls: ['./asy-skeleton-rows.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true,
	imports: [NgFor]
})
export class AsySkeletonRowsComponent {
	_rows: Array<number> = [];

	@Input({ required: true })
	set rows(numRows: number) {
		this._rows = Array(numRows).fill(0);
	}
}
