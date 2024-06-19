import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { CdkMenuItemRouterLinkDirective } from '../../../common';
import { Theme, ThemingService } from '../theming.service';

@Component({
	selector: 'app-theme-toggle',
	standalone: true,
	imports: [CdkMenu, CdkMenuItem, CdkMenuItemRouterLinkDirective, CdkTableModule, CdkMenuTrigger],
	templateUrl: './theme-toggle.component.html',
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
	readonly #themingService = inject(ThemingService);

	readonly selectedTheme = this.#themingService.theme;

	readonly themeOptions = new Map<Theme, string>([
		[Theme.Light, 'fa-sun'],
		[Theme.Dark, 'fa-moon'],
		[Theme.Auto, 'fa-circle-half-stroke']
	]);

	setTheme(theme: Theme) {
		this.#themingService.setTheme(theme);
	}
}
