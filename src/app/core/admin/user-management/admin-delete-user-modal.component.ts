import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { SystemAlertService } from '../../../common/system-alert/system-alert.service';

import { UntilDestroy } from '@ngneat/until-destroy';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { BehaviorSubject } from 'rxjs';
import { User } from '../../auth/user.model';
import { AdminUsersService } from './admin-users.service';

@UntilDestroy()
@Component({
	templateUrl: './admin-delete-user-modal.component.html'
})
export class AdminDeleteUserModalComponent implements OnInit {
	@Input() user: User;
	@Input() load$: BehaviorSubject<boolean>;
	@Output() readonly deleted: EventEmitter<User> = new EventEmitter();

	constructor(
		public modalRef: BsModalRef,
		public adminUsersService: AdminUsersService,
		public alertService: SystemAlertService
	) {}

	ngOnInit() {}

	submit() {
		this.adminUsersService.removeUser(this.user.userModel._id).subscribe({
			next: data => {},
			error: error => {
				this.alertService.addClientErrorAlert(error);
			}
		});
		this.modalRef.hide();
		this.load$.next(true);
	}
}
