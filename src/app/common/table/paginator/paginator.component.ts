import { AsyncPipe, DecimalPipe } from '@angular/common';
import { Component, booleanAttribute, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';

import { PageChange } from '../../paging.model';
import { AsyTableDataSource } from '../asy-table-data-source';

function constrain(value: number, max: number, min = 0) {
	return Math.min(max, Math.max(value, min));
}

@Component({
	selector: 'asy-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.scss'],
	standalone: true,
	imports: [NgSelectModule, FormsModule, AsyncPipe, DecimalPipe]
})
export class PaginatorComponent<T> {
	readonly dataSource = input.required<AsyTableDataSource<T>>();
	readonly maxPageSize = input(100, {
		transform: (value: number) => constrain(value, 100, 1)
	});
	readonly hidePageSize = input(false, { transform: booleanAttribute });
	readonly pageSizeOptions = input([10, 20, 50, 100]);
	readonly disableGoToEnd = input(false, { transform: booleanAttribute });

	readonly pageChange = output<PageChange>();

	get start() {
		const page = this._getPage();
		return Math.min(page.pageSize * page.pageNumber + 1, page.totalSize);
	}

	get end() {
		const page = this._getPage();
		return Math.min(page.pageSize * page.pageNumber + page.pageSize, page.totalSize);
	}

	goToPage(pageNumber: number) {
		const page = this._getPage();
		this.dataSource().page({
			pageNumber: constrain(pageNumber, page.totalPages),
			pageSize: page.pageSize
		});
	}

	setPageSize(pageSize: number) {
		this.dataSource().page({
			// Since the size changed, go back to the first page
			pageNumber: 0,
			// Page size can never exceed the max
			pageSize: constrain(pageSize, this.maxPageSize())
		});
	}

	_getPage() {
		return this.dataSource().pagingResults$.value;
	}
}
