import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

/**
 * Used to enable link for keyboard accessibility.
 * This is only necessary for interactibles using that do not have a
 * href attribute, because those will naturally be ignored by
 * the tabbing structure.
 */
@Directive({
	selector: '[linkAccessibility]',
	standalone: true
})
export class LinkAccessibilityDirective {
	constructor(
		private elRef: ElementRef,
		private renderer: Renderer2
	) {
		const el = elRef.nativeElement;
		renderer.setAttribute(el, 'tabIndex', '0');
	}

	@HostListener('keydown.enter', ['$event'])
	onEnter(event: Event) {
		event.target?.dispatchEvent(new Event('click'));
	}
}
