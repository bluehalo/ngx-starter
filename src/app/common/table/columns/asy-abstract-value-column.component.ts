import { Directive, TemplateRef, booleanAttribute, contentChild, input } from '@angular/core';

import { AsyAbstractColumnComponent } from './asy-abstract-column.component';
import { HeaderTemplateDirective } from './header-template.directive';

@Directive({ standalone: true })
export abstract class AsyAbstractValueColumnComponent<T> extends AsyAbstractColumnComponent<T> {
	readonly header = input<string>();
	readonly sortable = input(false, { transform: booleanAttribute });

	readonly headerTemplate = contentChild(HeaderTemplateDirective, { read: TemplateRef });
}
