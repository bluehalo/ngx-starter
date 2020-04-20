import { Component, Input } from '@angular/core';
import { ActivatedRoute, Event, NavigationEnd, Router } from '@angular/router';

import { merge, BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Breadcrumb, BreadcrumbService } from './breadcrumb.service';

@Component({
	selector: 'breadcrumb',
	templateUrl: 'breadcrumb.component.html',
	styleUrls: ['breadcrumb.component.scss']
})
export class BreadcrumbComponent {
	@Input()
	set homeBreadcrumb(hb: Breadcrumb) {
		this._homeBreadcrumb = hb;
		this.homeBreadcrumbChanged$.next(hb);
	}
	_homeBreadcrumb: Breadcrumb;
	homeBreadcrumbChanged$: BehaviorSubject<Breadcrumb> = new BehaviorSubject(null);

	breadcrumbs: Breadcrumb[] = [];

	constructor(private route: ActivatedRoute, private router: Router) {
		const navEnd$: Observable<Event> = router.events.pipe(
			filter((event: Event) => event instanceof NavigationEnd)
		);
		merge(navEnd$, this.homeBreadcrumbChanged$).subscribe(() => {
			if (null != this._homeBreadcrumb) {
				this.breadcrumbs = [this._homeBreadcrumb];
				this.breadcrumbs = this.breadcrumbs.concat(
					BreadcrumbService.getBreadcrumbs(route.root.snapshot, this._homeBreadcrumb.url)
				);
			}
		});
	}
}
