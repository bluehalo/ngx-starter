import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

import { NgSelectComponent } from '@ng-select/ng-select';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { concat, of, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, mergeMap, switchMap, tap } from 'rxjs/operators';
import { PagingOptions, PagingResults } from '../../../common/paging.module';
import { User } from '../../auth/user.model';
import { TeamRole } from '../team-role.model';
import { AddedMember, TeamsService } from '../teams.service';

@Component({
	selector: 'app-add-members-modal',
	templateUrl: './add-members-modal.component.html',
	styleUrls: ['./add-members-modal.component.scss']
})
export class AddMembersModalComponent implements OnInit {
	@Input() teamId: string;

	@Output() readonly usersAdded: EventEmitter<number> = new EventEmitter();

	addedMembers: AddedMember[] = [];

	submitting = false;

	queryUserSearchTerm = '';

	dataSource: Observable<any>;

	teamRoleOptions: any[] = TeamRole.ROLES;

	usersLoading = false;
	usersInput$ = new Subject<string>();
	users$: Observable<User[]>;

	private defaultRole = 'member';

	private pagingOptions: PagingOptions = new PagingOptions();

	constructor(private teamsService: TeamsService, public modalRef: BsModalRef) {}

	ngOnInit() {
		this.dataSource = new Observable((observer: any) => {
			observer.next(this.queryUserSearchTerm);
		}).pipe(
			mergeMap((token: string) =>
				this.teamsService.searchUsers({}, token, this.pagingOptions, {})
			),
			map((result: PagingResults) => {
				return result.elements.map((r: any) => {
					r.displayName = `${r.userModel.name}  [${r.userModel.username}]`;
					return r;
				});
			})
		);

		this.users$ = concat(
			of([]), // default items
			this.usersInput$.pipe(
				debounceTime(200),
				distinctUntilChanged(),
				tap(() => (this.usersLoading = true)),
				switchMap(term => this.teamsService.searchUsers({}, term, this.pagingOptions, {})),
				map(result =>
					result.elements.filter(
						(user: any) =>
							!this.addedMembers.map(m => m._id).includes(user?.userModel._id)
					)
				),
				tap(() => {
					this.usersLoading = false;
				})
			)
		);
	}

	submit() {
		this.submitting = true;

		// Add users who are already in the system
		this.teamsService.addMembers(this.addedMembers, this.teamId).subscribe(() => {
			this.submitting = false;
			this.modalRef.hide();
			this.usersAdded.emit(this.addedMembers.length);
		});
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
