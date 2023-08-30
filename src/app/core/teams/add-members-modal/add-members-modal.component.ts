import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';

import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, switchMap, tap } from 'rxjs/operators';

import { DialogAction, DialogReturn } from '../../../common/dialog';
import { ModalComponent } from '../../../common/modal/modal/modal.component';
import { PagingOptions } from '../../../common/paging.model';
import { User } from '../../auth/user.model';
import { TeamRole } from '../team-role.model';
import { AddedMember, TeamsService } from '../teams.service';

export type AddMembersModalData = {
	teamId: string;
};

export type AddMembersModalReturn = DialogReturn<number>;

@UntilDestroy()
@Component({
	selector: 'app-add-members-modal',
	templateUrl: './add-members-modal.component.html',
	styles: [
		`
			:host {
				display: contents;
			}
		`
	],
	standalone: true,
	imports: [
		ModalComponent,
		NgSelectModule,
		NgIf,
		NgFor,
		TooltipModule,
		AsyncPipe,
		CdkMenu,
		CdkMenuItem,
		CdkMenuTrigger
	]
})
export class AddMembersModalComponent implements OnInit {
	teamId: string;

	addedMembers: AddedMember[] = [];

	submitting = false;

	queryUserSearchTerm = '';

	teamRoleOptions: any[] = TeamRole.ROLES;

	usersLoading = false;
	usersInput$ = new Subject<string>();
	users$!: Observable<User[]>;

	teamsService = inject(TeamsService);

	private defaultRole = 'member';

	private pagingOptions: PagingOptions = new PagingOptions();

	private dialogRef: DialogRef<AddMembersModalReturn> = inject(DialogRef);
	private data: AddMembersModalData = inject(DIALOG_DATA);

	constructor() {
		this.teamId = this.data.teamId;
	}

	ngOnInit() {
		if (!this.data.teamId) {
			throw new TypeError(`'TeamId' is required`);
		}

		this.users$ = this.usersInput$
			.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => (this.usersLoading = true)),
				switchMap((term) =>
					this.teamsService.searchUsers(
						{ 'teams._id': { $ne: this.data.teamId } },
						term,
						this.pagingOptions,
						{}
					)
				),
				map((result) =>
					result.elements.filter(
						(user: any) =>
							!this.addedMembers.map((m) => m._id).includes(user?.userModel._id)
					)
				),
				tap(() => {
					this.usersLoading = false;
				})
			)
			.pipe(startWith([]));
	}

	submit() {
		this.submitting = true;

		// Add users who are already in the system
		this.teamsService
			.addMembers(this.addedMembers, { _id: this.data.teamId })
			.pipe(untilDestroyed(this))
			.subscribe(() => {
				this.submitting = false;
				this.dialogRef.close({ action: DialogAction.OK, data: this.addedMembers.length });
			});
	}

	cancel() {
		this.dialogRef.close({ action: DialogAction.CANCEL });
	}

	remove(ndx: number) {
		if (ndx >= 0 && ndx < this.addedMembers.length) {
			this.addedMembers.splice(ndx, 1);
		}
	}

	updateRoleSelection(addedMember: AddedMember, role: string) {
		addedMember.role = role;
		addedMember.roleDisplay = TeamRole.getDisplay(role);
	}

	typeaheadOnSelect(user: User, comp: NgSelectComponent) {
		const selectedUsername = user?.userModel?.username;
		const selectedUserId = user?.userModel?._id;
		if (null != selectedUsername) {
			this.addedMembers.push({
				username: selectedUsername,
				_id: selectedUserId,
				role: this.defaultRole,
				roleDisplay: TeamRole.getDisplay(this.defaultRole)
			} as AddedMember);

			comp.clearModel();
		}
		this.queryUserSearchTerm = '';
	}
}
