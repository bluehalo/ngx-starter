import {
	Component,
	EventEmitter,
	Input,
	OnChanges,
	OnInit,
	Output,
	SimpleChange
} from '@angular/core';

import isNumber from 'lodash/isNumber';

import { PageChange, PagingOptions } from '../paging.model';
import { SortDir, SortDirection, SortDisplayOption } from '../sorting.model';

/**
 * @deprecated
 */
export abstract class PagingComponent {
	pagingOpts: PagingOptions;

	abstract loadData(): any;

	applySearch() {
		this.pagingOpts.setPageNumber(0);
		this.loadData();
	}

	goToPage(event: any) {
		this.pagingOpts.update(event.pageNumber, event.pageSize);
		this.loadData();
	}

	setSort(sortOpt: SortDisplayOption) {
		this.pagingOpts.sortField = sortOpt.sortField;
		this.pagingOpts.sortDir = sortOpt.sortDir;
		this.loadData();
	}
}

@Component({
	selector: 'asy-pager',
	templateUrl: './pager.component.html',
	styleUrls: ['./pager.component.scss']
})
export class PagerComponent implements OnInit, OnChanges {
	@Input() pageNumber = 0;
	@Input() pageSize = 0;
	@Input() totalSize = 0;
	@Input() maxPageSize = 100;
	@Input() currentSize = 0;
	@Input() disableGoToEnd = false;
	@Input() showCountWarning = false;
	@Input() countWarningMessage = '';

	@Output() readonly pageChange: EventEmitter<PageChange> = new EventEmitter();

	sortDir: SortDir = SortDirection.desc;

	totalPages = 0;

	startFormatted = '';

	endFormatted = '';

	totalFormatted = 'unknown';

	constructor() {}

	ngOnInit() {
		// Constrain the max page size
		this.maxPageSize = Math.min(100, Math.max(this.maxPageSize, 1));

		this.calculateTotalPages();
		this.format();
	}

	ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
		if (
			changes.hasOwnProperty('pageNumber') ||
			changes.hasOwnProperty('pageSize') ||
			changes.hasOwnProperty('totalSize')
		) {
			this.calculateTotalPages();
			this.format();
		}
	}

	isValid() {
		return (
			isNumber(this.pageSize) &&
			isNumber(this.pageNumber) &&
			isNumber(this.currentSize) &&
			isNumber(this.totalSize)
		);
	}

	format() {
		if (this.isValid()) {
			this.startFormatted = (this.pageSize * this.pageNumber + 1).toLocaleString();

			let end = this.pageSize * this.pageNumber + Math.max(this.pageSize, this.currentSize);
			end = end > this.totalSize ? this.totalSize : end;
			this.endFormatted = end.toLocaleString();

			if (this.totalSize !== 0) {
				this.totalFormatted = this.totalSize.toLocaleString();
			}
		}
	}

	calculateTotalPages() {
		// Constrain the page size to the max
		this.pageSize = Math.min(this.maxPageSize, Math.max(this.pageSize, 1));

		// Calculate number of pages based on page size and number of results
		this.totalPages = Math.ceil(this.totalSize / this.pageSize);
	}

	goToPage(pageNumber: number) {
		// Go to specific page number
		this.pageNumber = Math.min(this.totalPages - 1, Math.max(pageNumber, 0));
		this.format();

		// Emit change event
		this.pageChange.emit({ pageNumber: this.pageNumber, pageSize: this.pageSize });
	}

	setPageSize(pageSize: number) {
		// Page size can never exceed the max
		this.pageSize = Math.min(this.maxPageSize, Math.max(pageSize, 0));

		// Since the size changed, go back to the first page
		this.pageNumber = 0;

		// Emit change event
		this.pageChange.emit({ pageNumber: this.pageNumber, pageSize: this.pageSize });
	}
}
