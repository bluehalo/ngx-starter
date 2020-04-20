import { Component, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Subject } from 'rxjs';
import { DirectivesModule } from '../../directives.module';
import { PipesModule } from '../../pipes.module';
import { PagerComponent } from '../pager/pager.component';
import { PageChange, PagingOptions } from '../paging.model';
import { SortControlsComponent } from '../sort-controls/sort-controls.component';
import { PageableTableComponent } from './pageable-table.component';

@Component({
	template: `
		<pageable-table
			[items]="items"
			[hasItems]="hasItems"
			[pagingOptions]="pagingOptions"
			(pageChange)="pageChanged$.next($event)"
		>
			<ng-template #tableHeader>
				{{ headerContent }}
			</ng-template>

			<ng-template #tableRow let-item="item" let-index="index">
				{{ rowContent }}
				{{ item }}
				{{ index }}
			</ng-template>

			<ng-template #tableNoData>
				{{ noDataContent }}
			</ng-template>

			<ng-template #tableNoResults>
				{{ noResultsContent }}
			</ng-template>
		</pageable-table>
	`
})
export class PageableTableTestHostComponent {
	@Input() items: Iterable<any>;
	@Input() hasItems: boolean;
	@Input() pagingOptions: PagingOptions = new PagingOptions();

	@Input() headerContent: string;
	@Input() rowContent: string;
	@Input() noDataContent: string;
	@Input() noResultsContent: string;

	pageChanged$ = new Subject<PageChange>();
}

describe('PageableTableComponent', () => {
	let fixture: ComponentFixture<PageableTableTestHostComponent>;
	let testHost: PageableTableTestHostComponent;
	let rootHTMLElement: HTMLElement;

	beforeEach(() => {
		const testbed = TestBed.configureTestingModule({
			imports: [TooltipModule.forRoot(), DirectivesModule, FormsModule, PipesModule],
			declarations: [
				PageableTableTestHostComponent,
				PageableTableComponent,
				PagerComponent,
				SortControlsComponent
			]
		});

		fixture = testbed.createComponent(PageableTableTestHostComponent);
		testHost = fixture.componentInstance;
		rootHTMLElement = fixture.debugElement.nativeElement;
		fixture.detectChanges();
	});

	it('displays empty table template when no items are provided', () => {
		const expectedContent = 'EMPTY_TABLE';
		testHost.noDataContent = expectedContent;
		fixture.detectChanges();
		expect(rootHTMLElement.innerText).toContain(expectedContent);
	});

	it('displays no data template when items are empty', () => {
		const expectedContent = 'NO_DATA';
		testHost.noDataContent = expectedContent;
		testHost.items = [];
		fixture.detectChanges();
		expect(rootHTMLElement.innerText).toContain(expectedContent);
	});

	it('displays no results template when filtered items are empty', () => {
		const expectedContent = 'NO_RESULTS';
		testHost.noResultsContent = expectedContent;
		testHost.items = [];
		testHost.hasItems = true;
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
		const items = ['ITEM_A', 'ITEM_B', 'ITEM_C'];

		testHost.items = items;
		fixture.detectChanges();

		items.forEach(item => {
			expect(rootHTMLElement.innerText).toContain(item);
		});
	});

	it('binds the index of the item to the row template', () => {
		const items = ['ITEM_A', 'ITEM_B', 'ITEM_C'];

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
