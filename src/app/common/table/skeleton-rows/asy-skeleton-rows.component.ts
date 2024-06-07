import {
	ChangeDetectionStrategy,
	Component,
	computed,
	input,
	numberAttribute
} from '@angular/core';

@Component({
	selector: 'asy-skeleton-rows',
	templateUrl: './asy-skeleton-rows.component.html',
	styleUrls: ['./asy-skeleton-rows.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	standalone: true
})
export class AsySkeletonRowsComponent {
	readonly rows = input.required({ transform: numberAttribute });

	readonly _rows = computed(() => Array(this.rows()).fill(0));
}
