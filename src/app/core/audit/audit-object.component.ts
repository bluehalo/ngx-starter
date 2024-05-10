import { JsonPipe } from '@angular/common';
import { Component, ComponentRef, OnInit, ViewContainerRef, model, viewChild } from '@angular/core';

import { AuditObjectTypes } from './audit.classes';

@Component({
	selector: 'default',
	template: '<span>{{ auditObject() | json }}</span>',
	standalone: true,
	imports: [JsonPipe]
})
export class DefaultAuditObjectComponent {
	readonly auditObject = model<any>({});
}
AuditObjectTypes.registerType('default', DefaultAuditObjectComponent);

@Component({
	selector: 'url',
	template: '<span>{{ auditObject().url }}</span>',
	standalone: true
})
export class UrlAuditObjectComponent extends DefaultAuditObjectComponent {}
AuditObjectTypes.registerType('url', UrlAuditObjectComponent);

@Component({
	selector: 'user',
	template: '<span>{{ auditObject()?.username }}</span>',
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
		@if (auditObject()) {
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
	readonly content = viewChild.required('content', { read: ViewContainerRef });

	readonly auditObject = model<any>({});
	readonly auditType = model('');

	ngOnInit() {
		if (!AuditObjectTypes.objects.hasOwnProperty(this.auditType())) {
			this.auditType.set('default');
		}

		const componentRef = this.content().createComponent(
			AuditObjectTypes.objects[this.auditType()]
		) as ComponentRef<DefaultAuditObjectComponent>;
		if (componentRef) {
			componentRef.instance.auditObject.set(this.auditObject());
		}
	}
}
