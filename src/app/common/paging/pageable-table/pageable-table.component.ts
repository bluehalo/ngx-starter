import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';

import { PagingOptions, PageChange } from '../paging.model';

@Component({
	selector: 'pageable-table',
	templateUrl: './pageable-table.component.html',
	styleUrls: ['./pageable-table.component.scss']
})
export class PageableTableComponent {
	@Input() pagingOptions: PagingOptions = new PagingOptions();
	@Input() hasItems = false;
	@Input() itemIdProperty = '_id';
	@Input() loading = false;
	@Input() showInCard = false;
	@Input() showActions = false;
	@Input() hideActionsNoData = true;
	@Input() showFooterActions = false;
	@Input() hideTableNoData = false;
	@Input() disableGoToEnd = false;
	@Input() pagerAtTop = false;
	@Input() pagerAtBottom = true;
	@Input() tableHover = false;
	@Input() tableStriped = false;

	itemsInternal: Array<any>;
	itemsExpanded: Array<boolean>;

	@Input() set items(data: Array<any>) {
		this.itemsInternal = data;
		if (data) {
			this.itemsExpanded = Array(data.length).fill(false);
		}
	}

	@Output() readonly pageChange = new EventEmitter<PageChange>();

	@ContentChild('tableActions', { static: true }) actionTemplate: TemplateRef<any>;
	@ContentChild('tableHeader', { static: true }) headerTemplate: TemplateRef<any>;
	@ContentChild('tableRow', { static: true }) rowTemplate: TemplateRef<any>;
	@ContentChild('tableRowExpanded', { static: true }) rowExpandedTemplate: TemplateRef<any>;
	@ContentChild('tableNoResults', { static: true }) noResultsTableTemplate: TemplateRef<any>;
	@ContentChild('tableNoData', { static: true }) noDataTableTemplate: TemplateRef<any>;
	@ContentChild('tableFooterActions', { static: true }) footerActionTemplate: TemplateRef<any>;
}
