import {
	Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef,
	AfterContentInit
} from '@angular/core';

import fromPairs from 'lodash/fromPairs';

import { NamedTemplate } from '../../directives.module';
import { PagingOptions, PageChange } from '../pager/pager.component';

@Component({
	selector: 'pageable-table',
	templateUrl: './pageable-table.component.html',
	styleUrls: [ './pageable-table.component.scss' ]
})
export class PageableTable implements AfterContentInit {

	@Input() pagingOptions: PagingOptions = new PagingOptions();
	@Input() items: Array<any>;
	@Input() hasItems = false;
	@Input() loading = false;
	@Input() showInCard = false;
	@Input() showActions = false;
	@Input() showFooterActions = false;
	@Input() hideTableToData = false;
	@Input() disableGoToEnd = false;
	@Input() pagerAtTop = false;
	@Input() pagerAtBottom = true;
	@Input() tableHover = false;
	@Input() tableStriped = false;

	@Output() onPageChange = new EventEmitter<PageChange>();
	@Output() pageAndScroll = new EventEmitter<PageChange>();

	@ContentChildren(NamedTemplate) templates: QueryList<NamedTemplate>;

	actionTemplate: TemplateRef<any>;
	headerTemplate: TemplateRef<any>;
	rowTemplate: TemplateRef<any>;
	noResultsTableTemplate: TemplateRef<any>;
	noDataTableTemplate: TemplateRef<any>;
	footerActionTemplate: TemplateRef<any>;

	ngAfterContentInit() {
		const typeTemplatePairs = this.templates.map(this.getNamedTemplates);
		const userSuppliedTemplates = fromPairs(typeTemplatePairs);
		this.actionTemplate = userSuppliedTemplates['table-action'];
		this.headerTemplate = userSuppliedTemplates['table-header'];
		this.rowTemplate = userSuppliedTemplates['table-row'];
		this.noResultsTableTemplate = userSuppliedTemplates['table-no-results'];
		this.noDataTableTemplate = userSuppliedTemplates['table-no-data'];
		this.footerActionTemplate = userSuppliedTemplates['table-footer-action'];
	}

	private getNamedTemplates = (template): [string, TemplateRef<any>] =>
		[template.name, template.templateRef]
}
