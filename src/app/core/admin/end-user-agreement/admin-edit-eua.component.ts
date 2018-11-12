import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { EndUserAgreement } from './eua.model';
import { EuaService } from './eua.service';
import { ManageEuaComponent } from './manage-eua.component';
import { ModalService } from '../../../common/modal.module';

@Component({
	selector: 'admin-update-eua',
	templateUrl: './manage-eua.component.html'
})
export class AdminUpdateEuaComponent extends ManageEuaComponent implements OnInit {

	constructor(
		router: Router,
		public modalService: ModalService,
		protected euaService: EuaService,
		protected route: ActivatedRoute
	) {
		super(router, modalService);
	}

	ngOnInit() {
		this.title = 'Edit EUA';
		this.subtitle = 'Make changes to the eua\'s information';
		this.submitText = 'Save';

		this.route.params.subscribe((params: Params) => {
			this.id = params[`id`];
			this.euaService.get(this.id).subscribe((euaRaw: any) => {
				this.eua = new EndUserAgreement().setFromEuaModel(euaRaw);
			});
		});
	}

	submitEua() {
		let _eua = new EndUserAgreement();
		_eua.euaModel = {
			_id: this.eua.euaModel._id,
			title: this.eua.euaModel.title,
			text: this.eua.euaModel.text,
			published: this.eua.euaModel.published
		};
		this.euaService.update(_eua).subscribe(() => this.router.navigate(['/admin/euas', {clearCachedFilter: true}]));
	}
}
