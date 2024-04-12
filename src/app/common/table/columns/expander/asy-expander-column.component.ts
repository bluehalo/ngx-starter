import { SelectionModel } from '@angular/cdk/collections';
import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, Input, OnInit, booleanAttribute } from '@angular/core';

import { AsyAbstractColumnComponent } from '../asy-abstract-column.component';

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
	@Input({ transform: booleanAttribute })
	multi = true;

	private selectionModel: SelectionModel<TB>;

	@Input()
	isExpandable: (index: number, rowData: T) => boolean = () => true;

	@Input()
	trackBy: (index: number, rowData: T) => TB = (index, rowData) => rowData as unknown as TB;

	constructor() {
		super();
		this.name = 'expander';
	}

	override ngOnInit(): void {
		super.ngOnInit();

		this.selectionModel = new SelectionModel<TB>(this.multi);
	}

	expand(...trackByValues: TB[]) {
		this.selectionModel.select(...trackByValues);
	}

	toggle(index: number, result: T) {
		this.selectionModel.toggle(this.trackBy(index, result));
	}

	isExpanded(index: number, result: T) {
		return this.selectionModel.isSelected(this.trackBy(index, result));
	}

	get expanded() {
		return this.selectionModel.selected;
	}

	// eslint-disable-next-line rxjs/finnish
	get changed() {
		return this.selectionModel.changed;
	}

	hasExpanded() {
		return this.selectionModel.hasValue();
	}
}
