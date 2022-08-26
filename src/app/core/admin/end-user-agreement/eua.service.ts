import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractEntityService, ServiceMethod } from '../../../common/abstract-entity.service';
import { SystemAlertService } from '../../../common/system-alert/system-alert.service';
import { EndUserAgreement } from './eua.model';

@Injectable()
export class EuaService extends AbstractEntityService<EndUserAgreement> {
	constructor(http: HttpClient, alertService: SystemAlertService) {
		super(
			{
				[ServiceMethod.create]: 'api/eua',
				[ServiceMethod.read]: 'api/eua',
				[ServiceMethod.update]: 'api/eua',
				[ServiceMethod.delete]: 'api/eua',
				[ServiceMethod.search]: 'api/euas'
			},
			http,
			alertService
		);
	}

	mapToType(model: any): EndUserAgreement {
		return new EndUserAgreement().setFromModel(model);
	}

	publish(eua: EndUserAgreement): Observable<EndUserAgreement | null> {
		return this.updateAction('publish', eua);
	}
}
