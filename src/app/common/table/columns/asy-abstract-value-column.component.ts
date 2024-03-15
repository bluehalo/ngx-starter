import { ContentChild, Directive, Input, TemplateRef } from '@angular/core';

import { AsyAbstractColumnComponent } from './asy-abstract-column.component';
import { HeaderTemplateDirective } from './header-template.directive';

@Directive()
export abstract class AsyAbstractValueColumnComponent<T> extends AsyAbstractColumnComponent<T> {
	@Input()
	header?: string;

	@Input()
	sortable = true;

	@ContentChild(HeaderTemplateDirective, { read: TemplateRef }) headerTemplate: TemplateRef<any>;
}
