import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, ResolveFn, Router, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { AbstractEntityService, ServiceMethod } from '../../../common';
import { EndUserAgreement } from '../../auth';

export const euaResolver: ResolveFn<EndUserAgreement | null> = (
	route: ActivatedRouteSnapshot,
	state: RouterStateSnapshot,
	router = inject(Router),
	service = inject(EuaService)
) => {
	const id = route.paramMap.get('id') ?? 'undefined';
	return service.read(id).pipe(catchError((error: unknown) => service.redirectError(error)));
};

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

	mapToType(model: unknown): EndUserAgreement {
		return new EndUserAgreement(model);
	}

	publish(eua: EndUserAgreement): Observable<EndUserAgreement | null> {
		return this.updateAction('publish', eua);
	}
}
