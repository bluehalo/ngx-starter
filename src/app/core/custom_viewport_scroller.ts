import { DOCUMENT, ViewportScroller } from '@angular/common';
import { InjectionToken, inject } from '@angular/core';

import { WINDOW } from '@ng-web-apis/common';

export const SCROLL_ELEMENT = new InjectionToken<string>('SCROLL_ELEMENT', {
	providedIn: 'root',
	factory: () => 'app-content'
});

/**
 * Modified version of BrowserViewportScroller from @angular/common
 * Manages the scroll position for scrollElement.
 */
export class CustomViewportScroller implements ViewportScroller {
	private offset: () => [number, number] = () => [0, 0];

	private scrollElementID = inject(SCROLL_ELEMENT);
	private document = inject(DOCUMENT);
	private window = inject(WINDOW);

	/**
	 * Configures the top offset used when scrolling to an anchor.
	 * @param offset A position in screen coordinates (a tuple with x and y values)
	 * or a function that returns the top offset position.
	 *
	 */
	setOffset(offset: [number, number] | (() => [number, number])): void {
		if (Array.isArray(offset)) {
			this.offset = () => offset;
		} else {
			this.offset = offset;
		}
	}

	/**
	 * Retrieves the current scroll position.
	 * @returns The position in screen coordinates.
	 */
	getScrollPosition(): [number, number] {
		const scrollEl = this.getScrollElement();
		if (scrollEl && this.supportsScrolling()) {
			return [scrollEl.scrollLeft, scrollEl.scrollTop];
		} else {
			return [0, 0];
		}
	}

	/**
	 * Sets the scroll position.
	 * @param position The new position in screen coordinates.
	 */
	scrollToPosition(position: [number, number]): void {
		const scrollEl = this.getScrollElement();
		if (scrollEl && this.supportsScrolling()) {
			scrollEl.scrollTo(position[0], position[1]);
		}
	}

	/**
	 * Scrolls to an element and attempts to focus the element.
	 *
	 * Note that the function name here is misleading in that the target string may be an ID for a
	 * non-anchor element.
	 *
	 * @param target The ID of an element or name of the anchor.
	 *
	 * @see https://html.spec.whatwg.org/#the-indicated-part-of-the-document
	 * @see https://html.spec.whatwg.org/#scroll-to-fragid
	 */
	scrollToAnchor(target: string): void {
		if (this.getScrollElement() && !this.supportsScrolling()) {
			return;
		}

		const elSelected = findAnchorFromDocument(this.document, target);

		if (elSelected) {
			this.scrollToElement(elSelected);
			// After scrolling to the element, the spec dictates that we follow the focus steps for the
			// target. Rather than following the robust steps, simply attempt focus.
			//
			// @see https://html.spec.whatwg.org/#get-the-focusable-area
			// @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLOrForeignElement/focus
			// @see https://html.spec.whatwg.org/#focusable-area
			elSelected.focus();
		}
	}

	/**
	 * Disables automatic scroll restoration provided by the browser.
	 */
	setHistoryScrollRestoration(scrollRestoration: 'auto' | 'manual'): void {
		if (this.getScrollElement() && this.supportsScrolling()) {
			this.window.history.scrollRestoration = scrollRestoration;
		}
	}

	/**
	 * Scrolls to an element using the native offset and the specified offset set on this scroller.
	 *
	 * The offset can be used when we know that there is a floating header and scrolling naively to an
	 * element (ex: `scrollIntoView`) leaves the element hidden behind the floating header.
	 */
	private scrollToElement(el: HTMLElement): void {
		const scrollEl = this.getScrollElement();
		if (scrollEl) {
			const rect = el.getBoundingClientRect();
			const left = rect.left + this.window.scrollX;
			const top = rect.top + this.window.scrollY;
			const offset = this.offset();
			scrollEl.scrollTo(left - offset[0], top - offset[1]);
		}
	}

	private supportsScrolling(): boolean {
		try {
			return !!this.window && !!this.window.scrollTo && 'pageXOffset' in this.window;
		} catch {
			return false;
		}
	}

	private getScrollElement(): Element | null {
		return this.document.querySelector(`#${this.scrollElementID}`);
	}
}

function findAnchorFromDocument(document: Document, target: string): HTMLElement | null {
	const documentResult = document.getElementById(target) || document.getElementsByName(target)[0];

	if (documentResult) {
		return documentResult;
	}

	// `getElementById` and `getElementsByName` won't pierce through the shadow DOM so we
	// have to traverse the DOM manually and do the lookup through the shadow roots.
	if (
		typeof document.createTreeWalker === 'function' &&
		document.body &&
		typeof document.body.attachShadow === 'function'
	) {
		const treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_ELEMENT);
		let currentNode = treeWalker.currentNode as HTMLElement | null;

		while (currentNode) {
			const shadowRoot = currentNode.shadowRoot;

			if (shadowRoot) {
				// Note that `ShadowRoot` doesn't support `getElementsByName`
				// so we have to fall back to `querySelector`.
				const result =
					shadowRoot.getElementById(target) ||
					shadowRoot.querySelector(`[name="${target}"]`);
				if (result) {
					return result;
				}
			}

			currentNode = treeWalker.nextNode() as HTMLElement | null;
		}
	}

	return null;
}
