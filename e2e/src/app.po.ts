import { browser, by, element } from 'protractor';

export class AppPage {
	navigateTo() {
		return browser.get('/');
	}

	getAppContainer() {
		return element(by.css('.app-container'));
	}

	getHeaderText() {
		return this.getAppContainer().getText();
	}
}
