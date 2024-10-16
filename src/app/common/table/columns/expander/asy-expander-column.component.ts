import { SelectionModel } from '@angular/cdk/collections';
import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, OnInit, booleanAttribute, input } from '@angular/core';

import { AsyAbstractColumnComponent } from '../asy-abstract-column.component';

type IsExpandableFn<T> = (index: number, rowData: T) => boolean;
type TrackByFn<T, TB> = (index: number, rowData: T) => TB;

@Component({
	selector: 'asy-expander-column',
	templateUrl: './asy-expander-column.component.html',
	styleUrls: ['./asy-expander-column.component.scss'],
	changeDetection: ChangeDetectionStrategy.Default,
	standalone: true,
	imports: [CdkTableModule]
})
export class AsyExpanderColumnComponent<T, TB>
	extends AsyAbstractColumnComponent<T>
	implements OnInit
{
	#selectionModel: SelectionModel<TB>;

	readonly multi = input(true, { transform: booleanAttribute });
	readonly isExpandable = input<IsExpandableFn<T>>(() => true);
	readonly trackBy = input<TrackByFn<T, TB>>((index, rowData) => rowData as unknown as TB);

	constructor() {
		super();
		this.name = 'expander';
	}

	override ngOnInit(): void {
		super.ngOnInit();

		this.#selectionModel = new SelectionModel<TB>(this.multi());
	}

	expand(...trackByValues: TB[]) {
		this.#selectionModel.select(...trackByValues);
	}

	toggle(index: number, result: T) {
		this.#selectionModel.toggle(this.trackBy()(index, result));
	}

	isExpanded(index: number, result: T) {
		return this.#selectionModel.isSelected(this.trackBy()(index, result));
	}

	get expanded() {
		return this.#selectionModel.selected;
	}

	// eslint-disable-next-line rxjs/finnish
	get changed() {
		return this.#selectionModel.changed;
	}

	hasExpanded() {
		return this.#selectionModel.hasValue();
	}
}
