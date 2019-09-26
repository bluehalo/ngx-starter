import { SortDirection } from './sorting.model';

export interface PagingResults<T = any> {
	pageNumber: number;
	pageSize: number;
	totalPages: number;
	totalSize: number;
	elements: T[];
}

export const NULL_PAGING_RESULTS: PagingResults = {
	pageNumber: 0,
	pageSize: 0,
	totalPages: 0,
	totalSize: 0,
	elements: []
};

export interface PageChange {
	pageNumber: number;
	pageSize: number;
}

export class PagingOptions {
	constructor(
		public pageNumber: number = 0,
		public pageSize: number = 50,
		public totalPages: number = 0,
		public totalSize: number = 0,
		public sortField?: string | string[],
		public sortDir?: SortDirection
	) {}

	reset() {
		this.pageNumber = 0;
		this.pageSize = 50;
		this.totalPages = 0;
		this.totalSize = 0;
	}

	set(pageNumber: number, pageSize: number, totalPages: number, totalSize: number) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
		this.totalPages = totalPages;
		this.totalSize = totalSize;
	}

	update(pageNumber: number, pageSize: number) {
		this.pageNumber = pageNumber;
		this.pageSize = pageSize;
	}

	setPageNumber(pageNumber: number) {
		this.pageNumber = pageNumber;
	}

	toObj(): any {
		return {
			page: this.pageNumber,
			size: this.pageSize,
			sort: this.sortField || null,
			dir: this.sortDir || null
		};
	}
}
