import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	computed,
	inject,
	input
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { filter, first, map, switchMap } from 'rxjs/operators';

import { DialogAction, DialogService } from '../../../common/dialog';
import { SystemAlertComponent } from '../../../common/system-alert/system-alert.component';
import { SessionService } from '../../auth';
import { APP_SESSION } from '../../tokens';
import { HasTeamRoleDirective } from '../directives/has-team-role.directive';
import { TeamRole } from '../team-role.model';
import { injectTeamTopics } from '../team-topic.model';
import { Team } from '../team.model';
import { TeamsService } from '../teams.service';

@Component({
	selector: 'app-view-team',
	templateUrl: './view-team.component.html',
	styleUrls: ['./view-team.component.scss'],
	standalone: true,
	imports: [
		SystemAlertComponent,
		RouterLink,
		HasTeamRoleDirective,
		RouterLinkActive,
		RouterOutlet
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewTeamComponent {
	readonly #router = inject(Router);
	readonly #destroyRef = inject(DestroyRef);
	readonly #dialogService = inject(DialogService);
	readonly #teamsService = inject(TeamsService);
	readonly #sessionService = inject(SessionService);
	readonly #session = inject(APP_SESSION);

	readonly topics = injectTeamTopics();

	readonly team = input.required<Team>();

	readonly isTeamAdmin = computed(
		() => this.#session().isAdmin() || this.#session().hasTeamRole(this.team(), TeamRole.ADMIN)
	);

	remove(team: Team) {
		this.#dialogService
			.confirm(
				'Delete team?',
				`Are you sure you want to delete the team: <strong>"${team.name}"</strong>?<br/>This action cannot be undone.`,
				'Delete'
			)
			.closed.pipe(
				first(),
				filter((result) => result?.action === DialogAction.OK),
				switchMap(() => this.#teamsService.delete(team)),
				switchMap((team) =>
					this.#sessionService.reloadSession().pipe(map((session) => team))
				),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe((team) => {
				if (team) {
					this.#router.navigate(['/team']);
				}
			});
	}
}
