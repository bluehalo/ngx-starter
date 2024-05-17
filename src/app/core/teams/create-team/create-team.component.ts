import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs/operators';

import { SkipToDirective } from '../../../common/directives/skip-to.directive';
import { MultiSelectDirective } from '../../../common/multi-select.directive';
import { PagingOptions } from '../../../common/paging.model';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { SessionService, User, UserExternalRolesSelectDirective } from '../../auth';
import { APP_CONFIG, APP_SESSION } from '../../tokens';
import { TeamSelectDirective } from '../directives/team-select.directive';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
	templateUrl: './create-team.component.html',
	standalone: true,
	imports: [
		RouterLink,
		SystemAlertComponent,
		FormsModule,
		NgSelectModule,
		AsyncPipe,
		MultiSelectDirective,
		UserExternalRolesSelectDirective,
		TeamSelectDirective,
		SkipToDirective,
		TitleCasePipe
	]
})
export class CreateTeamComponent implements OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #router = inject(Router);
	readonly #route = inject(ActivatedRoute);
	readonly #teamsService = inject(TeamsService);
	readonly #sessionService = inject(SessionService);
	readonly #alertService = inject(SystemAlertService);
	readonly #config = inject(APP_CONFIG);
	readonly #session = inject(APP_SESSION);

	readonly nestedTeamsEnabled = computed(() => this.#config()?.teams?.nestedTeams ?? false);
	readonly implicitMembersStrategy = computed(
		() => this.#config()?.teams?.implicitMembers?.strategy
	);
	readonly isAdmin = computed(() => this.#session().isAdmin());

	readonly isSubmitting = signal(false);

	readonly usersLoading = signal(false);
	readonly usersInput$ = new Subject<string>();
	readonly typeaheadUsers = signal<User[]>([]);

	teamAdmin = signal<User | undefined>(undefined);

	readonly team = new Team();

	constructor() {
		this.#alertService.clearAllAlerts();

		if (this.#session().isAdmin()) {
			this.setCurrentUserAsAdmin();
		}
	}

	ngOnInit() {
		this.#route.queryParamMap
			.pipe(
				filter((params) => params.has('parent')),
				map((params) => params.get('parent')),
				filter((id): id is string => id !== null),
				switchMap((id) => this.#teamsService.read(id)),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe((parent) => {
				this.team.parent = parent ?? undefined;
			});

		if (this.isAdmin()) {
			this.usersInput$
				.pipe(
					debounceTime(200),
					distinctUntilChanged(),
					tap(() => {
						this.usersLoading.set(true);
					}),
					switchMap((term) =>
						this.#teamsService.searchUsers({}, term, new PagingOptions(), {}, true)
					),
					map((result) =>
						result.elements.filter((user) => user._id !== this.teamAdmin()?._id)
					),
					tap(() => {
						this.usersLoading.set(false);
					}),
					takeUntilDestroyed(this.#destroyRef)
				)
				.subscribe((users) => {
					this.typeaheadUsers.set(users);
				});
		}
		this.team.implicitMembers = false;
	}

	setCurrentUserAsAdmin() {
		this.teamAdmin.set(this.#session().user);
	}

	save() {
		this.isSubmitting.set(true);
		this.#teamsService
			.create(this.team, this.teamAdmin()?._id)
			.pipe(
				switchMap(() => this.#sessionService.reloadSession()),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe(() => {
				return this.#router.navigate(['/team']);
			});
	}
}
