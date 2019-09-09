import {
	Component, Input, ViewChild, ViewContainerRef, ComponentRef, ComponentFactoryResolver,
	ComponentFactory
} from '@angular/core';
import { AuditObjectTypes } from './audit.classes';

export let auditObjects: any[] = [];

@Component({
	selector: 'default',
	templateUrl: './default-audit.component.html'
})
export class DefaultAudit {
	@Input() auditObject: any = {};
}
auditObjects.push(DefaultAudit);
AuditObjectTypes.registerType('default', DefaultAudit);

@Component({
	selector: 'url',
	templateUrl: './url-audit.component.html'
})
export class UrlAudit extends DefaultAudit {}
auditObjects.push(UrlAudit);
AuditObjectTypes.registerType('url', UrlAudit);

@Component({
	selector: 'user',
	templateUrl: './user-audit.component.html'
})
export class UserAudit extends DefaultAudit {}
auditObjects.push(UserAudit);
AuditObjectTypes.registerType('user', UserAudit);

@Component({
	selector: 'user-authentication',
	template: ''
})
export class UserAuthentication extends DefaultAudit {}
auditObjects.push(UserAuthentication);
AuditObjectTypes.registerType('user-authentication', UserAuthentication);

@Component({
	selector: 'export-audit',
	template: `
			<span *ngIf='auditObject'>
				<i class='fa fa-download'></i> Export config
			</span>
			`
})
export class ExportAudit extends DefaultAudit {}
auditObjects.push(ExportAudit);
AuditObjectTypes.registerType('export', ExportAudit);

@Component({
	selector: 'asy-audit-component',
	template: '<div #content></div>'
})
export class AuditObjectComponent {
	@ViewChild('content', { read: ViewContainerRef, static: true }) content: any;

	@Input() auditObject: any = {};
	@Input() auditType: string = '';

	private componentRef: ComponentRef<any>;

	constructor(
		private componentFactoryResolver: ComponentFactoryResolver
	) {}

	ngOnInit() {
		if (!AuditObjectTypes.objects.hasOwnProperty(this.auditType)) {
			this.auditType = 'default';
		}

		let factory: ComponentFactory<Component> =
			this.componentFactoryResolver.resolveComponentFactory(AuditObjectTypes.objects[this.auditType]);

		this.componentRef = this.content.createComponent(factory);
		this.componentRef.instance.auditObject = this.auditObject;
	}
}
