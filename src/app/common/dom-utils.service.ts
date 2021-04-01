export class DOMUtils {
	/**
	 * Get a list of the focusable HTMLElements within a specified part of a document
	 * @param document - the document to get focusable elements from
	 * @param querySelector - selects the part of the document to get focusable elements from
	 * @param focusableElementsSelector - selects the focusable elements
	 */
	public static getFocusableElements(
		document: Document,
		querySelector: string = '*',
		focusableElementsSelector: string = [
			'button',
			'[href]',
			'input',
			'select',
			'textarea',
			'[tabindex]:not([tabindex="-1"])'
		].join(', ')
	): NodeListOf<HTMLElement> {
		const rootElement = document.querySelector(querySelector);
		return (rootElement
			? rootElement.querySelectorAll(focusableElementsSelector)
			: []) as NodeListOf<HTMLElement>;
	}

	/**
	 * Trap focus within the selected part of the document
	 * @param document - the document to trap focus in
	 * @param querySelector - selects the part of the document to trap focus in
	 */
	public static trapFocus(document: Document, querySelector: string) {
		// Select all focusable elements in the modal
		const focusableElements = this.getFocusableElements(document, querySelector);

		// Get the first and last focusable element in the modal
		const firstFocusableElement = focusableElements[0];
		const lastFocusableElement = focusableElements[focusableElements.length - 1];

		// Add event listeners for Tab and Escape keys
		document.addEventListener('keydown', event => {
			// If the user is tabbing through focusable elements and reaches an end of the list, jump to the other end
			if (event.key === 'Tab') {
				if (event.shiftKey) {
					if (document.activeElement === firstFocusableElement) {
						lastFocusableElement.focus();
						event.preventDefault();
					}
				} else {
					if (document.activeElement === lastFocusableElement) {
						firstFocusableElement.focus();
						event.preventDefault();
					}
				}
			}
		});
	}
}
