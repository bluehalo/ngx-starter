import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'inline-help-tooltip',
	templateUrl: 'inline-help-tooltip.component.html'
})
export class InlineHelpTooltipComponent {
	@Input() help: any;
	@Input() showSearchLink = true;
}
