import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { AsyncPipe } from '@angular/common';
import {
	ChangeDetectionStrategy,
	Component,
	DestroyRef,
	OnInit,
	inject,
	signal
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgbTooltip } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';

import { ModalComponent, PagingOptions } from '../../../common';
import { DialogAction, DialogReturn } from '../../../common/dialog';
import { User } from '../../auth';
import { TeamRole } from '../team-role.model';
import { AddedMember, TeamsService } from '../teams.service';

export type AddMembersModalData = {
	teamId: string;
};

export type AddMembersModalReturn = DialogReturn<number>;

@Component({
	templateUrl: './add-members-modal.component.html',
	styleUrls: ['./add-members-modal.component.scss'],
	standalone: true,
	imports: [
		ModalComponent,
		NgSelectModule,
		AsyncPipe,
		CdkMenu,
		CdkMenuItem,
		CdkMenuTrigger,
		CdkTableModule,
		NgbTooltip
	],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddMembersModalComponent implements OnInit {
	readonly #destroyRef = inject(DestroyRef);
	readonly #dialogRef: DialogRef<AddMembersModalReturn> = inject(DialogRef);
	readonly #data: AddMembersModalData = inject(DIALOG_DATA);
	readonly #teamsService = inject(TeamsService);
	readonly #defaultRole = 'member';

	readonly addedMembers = signal<AddedMember[]>([]);
	readonly isSubmitting = signal(false);
	readonly columns = ['name', 'username', 'role', 'actions'];
	readonly teamRoleOptions = TeamRole.ROLES;

	readonly usersLoading = signal(false);
	readonly usersInput$ = new Subject<string>();
	readonly typeaheadUsers = signal<User[]>([]);

	ngOnInit() {
		if (!this.#data.teamId) {
			throw new TypeError(`'TeamId' is required`);
		}

		this.usersInput$
			.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => {
					this.usersLoading.set(true);
				}),
				switchMap((term) =>
					this.#teamsService.searchUsers(
						{ 'teams._id': { $ne: this.#data.teamId } },
						term,
						new PagingOptions(),
						{}
					)
				),
				map((result) =>
					result.elements.filter(
						(user) =>
							!this.addedMembers()
								.map((m) => m._id)
								.includes(user._id)
					)
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

	submit() {
		this.isSubmitting.set(true);

		// Add users who are already in the system
		this.#teamsService
			.addMembers(this.addedMembers(), { _id: this.#data.teamId })
			.pipe(takeUntilDestroyed(this.#destroyRef))
			.subscribe(() => {
				this.isSubmitting.set(false);
				this.#dialogRef.close({
					action: DialogAction.OK,
					data: this.addedMembers().length
				});
			});
	}

	cancel() {
		this.#dialogRef.close({ action: DialogAction.CANCEL });
	}

	remove(index: number) {
		if (index >= 0 && index < this.addedMembers().length) {
			this.addedMembers.update((members) => {
				// can be simplified with toSpliced once we upgrade to node 20
				members.splice(index, 1);
				return [...members];
			});
		}
	}

	updateRoleSelection(addedMember: AddedMember, role: string) {
		addedMember.role = role;
		addedMember.roleDisplay = TeamRole.getDisplay(role);
	}

	typeaheadOnSelect(user: User, comp: NgSelectComponent) {
		if (user) {
			this.addedMembers.update((members) => [
				...members,
				{
					name: user.name,
					username: user.username,
					_id: user._id,
					role: this.#defaultRole,
					roleDisplay: TeamRole.getDisplay(this.#defaultRole)
				}
			]);

			comp.clearModel();
		}
	}
}
