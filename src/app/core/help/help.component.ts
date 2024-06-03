import { JsonPipe, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
	ActivatedRoute,
	NavigationEnd,
	Router,
	RouterLink,
	RouterLinkActive,
	RouterOutlet
} from '@angular/router';

import { filter, map } from 'rxjs/operators';

@Component({
	templateUrl: 'help.component.html',
	styleUrls: ['help.component.scss'],
	standalone: true,
	imports: [RouterLinkActive, RouterLink, RouterOutlet, TitleCasePipe, JsonPipe]
})
export class HelpComponent {
	readonly #route = inject(ActivatedRoute);
	readonly childRoute = toSignal(
		inject(Router).events.pipe(
			filter((event): event is NavigationEnd => event instanceof NavigationEnd),
			map((event) => this.#route.firstChild?.routeConfig)
		)
	);

	readonly childRoutes = (this.#route.routeConfig?.children ?? []).filter((route) => route.path);
}
