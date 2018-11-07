import { Component, EventEmitter, Input, Output, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';

import { TooltipModule } from 'ngx-bootstrap';

import { NamedTemplate } from '../../named-template.directive';
import { PagingOptions, PageChange, Pager } from '../pager/pager.component';

import { PageableTable, TableSortOptions } from './pageable-table.component';
import { SortDirection, SortDisplayOption } from '../sorting.model';

@Component({
	template:
`
	<pageable-table [items]="items"
		[pagingOptions]="pagingOptions"
		[sortOptions]="sortOptions"
		[refreshable]="refreshable"
		(onPageChange)="pageChanged$.next($event)"
		(onSortChange)="sortChanged$.next($event)"
		(onRefresh)="refreshed$.next($event)"
	>

		<ng-template named-template="table-header">
			{{ headerContent }}
		</ng-template>

		<ng-template named-template="table-row" let-item let-index="index">
			{{ rowContent }}
			{{ item }}
			{{ index }}
		</ng-template>

		<ng-template named-template="empty-table">
			{{ emptyTableContent }}
		</ng-template>

	</pageable-table>
`
})
export class PageableTableTestHost {
	@Input() items: Iterable<any>;
	@Input() pagingOptions: PagingOptions = new PagingOptions();
	@Input() sortOptions: TableSortOptions;
	@Input() refreshable: boolean = false;

	@Input() headerContent: string;
	@Input() rowContent: string;
	@Input() emptyTableContent: string;

	pageChanged$ = new Subject<PageChange>();
	sortChanged$ = new Subject<SortDisplayOption>();
	refreshed$ = new Subject();
}

describe('PageableTable', () => {

	let fixture: ComponentFixture<PageableTableTestHost>;
	let testHost: PageableTableTestHost;
	let rootHTMLElement: HTMLElement;

	beforeEach(() => {
		const testbed = TestBed.configureTestingModule({
			imports: [
				TooltipModule.forRoot()
			],
			declarations: [
				PageableTableTestHost,
				PageableTable,
				NamedTemplate,
				Pager,
			]
		});

		fixture = testbed.createComponent(PageableTableTestHost);
		testHost = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;
		fixture.detectChanges();
	});

	it('displays empty table template when no items are provided', () => {
		const expectedContent = 'EMPTY_TABLE';
		testHost.emptyTableContent = expectedContent;
		fixture.detectChanges();
		expect(rootHTMLElement.innerText).toContain(expectedContent);
	});

	it('displays empty table template when items are empty', () => {
		const expectedContent = 'EMPTY_TABLE';
		testHost.emptyTableContent = expectedContent;
		testHost.items = [];
		fixture.detectChanges();
		expect(rootHTMLElement.innerText).toContain(expectedContent);
	});

	it('displays table header', () => {
		const expectedContent = 'TABLE_HEADER';
		testHost.headerContent = expectedContent;
		fixture.detectChanges();
		expect(rootHTMLElement.innerText).toContain(expectedContent);
	});

	it('displays row template for each item in items', () => {
		const rowContent = 'ROW_CONTENT';
		testHost.rowContent = rowContent;
		testHost.items = [1, 2, 3];
		fixture.detectChanges();

		const instancesOfRowContent = rootHTMLElement.innerText.match(new RegExp(rowContent, 'g'));
		expect(instancesOfRowContent).toBeDefined();
		expect(instancesOfRowContent.length).toEqual(3);
	});

	it('binds the item to the row template', () => {
		const items = [
			'ITEM_A',
			'ITEM_B',
			'ITEM_C'
		];

		testHost.items = items;
		fixture.detectChanges();

		items.forEach((item) => {
			expect(rootHTMLElement.innerText).toContain(item);
		});
	});

	it('binds the index of the item to the row template', () => {
		const items = [
			'ITEM_A',
			'ITEM_B',
			'ITEM_C'
		];

		testHost.items = items;
		fixture.detectChanges();

		items.forEach((value, index) => {
			expect(rootHTMLElement.innerText).toContain(String(index));
		});
	});

	it('handles null pagingOptions', () => {
		testHost.pagingOptions = null;
		expect(() => {
			fixture.detectChanges();
		}).not.toThrow();
	});

});
