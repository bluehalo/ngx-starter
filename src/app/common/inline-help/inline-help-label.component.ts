import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'inline-help-label',
	templateUrl: 'inline-help-label.component.html'
})
export class InlineHelpLabelComponent {
	@Input() required = false;
	@Input() label: string;
	@Input() help: any;
	@Input() disabled = false;
	@Input() showTooltip = true;
}
