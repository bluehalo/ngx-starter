import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
	selector: 'ng-template[namedTemplate]'
})
export class NamedTemplateDirective {
	@Input() namedTemplate: string;

	constructor(public templateRef: TemplateRef<any>) { }
}
