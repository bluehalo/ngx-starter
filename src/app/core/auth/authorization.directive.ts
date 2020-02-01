import {
	Directive,
	Input,
	TemplateRef,
	ViewContainerRef,
	OnInit,
	SimpleChanges,
	OnChanges,
	EmbeddedViewRef,
	ɵstringify as stringify
} from '@angular/core';

import { SessionService } from './session.service';
import { AuthorizationService } from './authorization.service';

@Directive({
	selector: '[isAuthenticated], [hasRole], [hasEveryRole], [hasSomeRoles]'
})
export class AuthorizationDirective implements OnChanges, OnInit {
	@Input() hasRole: string;
	@Input() hasEveryRole: string[];
	@Input() hasSomeRoles: string[];

	private _thenTemplateRef: TemplateRef<any> | null = null;
	private _elseTemplateRef: TemplateRef<any> | null = null;
	private _thenViewRef: EmbeddedViewRef<any> | null = null;
	private _elseViewRef: EmbeddedViewRef<any> | null = null;

	constructor(
		private templateRef: TemplateRef<any>,
		private _viewContainer: ViewContainerRef,
		private sessionService: SessionService,
		private authorizationService: AuthorizationService
	) {
		this._thenTemplateRef = templateRef;
	}

	@Input()
	set isAuthenticatedThen(templateRef: TemplateRef<any> | null) {
		this.setThenTemplate('isAuthenticatedThen', templateRef);
	}
	@Input()
	set hasRoleThen(templateRef: TemplateRef<any> | null) {
		this.setThenTemplate('hasRoleThen', templateRef);
	}
	@Input()
	set hasEveryRoleThen(templateRef: TemplateRef<any> | null) {
		this.setThenTemplate('hasEveryRoleThen', templateRef);
	}
	@Input()
	set hasSomeRolesThen(templateRef: TemplateRef<any> | null) {
		this.setThenTemplate('hasSomeRolesThen', templateRef);
	}

	@Input()
	set isAuthenticatedElse(templateRef: TemplateRef<any> | null) {
		this.setElseTemplate('isAuthenticatedElse', templateRef);
	}
	@Input()
	set hasRoleElse(templateRef: TemplateRef<any> | null) {
		this.setElseTemplate('hasRoleElse', templateRef);
	}
	@Input()
	set hasEveryRoleElse(templateRef: TemplateRef<any> | null) {
		this.setElseTemplate('hasEveryRoleElse', templateRef);
	}
	@Input()
	set hasSomeRolesElse(templateRef: TemplateRef<any> | null) {
		this.setElseTemplate('hasSomeRolesElse', templateRef);
	}

	ngOnInit() {
		this.sessionService.getSession().subscribe(() => {
			this._updateView();
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		const hasRoleChanges = changes.hasRole;
		const hasEveryRoleChanges = changes.hasEveryRole;
		const hasSomeRolesChanges = changes.hasSomeRoles;

		if (hasRoleChanges || hasEveryRoleChanges || hasSomeRolesChanges) {
			// Due to bug when you pass empty array
			if (
				(hasRoleChanges && hasRoleChanges.firstChange) ||
				(hasEveryRoleChanges && hasEveryRoleChanges.firstChange) ||
				(hasSomeRolesChanges && hasSomeRolesChanges.firstChange)
			) {
				return;
			}

			this._updateView();
		}
	}

	private setThenTemplate(property: string, templateRef: TemplateRef<any> | null) {
		assertTemplate(property, templateRef);
		this._thenTemplateRef = templateRef;
		this._thenViewRef = null; // clear previous view if any
		this._updateView();
	}

	private setElseTemplate(property: string, templateRef: TemplateRef<any> | null) {
		assertTemplate(property, templateRef);
		this._elseTemplateRef = templateRef;
		this._elseViewRef = null; // clear previous view if any
		this._updateView();
	}

	private _updateView() {
		if (this.checkPermission()) {
			if (!this._thenViewRef) {
				this._viewContainer.clear();
				this._elseViewRef = null;
				if (this._thenTemplateRef) {
					this._thenViewRef = this._viewContainer.createEmbeddedView(
						this._thenTemplateRef
					);
				}
			}
		} else {
			if (!this._elseViewRef) {
				this._viewContainer.clear();
				this._thenViewRef = null;
				if (this._elseTemplateRef) {
					this._elseViewRef = this._viewContainer.createEmbeddedView(
						this._elseTemplateRef
					);
				}
			}
		}
	}

	private checkPermission() {
		let hasPermission = false;

		if (this.hasRole != null) {
			hasPermission = this.authorizationService.hasRole(this.hasRole);
		} else if (this.hasSomeRoles != null && this.hasSomeRoles.length > 0) {
			hasPermission = this.authorizationService.hasSomeRoles(this.hasSomeRoles);
		} else if (this.hasEveryRole != null && this.hasEveryRole.length > 0) {
			hasPermission = this.authorizationService.hasEveryRole(this.hasEveryRole);
		} else {
			hasPermission = this.authorizationService.isAuthenticated();
		}

		return hasPermission;
	}
}

function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
	const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
	if (!isTemplateRefOrNull) {
		throw new Error(
			`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`
		);
	}
}
