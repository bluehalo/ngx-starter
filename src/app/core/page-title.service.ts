import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import * as _ from 'lodash';
import { of } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { ConfigService } from './config.service';


@Injectable()
export class PageTitleService {
	constructor(
		private configService: ConfigService,
		private router: Router,
		private activatedRoute: ActivatedRoute,
		private titleService: Title
	) {}

	init() {

		this.configService.getConfig().subscribe((config) => {
			let appTitle = _.get(config, 'app.title', null);

			this.router.events.pipe(
				filter((event) => event instanceof NavigationEnd),
				map(() => this.activatedRoute),
				map((route) => {
					// Get to the leaf route
					while (null != route.firstChild) {
						route = route.firstChild;
					}
					return route;
				}),
				switchMap((route) => route.data),
				map((data) => {

					try {
						let pathTitle = data.title;

						// If there wasn't a path title, try to generate one
						if (null == pathTitle) {
							pathTitle = this.router.url.split('/')
								.slice(1)
								.map((frag) => _.capitalize(frag))
								.join(' > ');
						}

						if (_.isEmpty(appTitle) || _.isEmpty(pathTitle)) {
							return `${appTitle}${pathTitle}`;
						}
						else {
							return `${appTitle} - ${pathTitle}`;
						}
					}
					catch {
						return appTitle;
					}

				})
			).subscribe((title: string) => {
				this.titleService.setTitle(title);
			});

		});
	}

}
