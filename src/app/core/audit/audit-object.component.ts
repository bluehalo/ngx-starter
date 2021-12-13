import {
	Component,
	ComponentFactory,
	ComponentFactoryResolver,
	ComponentRef,
	Input,
	OnInit,
	ViewChild,
	ViewContainerRef
} from '@angular/core';

import { AuditObjectTypes } from './audit.classes';

@Component({
	selector: 'default',
	template: '<span>{{ auditObject | json }}</span>'
})
export class DefaultAuditObjectComponent {
	@Input() auditObject: any = {};
}
AuditObjectTypes.registerType('default', DefaultAuditObjectComponent);

@Component({
	selector: 'url',
	template: '<span>{{ auditObject.url }}</span>'
})
export class UrlAuditObjectComponent extends DefaultAuditObjectComponent {}
AuditObjectTypes.registerType('url', UrlAuditObjectComponent);

@Component({
	selector: 'user',
	template: '<span>{{ auditObject?.username }}</span>'
})
export class UserAuditObjectComponent extends DefaultAuditObjectComponent {}
AuditObjectTypes.registerType('user', UserAuditObjectComponent);

@Component({
	selector: 'user-authentication',
	template: ''
})
export class UserAuthenticationObjectComponent extends DefaultAuditObjectComponent {}
AuditObjectTypes.registerType('user-authentication', UserAuthenticationObjectComponent);

@Component({
	selector: 'export-audit',
	template: `
		<span *ngIf="auditObject"> <span class="fa fa-download"></span> Export config </span>
	`
})
export class ExportAuditObjectComponent extends DefaultAuditObjectComponent {}
AuditObjectTypes.registerType('export', ExportAuditObjectComponent);

@Component({
	selector: 'asy-audit-component',
	template: '<div #content></div>'
})
export class AuditObjectComponent implements OnInit {
	@ViewChild('content', { read: ViewContainerRef, static: true }) content?: ViewContainerRef;

	@Input() auditObject: any = {};
	@Input() auditType = '';

	constructor(private componentFactoryResolver: ComponentFactoryResolver) {}

	ngOnInit() {
		if (!AuditObjectTypes.objects.hasOwnProperty(this.auditType)) {
			this.auditType = 'default';
		}

		const factory: ComponentFactory<Component> = this.componentFactoryResolver.resolveComponentFactory(
			AuditObjectTypes.objects[this.auditType]
		);

		const componentRef = this.content?.createComponent(factory) as ComponentRef<
			DefaultAuditObjectComponent
		>;
		if (componentRef) {
			componentRef.instance.auditObject = this.auditObject;
		}
	}
}
