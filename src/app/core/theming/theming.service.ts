import { BreakpointObserver } from '@angular/cdk/layout';
import { Injectable, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';

import { STORAGE_EVENT, StorageService, filterByKey, toValue } from '@ng-web-apis/storage';
import { map, tap } from 'rxjs/operators';

const DARK_MODE_QUERY = '(prefers-color-scheme: dark)';
const STORAGE_KEY = 'theme-mode';

export enum Theme {
	Light = 'Light',
	Dark = 'Dark',
	Auto = 'Auto'
}

function toTheme(value: string | null) {
	if (value === 'Light') {
		return Theme.Light;
	}
	if (value === 'Dark') {
		return Theme.Dark;
	}
	return Theme.Auto;
}

@Injectable({
	providedIn: 'root'
})
export class ThemingService {
	readonly #observer = inject(BreakpointObserver);
	readonly #storage = inject(StorageService);

	readonly theme = toSignal(
		inject(STORAGE_EVENT).pipe(
			filterByKey(STORAGE_KEY),
			toValue(),
			map(toTheme),
			tap((theme) => {
				this.setBSTheme(theme);
			})
		),
		{
			initialValue: toTheme(this.#storage.getItem(STORAGE_KEY))
		}
	);

	constructor() {
		this.setBSTheme(this.theme());

		// monitor system dark mode status
		this.#observer.observe(DARK_MODE_QUERY).subscribe((result) => {
			if (this.theme() === Theme.Auto) {
				this.setBSTheme(result.matches ? Theme.Dark : Theme.Light);
			}
		});
	}

	private getSystemTheme(): Theme {
		// Check if dark mode is enabled at system level
		return this.#observer.isMatched(DARK_MODE_QUERY) ? Theme.Dark : Theme.Light;
	}

	public setTheme(theme: Theme) {
		this.#storage.setItem(STORAGE_KEY, theme);
	}

	private setBSTheme(theme: Theme) {
		if (theme === Theme.Auto) {
			theme = this.getSystemTheme();
		}
		document.documentElement.setAttribute('data-bs-theme', theme.toLowerCase());
	}
}
