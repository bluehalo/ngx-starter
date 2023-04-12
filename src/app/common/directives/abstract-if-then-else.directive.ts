import {
	EmbeddedViewRef,
	TemplateRef,
	ViewContainerRef,
	inject,
	ɵstringify as stringify
} from '@angular/core';

export abstract class AbstractIfThenElseDirective {
	protected _andCondition = true;
	protected _orCondition = false;
	private _thenTemplateRef: TemplateRef<any> | null = inject(TemplateRef<any>);
	private _elseTemplateRef: TemplateRef<any> | null = null;
	private _thenViewRef: EmbeddedViewRef<any> | null = null;
	private _elseViewRef: EmbeddedViewRef<any> | null = null;
	private _viewContainer = inject(ViewContainerRef);

	protected setThenTemplate(property: string, templateRef: TemplateRef<any> | null) {
		assertTemplate(property, templateRef);
		this._thenTemplateRef = templateRef;
		this._thenViewRef = null; // clear previous view if any
		this._updateView();
	}

	protected setElseTemplate(property: string, templateRef: TemplateRef<any> | null) {
		assertTemplate(property, templateRef);
		this._elseTemplateRef = templateRef;
		this._elseViewRef = null; // clear previous view if any
		this._updateView();
	}

	protected _updateView() {
		if ((this.checkPermission() && this._andCondition) || this._orCondition) {
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

	protected abstract checkPermission(): boolean;
}

function assertTemplate(property: string, templateRef: TemplateRef<any> | null): void {
	const isTemplateRefOrNull = !!(!templateRef || templateRef.createEmbeddedView);
	if (!isTemplateRefOrNull) {
		throw new Error(
			`${property} must be a TemplateRef, but received '${stringify(templateRef)}'.`
		);
	}
}
