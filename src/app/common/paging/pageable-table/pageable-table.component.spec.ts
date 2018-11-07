import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Subject } from 'rxjs/Subject';
import { TooltipModule } from 'ngx-bootstrap';

import { CapitalizePipe } from '../capitalize.pipe';
import { KeysPipe } from '../keys.pipe';
import { AsyTemplate } from '../util/asy-template.directive';
import { AsyTransclude } from '../util/asy-transclude.directive';
import { PagingOptions, PageChange, PagerComponent } from '../pager.component';
import { PageableTableComponent } from './pageable-table.component';
import { SortControls } from './sort-controls.component';
import { FormsModule } from '@angular/forms';

@Component({
	template:
		`
	<pageable-table [items]="items"
		[pagingOptions]="pagingOptions"
		[refreshable]="refreshable"
		(onPageChange)="pageChanged$.next($event)"
		(onRefresh)="refreshed$.next($event)"
	>

		<ng-template asy-template="table-header">
			{{ headerContent }}
		</ng-template>

		<ng-template asy-template="table-row" let-item let-index="index">
			{{ rowContent }}
			{{ item }}
			{{ index }}
		</ng-template>

		<ng-template asy-template="empty-table">
			{{ emptyTableContent }}
		</ng-template>

	</pageable-table>
`
})
export class PageableTableTestHost {
	@Input() items: Iterable<any>;
	@Input() pagingOptions: PagingOptions = new PagingOptions();
	@Input() refreshable: boolean = false;

	@Input() headerContent: string;
	@Input() rowContent: string;
	@Input() emptyTableContent: string;

	pageChanged$ = new Subject<PageChange>();
	refreshed$ = new Subject();
}

describe('PageableTableComponent', () => {

	let fixture: ComponentFixture<PageableTableTestHost>;
	let testHost: PageableTableTestHost;
	let rootHTMLElement: HTMLElement;

	beforeEach(() => {
		const testbed = TestBed.configureTestingModule({
			imports: [
				TooltipModule.forRoot(),
				FormsModule
			],
			declarations: [
				PageableTableTestHost,
				PageableTableComponent,
				AsyTransclude,
				AsyTemplate,
				PagerComponent,
				KeysPipe,
				CapitalizePipe,
				SortControls
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
