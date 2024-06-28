import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';

import { APP_CONFIG } from './tokens';

// eslint-disable-next-line @angular-eslint/use-injectable-provided-in
@Injectable()
export class PageTitleStrategy extends TitleStrategy {
	readonly #title = inject(Title);
	readonly #config = inject(APP_CONFIG);

	override updateTitle(snapshot: RouterStateSnapshot) {
		const appTitle = this.#config()?.app.title;

		const title = this.buildTitle(snapshot) ?? this.buildTitleFromUrl(snapshot.url);
		if (title !== undefined) {
			if (isEmpty(appTitle) || isEmpty(title)) {
				this.#title.setTitle(`${appTitle}${title}`);
			} else {
				this.#title.setTitle(`${appTitle} - ${title}`);
			}
		}
	}

	buildTitleFromUrl(url: string) {
		try {
			return url
				.split(';')[0]
				.split('/')
				.slice(1)
				.map((frag) => capitalize(frag))
				.join(' > ');
		} catch {
			// no-op
		}
		return undefined;
	}
}
