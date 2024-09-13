import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

/**
 * Used to enable link for keyboard accessibility.
 * This is only necessary for interactibles using that do not have a
 * href attribute, because those will naturally be ignored by
 * the tabbing structure.
 */
@Directive({
	selector: '[linkAccessibility]',
	standalone: true,
	host: {
		'(keydown.enter)': 'onEnter($event)'
	}
})
export class LinkAccessibilityDirective {
	private elRef = inject(ElementRef);
	private renderer = inject(Renderer2);

	constructor() {
		const el = this.elRef.nativeElement;
		this.renderer.setAttribute(el, 'tabIndex', '0');
	}

	onEnter(event: Event) {
		event.target?.dispatchEvent(new Event('click'));
	}
}
