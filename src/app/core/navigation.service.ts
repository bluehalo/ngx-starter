import { DestroyRef, Injectable, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DefaultUrlSerializer, NavigationStart, Router } from '@angular/router';

import { filter, map } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class NavigationService {
	private previousUrl = '';

	private destroyRef = inject(DestroyRef);
	private readonly router = inject(Router);

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
				takeUntilDestroyed(this.destroyRef)
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
