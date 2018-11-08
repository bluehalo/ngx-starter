import {
	Component, Input, Output, EventEmitter, ContentChildren, QueryList, TemplateRef,
	AfterContentInit
} from '@angular/core';

import { fromPairs } from 'lodash';

import { NamedTemplate } from '../../directives.module';
import { PagingOptions, PageChange } from '../pager/pager.component';

@Component({
	selector: 'pageable-table',
	templateUrl: './pageable-table.component.html',
	styleUrls: [ './pageable-table.component.scss' ]
})
export class PageableTable implements AfterContentInit {

	@Input() items: Array<any>;
	@Input() pagingOptions: PagingOptions = new PagingOptions();
	@Input() loading: boolean = false;
	@Input() refreshable: boolean = false;
	@Input() showInCard: boolean = true;
	@Input() showHeader: boolean = true;
	@Input() showActions = false;
	@Input() disableGoToEnd: boolean = false;
	@Input() pagerAtBottom: boolean = false;
	@Input() maxAllowed: number;
	@Input() pagedPastAllowed: boolean = false;

	@Output() onPageChange = new EventEmitter<PageChange>();
	@Output() pageAndScroll = new EventEmitter<PageChange>();
	@Output() onRefresh = new EventEmitter();

	@ContentChildren(NamedTemplate) templates: QueryList<NamedTemplate>;

	actionTemplate: TemplateRef<any>;
	headerTemplate: TemplateRef<any>;
	rowTemplate: TemplateRef<any>;
	footerTemplate: TemplateRef<any>;
	emptyTableTemplate: TemplateRef<any>;

	ngAfterContentInit() {
		const typeTemplatePairs = this.templates.map(this.getNamedTemplates);
		const userSuppliedTemplates = fromPairs(typeTemplatePairs);
		this.actionTemplate = userSuppliedTemplates['table-action'];
		this.headerTemplate = userSuppliedTemplates['table-header'];
		this.rowTemplate = userSuppliedTemplates['table-row'];
		this.footerTemplate = userSuppliedTemplates['table-footer'];
		this.emptyTableTemplate = userSuppliedTemplates['empty-table'];
	}

	private getNamedTemplates = (template): [string, TemplateRef<any>] =>
		[template.name, template.templateRef]
}
