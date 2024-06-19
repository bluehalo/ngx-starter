import { Directive, ElementRef, Renderer2, inject } from '@angular/core';

/**
 * Used to mark where in a page the "Skip to main content" link
 * should skip to. It is ideally placed on the page's main heading:
 * the h1 element. This directive should only be used once per page
 */
@Directive({
	selector: '[skipTo]',
	standalone: true
})
export class SkipToDirective {
	private elRef = inject(ElementRef);
	private renderer = inject(Renderer2);

	constructor() {
		const el = this.elRef.nativeElement;
		this.renderer.addClass(el, 'skip-to');
		this.renderer.setAttribute(el, 'tabindex', '-1');
	}
}
