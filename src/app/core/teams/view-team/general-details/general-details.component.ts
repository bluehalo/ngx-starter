import { TitleCasePipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	computed,
	inject,
	model,
	signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { NgSelectModule } from '@ng-select/ng-select';
import { switchMap, tap } from 'rxjs/operators';

import { MultiSelectDirective } from '../../../../common/multi-select.directive';
import { JoinPipe } from '../../../../common/pipes/join.pipe';
import { UtcDatePipe } from '../../../../common/pipes/utc-date-pipe/utc-date.pipe';
import { SystemAlertService } from '../../../../common/system-alert/system-alert.service';
import { SessionService, UserExternalRolesSelectDirective } from '../../../auth';
import { APP_CONFIG } from '../../../tokens';
import { HasTeamRoleDirective } from '../../directives/has-team-role.directive';
import { ListTeamMembersComponent } from '../../list-team-members/list-team-members.component';
import { ListSubTeamsComponent } from '../../list-teams/list-sub-teams.component';
import { Team } from '../../team.model';
import { TeamsService } from '../../teams.service';

@Component({
	selector: 'app-general-details',
	templateUrl: './general-details.component.html',
	styleUrls: ['./general-details.component.scss'],
	standalone: true,
	imports: [
		ListTeamMembersComponent,
		HasTeamRoleDirective,
		FormsModule,
		RouterLink,
		ListSubTeamsComponent,
		TitleCasePipe,
		JoinPipe,
		UtcDatePipe,
		MultiSelectDirective,
		NgSelectModule,
		UserExternalRolesSelectDirective
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class GeneralDetailsComponent {
	readonly #destroyRef = inject(DestroyRef);
	readonly #alertService = inject(SystemAlertService);
	readonly #sessionService = inject(SessionService);
	readonly #teamsService = inject(TeamsService);
	readonly #config = inject(APP_CONFIG);

	readonly nestedTeamsEnabled = computed(() => this.#config()?.teams?.nestedTeams ?? false);
	readonly implicitMembersStrategy = computed(
		() => this.#config()?.teams?.implicitMembers?.strategy
	);

	readonly team = model.required<Team>();
	readonly isEditing = signal(false);

	teamEditCopy: Team;

	edit() {
		this.teamEditCopy = new Team(this.team());
		this.isEditing.set(true);
	}

	cancelEdit() {
		this.isEditing.set(false);
	}

	saveEdit() {
		this.#teamsService
			.update(this.teamEditCopy)
			.pipe(
				tap((team: Team | null) => {
					this.isEditing.set(false);
					if (team) {
						this.team.set(team);
						this.#alertService.addAlert('Team updated', 'success', 5000);
					}
				}),
				switchMap(() => this.#sessionService.reloadSession()),
				takeUntilDestroyed(this.#destroyRef)
			)
			.subscribe();
	}
}
