import { DragDropModule } from '@angular/cdk/drag-drop';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { SearchInputModule } from './search-input.module';
import { AsyAbstractColumnComponent } from './table/asy-abstract-column.component';
import { AsyTableDataSource } from './table/asy-table-data-source';
import { ColumnChooserComponent } from './table/column-chooser/column-chooser.component';
import { AsyExpanderColumnComponent } from './table/expander/asy-expander-column.component';
import { AsyAbstractHeaderFilterComponent } from './table/filter/asy-abstract-header-filter.component';
import { AsyFilterDirective } from './table/filter/asy-filter.directive';
import { AsyHeaderDateFilterComponent } from './table/filter/asy-header-date-filter/asy-header-date-filter.component';
import {
	AsyHeaderListFilterComponent,
	ListFilterOption
} from './table/filter/asy-header-list-filter/asy-header-list-filter.component';
import { AsyHeaderTextFilterComponent } from './table/filter/asy-header-text-filter/asy-header-text-filter.component';
import { AsyHeaderTypeaheadFilterComponent } from './table/filter/asy-header-typeahead-filter/asy-header-typeahead-filter.component';
import { PaginatorComponent } from './table/paginator/paginator.component';
import { AsySelectionColumnComponent } from './table/selection/asy-selection-column.component';
import { SidebarComponent } from './table/sidebar/sidebar.component';
import { AsySkeletonRowsComponent } from './table/skeleton-rows/asy-skeleton-rows.component';
import { AsySortHeaderComponent } from './table/sort/asy-sort-header/asy-sort-header.component';
import { AsySortDirective } from './table/sort/asy-sort.directive';
import { AsyTableEmptyStateComponent } from './table/table-empty-state/asy-table-empty-state.component';

@NgModule({
	imports: [
		CdkTableModule,
		CommonModule,
		FormsModule,
		SearchInputModule,
		NgSelectModule,
		BsDropdownModule.forRoot(),
		BsDatepickerModule,
		DragDropModule
	],
	declarations: [
		AsyFilterDirective,
		AsySortDirective,
		AsySortHeaderComponent,
		AsyHeaderDateFilterComponent,
		AsyHeaderListFilterComponent,
		AsyHeaderTextFilterComponent,
		AsyHeaderTypeaheadFilterComponent,
		AsySelectionColumnComponent,
		AsyExpanderColumnComponent,
		AsySkeletonRowsComponent,
		AsyTableEmptyStateComponent,
		ColumnChooserComponent,
		SidebarComponent,
		PaginatorComponent
	],
	exports: [
		AsyFilterDirective,
		AsySortDirective,
		AsySortHeaderComponent,
		AsyHeaderDateFilterComponent,
		AsyHeaderListFilterComponent,
		AsyHeaderTextFilterComponent,
		AsyHeaderTypeaheadFilterComponent,
		AsySelectionColumnComponent,
		AsyExpanderColumnComponent,
		AsySkeletonRowsComponent,
		AsyTableEmptyStateComponent,
		ColumnChooserComponent,
		SidebarComponent,
		PaginatorComponent
	],
	providers: [TitleCasePipe]
})
export class TableModule {}

export {
	AsyFilterDirective,
	AsySortDirective,
	AsySortHeaderComponent,
	AsyHeaderDateFilterComponent,
	AsyHeaderListFilterComponent,
	AsyHeaderTextFilterComponent,
	AsySelectionColumnComponent,
	AsyTableDataSource,
	ListFilterOption,
	AsyAbstractColumnComponent,
	AsyAbstractHeaderFilterComponent
};
