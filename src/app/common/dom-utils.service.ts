export class DOMUtils {
	/**
	 * Get a list of the focusable HTMLElements within a specified part of a document
	 * @param document - the document to get focusable elements from
	 * @param querySelector - selects the part of the document to get focusable elements from
	 * @param focusableElementsSelector - selects the focusable elements
	 */
	public static getFocusableElements(
		document: Document,
		querySelector: string,
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
}
