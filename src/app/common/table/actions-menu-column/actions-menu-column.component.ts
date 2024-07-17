import { CdkMenu, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { NgTemplateOutlet } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	Directive,
	HostAttributeToken,
	TemplateRef,
	booleanAttribute,
	contentChild,
	inject,
	input
} from '@angular/core';

import { AsyAbstractColumnComponent } from '../columns/asy-abstract-column.component';

@Directive({ selector: '[actions-menu-tmp]', standalone: true })
export class ActionsMenuTemplateDirective {
	constructor(public template: TemplateRef<any>) {}
}

@Component({
	selector: 'asy-actions-menu-column',
	standalone: true,
	imports: [CdkTableModule, CdkMenuTrigger, NgTemplateOutlet, CdkMenu],
	templateUrl: './actions-menu-column.component.html',
	styleUrl: './actions-menu-column.component.scss',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsMenuColumnComponent<T> extends AsyAbstractColumnComponent<T> {
	readonly template = contentChild.required(ActionsMenuTemplateDirective, { read: TemplateRef });

	readonly hideMenu = input(false, { transform: booleanAttribute });

	#scope = inject(new HostAttributeToken('scope'));

	getTriggerId(index: number) {
		return `${this.#scope}-action-menu-btn-${index}`;
	}

	getMenuId(index: number) {
		return `${this.#scope}-action-menu-${index}`;
	}
}
