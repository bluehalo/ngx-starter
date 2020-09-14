import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'inline-help-limit',
	templateUrl: 'inline-help-limit.component.html'
})
export class InlineHelpLimitComponent {
	@Input() limit: number;
	@Input() description = 'items';
	@Input() remaining: number;
}
