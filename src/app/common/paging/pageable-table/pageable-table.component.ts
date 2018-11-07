import { Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { fromPairs } from 'lodash';

import { SortDisplayOption } from '../sorting.model';
import { PagingOptions, PageChange } from '../pager/pager.component';
import { NamedTemplate } from '../../named-template.directive';

export type TableSortOptions = {
	[name: string]: SortDisplayOption
};

@Component({
	selector: 'pageable-table',
	templateUrl: 'pageable-table.component.html'
})

export class PageableTable {

	@Input() items: Array<any>;
	@Input() pagingOptions: PagingOptions = new PagingOptions();
	@Input() sortOptions: TableSortOptions;
	@Input() refreshable: boolean = false;

	@Output() onPageChange = new EventEmitter<PageChange>();
	@Output() onSortChange = new EventEmitter<SortDisplayOption>();
	@Output() onRefresh = new EventEmitter();

	@ContentChildren(NamedTemplate) templates: QueryList<NamedTemplate>;

	headerTemplate: TemplateRef<any>;
	rowTemplate: TemplateRef<any>;
	emptyTableTemplate: TemplateRef<any>;

	ngAfterContentInit() {
		const typeTemplatePairs = this.templates.map((template): [string, TemplateRef<any>] => [template.name, template.templateRef]);
		const userSuppliedTemplates = fromPairs(typeTemplatePairs);
		this.headerTemplate = userSuppliedTemplates['table-header'];
		this.rowTemplate = userSuppliedTemplates['table-row'];
		this.emptyTableTemplate = userSuppliedTemplates['empty-table'];
	}
}
