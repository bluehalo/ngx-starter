import { SelectionModel } from '@angular/cdk/collections';
import { CdkTableModule } from '@angular/cdk/table';
import { CommonModule } from '@angular/common';
import { Component, Directive, OnInit, TemplateRef, contentChild } from '@angular/core';

import { AsyAbstractValueColumnComponent } from '../asy-abstract-value-column.component';

@Directive({ selector: '[lc-item-tmp]', standalone: true })
export class ItemTemplateDirective {
	constructor(public template: TemplateRef<unknown>) {}
}

@Component({
	selector: 'asy-expandable-list-column',
	standalone: true,
	imports: [CommonModule, CdkTableModule],
	templateUrl: './asy-expandable-list-column.component.html',
	styleUrls: ['./asy-expandable-list-column.component.scss']
})
export class AsyExpandableListColumnComponent<T>
	extends AsyAbstractValueColumnComponent<T>
	implements OnInit
{
	readonly #selectionModel = new SelectionModel<T>();

	readonly itemTemplate = contentChild(ItemTemplateDirective, { read: TemplateRef });

	toggle(item: T) {
		this.#selectionModel.toggle(item);
	}

	isCollapsed(item: T) {
		return !this.#selectionModel.isSelected(item);
	}
}
