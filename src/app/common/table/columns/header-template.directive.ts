import { Directive, TemplateRef } from '@angular/core';

@Directive({ selector: '[asy-col-header-tmp]', standalone: true })
export class HeaderTemplateDirective {
	constructor(public template: TemplateRef<unknown>) {}
}
