import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

import capitalize from 'lodash/capitalize';
import isEmpty from 'lodash/isEmpty';
import { first, map } from 'rxjs/operators';

import { ConfigService } from './config.service';

@Injectable()
export class PageTitleStrategy extends TitleStrategy {
	private readonly title = inject(Title);
	private readonly configService = inject(ConfigService);

	override updateTitle(snapshot: RouterStateSnapshot) {
		this.configService
			.getConfig()
			.pipe(
				first(),
				map((config) => config?.app.title)
			)
			.subscribe((appTitle) => {
				const title = this.buildTitle(snapshot) ?? this.buildTitleFromUrl(snapshot.url);
				if (title !== undefined) {
					if (isEmpty(appTitle) || isEmpty(title)) {
						this.title.setTitle(`${appTitle}${title}`);
					} else {
						this.title.setTitle(`${appTitle} - ${title}`);
					}
				}
			});
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
