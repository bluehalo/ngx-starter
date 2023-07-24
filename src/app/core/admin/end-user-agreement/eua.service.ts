import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { AbstractEntityService, ServiceMethod } from '../../../common/abstract-entity.service';
import { EndUserAgreement } from './eua.model';

@Injectable({ providedIn: 'root' })
export class EuaService extends AbstractEntityService<EndUserAgreement> {
	constructor() {
		super({
			[ServiceMethod.create]: 'api/eua',
			[ServiceMethod.read]: 'api/eua',
			[ServiceMethod.update]: 'api/eua',
			[ServiceMethod.delete]: 'api/eua',
			[ServiceMethod.search]: 'api/euas'
		});
	}

	mapToType(model: any): EndUserAgreement {
		return new EndUserAgreement().setFromModel(model);
	}

	publish(eua: EndUserAgreement): Observable<EndUserAgreement | null> {
		return this.updateAction('publish', eua);
	}
}
