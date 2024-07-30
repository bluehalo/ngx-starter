import { ChangeDetectionStrategy, Component, input, numberAttribute } from '@angular/core';

import { RepeatPipe } from 'ngxtension/repeat-pipe';

@Component({
	selector: 'asy-skeleton-rows',
	templateUrl: './asy-skeleton-rows.component.html',
	styleUrls: ['./asy-skeleton-rows.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	imports: [RepeatPipe],
	standalone: true
})
export class AsySkeletonRowsComponent {
	readonly rows = input.required({ transform: numberAttribute });
}
