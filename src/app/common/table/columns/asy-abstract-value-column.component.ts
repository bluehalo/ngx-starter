import { ContentChild, Directive, TemplateRef, booleanAttribute, input } from '@angular/core';

import { AsyAbstractColumnComponent } from './asy-abstract-column.component';
import { HeaderTemplateDirective } from './header-template.directive';

@Directive()
export abstract class AsyAbstractValueColumnComponent<T> extends AsyAbstractColumnComponent<T> {
	readonly header = input<string>();
	readonly sortable = input(true, { transform: booleanAttribute });

	@ContentChild(HeaderTemplateDirective, { read: TemplateRef }) headerTemplate?: TemplateRef<any>;
}
