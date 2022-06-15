import { Injectable } from '@angular/core';
import { DefaultUrlSerializer, NavigationStart, Router } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { filter, map } from 'rxjs/operators';

@UntilDestroy()
@Injectable({
	providedIn: 'root'
})
export class NavigationService {
	private previousUrl = '';

	constructor(private readonly router: Router) {}

	init() {
		this.router.events
			.pipe(
				filter((event): event is NavigationStart => event instanceof NavigationStart),
				map((event) => event.url),
				filter(
					(url) =>
						!url.includes('/signin') &&
						!url.includes('/access') &&
						!url.includes('/eua')
				),
				untilDestroyed(this)
			)
			.subscribe((url) => {
				this.previousUrl = url;
			});
	}

	navigateToPreviousRoute() {
		// parse the query parameters into an object
		const queryParams = new DefaultUrlSerializer().parse(this.previousUrl).queryParams;
		const extras = { queryParams, replaceUrl: true };

		// strip the query parameters from the URL
		const [urlBase] = this.previousUrl.split('?');

		// Redirect the user
		this.router.navigate([urlBase], extras).catch(() => {
			this.router.navigate(['']);
		});
	}
}
