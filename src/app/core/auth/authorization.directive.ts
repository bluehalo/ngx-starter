import {
	Directive,
	Input,
	TemplateRef,
	ViewContainerRef,
	ElementRef,
	OnInit,
	SimpleChanges, OnChanges
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

	private isHidden = true;

	constructor(
		private element: ElementRef,
		private templateRef: TemplateRef<any>,
		private viewContainer: ViewContainerRef,
		private sessionService: SessionService,
		private authorizationService: AuthorizationService
	) {
	}

	ngOnInit() {
		this.sessionService.getSession().subscribe(() => {
			this.updateView();
		});
	}

	ngOnChanges(changes: SimpleChanges): void {
		const hasRoleChanges = changes['hasRole'];
		const hasEveryRoleChanges = changes['hasEveryRole'];
		const hasSomeRolesChanges = changes['hasSomeRoles'];

		if (hasRoleChanges || hasEveryRoleChanges || hasSomeRolesChanges) {
			// Due to bug when you pass empty array
			if ((hasRoleChanges && hasRoleChanges.firstChange)
				|| (hasEveryRoleChanges && hasEveryRoleChanges.firstChange)
				|| (hasSomeRolesChanges && hasSomeRolesChanges.firstChange)) {
				return;
			}

			this.updateView();
		}
	}

	private updateView() {
		if (this.checkPermission()) {
			if (this.isHidden) {
				this.viewContainer.createEmbeddedView(this.templateRef);
				this.isHidden = false;
			}
		} else {
			this.isHidden = true;
			this.viewContainer.clear();
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
