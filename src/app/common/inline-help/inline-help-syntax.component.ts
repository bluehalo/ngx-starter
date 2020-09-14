import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { StringUtils } from '../string-utils.service';

@Component({
	changeDetection: ChangeDetectionStrategy.OnPush,
	selector: 'inline-help-syntax',
	templateUrl: 'inline-help-syntax.component.html'
})
export class InlineHelpSyntaxComponent {
	@Input()
	set help(help: any) {
		if (null != help && null != help.syntax) {
			if (StringUtils.isNonEmptyString(help.syntax)) {
				this.text = help.syntax;
			}
		}
	}

	text: string;
}
