import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import get from 'lodash/get';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { TypeaheadMatch } from 'ngx-bootstrap/typeahead';

import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

import { PagingOptions, PagingResults } from '../../../common/paging.module';

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

	updateRoleSelection(ndx: number, role: string) {
		if (ndx >= 0 && ndx < this.addedMembers.length) {
			this.addedMembers[ndx].role = role;
			this.addedMembers[ndx].roleDisplay = TeamRole.getDisplay(role);
		}
	}

	typeaheadOnSelect(e: TypeaheadMatch) {
		const selectedUsername = get(e, 'item.userModel.username');
		const selectedUserId = get(e, 'item.userModel._id');
		if (
			null != selectedUsername &&
			this.addedMembers.findIndex((u: AddedMember) => u.username === selectedUsername) === -1
		) {
			this.addedMembers.push({
				username: selectedUsername,
				_id: selectedUserId,
				role: this.defaultRole,
				roleDisplay: TeamRole.getDisplay(this.defaultRole)
			} as AddedMember);
		}
		this.queryUserSearchTerm = '';
	}
}
