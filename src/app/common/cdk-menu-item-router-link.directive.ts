import { CdkMenuItem } from '@angular/cdk/menu';
import { Directive, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

/**
 * Work around for bug where CdkMenuItems w/ RouterLink don't trigger properly when using keyboard navigation.
 */
@Directive({
	selector: '[cdkMenuItem][routerLink]',
	standalone: true
})
export class CdkMenuItemRouterLinkDirective {
	menuItem = inject(CdkMenuItem);
	routerLink = inject(RouterLink);

	constructor() {
		this.menuItem.triggered.subscribe(() => {
			this.routerLink.onClick(0, false, false, false, false);
		});
	}
}
