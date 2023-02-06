import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

/**
 * Used to mark where in a page the "Skip to main content" link
 * should skip to. It is ideally placed on the page's main heading:
 * the h1 element. This directive should only be used once per page
 */
@Directive({
	selector: '[linkAccessibility]'
})
export class LinkAccessibilityDirective {
	constructor(private elRef: ElementRef, private renderer: Renderer2) {
		const el = elRef.nativeElement;
		renderer.setAttribute(el, 'tabIndex', '0');
	}

	@HostListener('keydown.enter', ['$event'])
	onEnter(event: Event) {
		let targetEl = event.target;
		targetEl?.dispatchEvent(new Event('click'));
	}
}
