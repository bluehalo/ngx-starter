import { ActivatedRouteSnapshot, PRIMARY_OUTLET, UrlSegment } from '@angular/router';

export interface Breadcrumb {
	label: string;
	url: string;
}

export class BreadcrumbService {

	static getBreadcrumbs(route: ActivatedRouteSnapshot, url: string = '', breadcrumbs: Breadcrumb[] = []): Breadcrumb[] {
		const ROUTE_DATA_BREADCRUMB = 'breadcrumb';

		// Get the child routes
		const children: ActivatedRouteSnapshot[] = route.children;

		// Return if there are no more children
		if (children.length === 0) {
			return breadcrumbs;
		}

		for (const child of children) {
			// Verify that this is a primary route
			if (child.outlet !== PRIMARY_OUTLET) {
				continue;
			}

			// Verify the custom data property "breadcrumb" is specified on the route
			if (!child.data.hasOwnProperty(ROUTE_DATA_BREADCRUMB)) {
				return this.getBreadcrumbs(child, url, breadcrumbs);
			}

			// Get the route's URL segment
			const routeURL: string = child.url.map((segment: UrlSegment) => segment.path).join('/');

			// Append route URL to URL
			url += `/${routeURL}`;

			// Add breadcrumb
			breadcrumbs.push({ label: child.data[ROUTE_DATA_BREADCRUMB], url });

			return this.getBreadcrumbs(child, url, breadcrumbs);
		}
	}

	static getBreadcrumbLabel(route: ActivatedRouteSnapshot): string {
		const breadcrumbs: Breadcrumb[] = this.getBreadcrumbs(route);

		if (breadcrumbs.length > 0) {
			const firstBreadcrumb = breadcrumbs[0];
			if (null != firstBreadcrumb) {
				return firstBreadcrumb.label;
			}
		}
	}
}
