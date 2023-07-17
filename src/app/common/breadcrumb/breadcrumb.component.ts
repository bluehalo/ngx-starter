import { NgFor, NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router, RouterLink } from '@angular/router';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { BehaviorSubject, Observable, merge } from 'rxjs';
import { filter } from 'rxjs/operators';

import { Breadcrumb, BreadcrumbService } from './breadcrumb.service';

@UntilDestroy()
@Component({
	selector: 'breadcrumb',
	templateUrl: 'breadcrumb.component.html',
	styleUrls: ['breadcrumb.component.scss'],
	standalone: true,
	imports: [NgFor, NgIf, RouterLink]
})
export class BreadcrumbComponent {
	@Input()
	set homeBreadcrumb(hb: Breadcrumb) {
		this._homeBreadcrumb = hb;
		this.homeBreadcrumbChanged$.next(hb);
	}
	_homeBreadcrumb?: Breadcrumb;
	homeBreadcrumbChanged$ = new BehaviorSubject<Breadcrumb | null>(null);

	breadcrumbs: Breadcrumb[] = [];

	constructor(private route: ActivatedRoute, private router: Router) {
		const navEnd$: Observable<Event> = router.events.pipe(
			filter((event: Event) => event instanceof NavigationEnd)
		);
		merge(navEnd$, this.homeBreadcrumbChanged$)
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				if (this._homeBreadcrumb) {
					this.breadcrumbs = [this._homeBreadcrumb];
					this.breadcrumbs = this.breadcrumbs.concat(
						BreadcrumbService.getBreadcrumbs(
							route.root.snapshot,
							this._homeBreadcrumb.url
						)
					);
				}
			});
	}
}
