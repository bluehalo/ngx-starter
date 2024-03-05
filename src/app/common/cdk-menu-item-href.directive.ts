import { CdkMenuItem } from '@angular/cdk/menu';
import { Directive, inject } from '@angular/core';

/**
 * Work around for bug where CdkMenuItems w/ hrefs don't trigger properly when using keyboard navigation.
 */
@Directive({
	selector: 'a[cdkMenuItem][href]',
	standalone: true
})
export class CdkMenuItemHrefDirective {
	menuItem = inject(CdkMenuItem);

	constructor() {
		this.menuItem.triggered.subscribe(() => {
			this.menuItem._elementRef.nativeElement.click();
		});
	}
}
