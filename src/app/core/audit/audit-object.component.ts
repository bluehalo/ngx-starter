import { JsonPipe } from '@angular/common';
import { Component, ComponentRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';

import { AuditObjectTypes } from './audit.classes';

@Component({
	selector: 'default',
	template: '<span>{{ auditObject | json }}</span>',
	standalone: true,
	imports: [JsonPipe]
})
export class DefaultAuditObjectComponent {
	@Input()
	auditObject: any = {};
}
AuditObjectTypes.registerType('default', DefaultAuditObjectComponent);

@Component({
	selector: 'url',
	template: '<span>{{ auditObject.url }}</span>',
	standalone: true
})
export class UrlAuditObjectComponent extends DefaultAuditObjectComponent {}
AuditObjectTypes.registerType('url', UrlAuditObjectComponent);

@Component({
	selector: 'user',
	template: '<span>{{ auditObject?.username }}</span>',
	standalone: true
})
export class UserAuditObjectComponent extends DefaultAuditObjectComponent {}
AuditObjectTypes.registerType('user', UserAuditObjectComponent);

@Component({
	selector: 'user-authentication',
	template: '',
	standalone: true
})
export class UserAuthenticationObjectComponent extends DefaultAuditObjectComponent {}
AuditObjectTypes.registerType('user-authentication', UserAuthenticationObjectComponent);

@Component({
	selector: 'export-audit',
	template: `
		@if (auditObject) {
			<span> <span class="fa-solid fa-download"></span> Export config </span>
		}
	`,
	standalone: true,
	imports: []
})
export class ExportAuditObjectComponent extends DefaultAuditObjectComponent {}
AuditObjectTypes.registerType('export', ExportAuditObjectComponent);

@Component({
	selector: 'asy-audit-component',
	template: '<div #content></div>',
	standalone: true
})
export class AuditObjectComponent implements OnInit {
	@ViewChild('content', { read: ViewContainerRef, static: true }) content?: ViewContainerRef;

	@Input()
	auditObject: any = {};

	@Input()
	auditType = '';

	ngOnInit() {
		if (!AuditObjectTypes.objects.hasOwnProperty(this.auditType)) {
			this.auditType = 'default';
		}

		const componentRef = this.content?.createComponent(
			AuditObjectTypes.objects[this.auditType]
		) as ComponentRef<DefaultAuditObjectComponent>;
		if (componentRef) {
			componentRef.instance.auditObject = this.auditObject;
		}
	}
}
