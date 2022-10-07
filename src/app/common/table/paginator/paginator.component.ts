import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { PageChange } from '../../paging.model';
import { AsyTableDataSource } from '../asy-table-data-source';

@Component({
	selector: 'asy-paginator',
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent<T> implements OnInit {
	@Input()
	dataSource: AsyTableDataSource<T>;

	@Input()
	maxPageSize = 100;

	@Input()
	hidePageSize = false;

	@Input()
	pageSizeOptions = [10, 20, 50, 100];

	@Input()
	disableGoToEnd = false;

	@Output() readonly pageChange: EventEmitter<PageChange> = new EventEmitter();

	constructor() {}

	ngOnInit() {
		// Constrain the max page size
		this.maxPageSize = this._constrain(this.maxPageSize, 100, 1);
	}

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
		this.dataSource.page({
			pageNumber: this._constrain(pageNumber, page.totalPages),
			pageSize: page.pageSize
		});
	}

	setPageSize(pageSize: number) {
		this.dataSource.page({
			// Since the size changed, go back to the first page
			pageNumber: 0,
			// Page size can never exceed the max
			pageSize: this._constrain(pageSize, this.maxPageSize)
		});
	}

	_constrain(value: number, max: number, min: number = 0) {
		return Math.min(max, Math.max(value, min));
	}

	_getPage() {
		return this.dataSource.pagingResults$.value;
	}
}
