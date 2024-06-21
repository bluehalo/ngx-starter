import { ElementRef } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { SearchInputComponent } from './search-input.component';

describe('SearchInputComponent', () => {
	let fixture: ComponentFixture<SearchInputComponent>;
	let componentInstance: SearchInputComponent;
	let inputElement: ElementRef<HTMLInputElement>;

	beforeEach(() => {
		fixture = TestBed.configureTestingModule({
			imports: [FormsModule, NoopAnimationsModule, SearchInputComponent]
		}).createComponent(SearchInputComponent);

		componentInstance = fixture.componentInstance;

		// replace the emit function of applySearch with a spy
		componentInstance.applySearch.emit = jasmine.createSpy();
		inputElement = fixture.debugElement.query(By.css('input'));

		fixture.detectChanges();
	});

	it('should apply search on `keyup` event by default', fakeAsync(() => {
		inputElement.nativeElement.value = 'search value';
		fixture.detectChanges();
		// need to trigger input event here so ngModel will set `search` property correctly
		// this line by itself will not trigger a search
		inputElement.nativeElement.dispatchEvent(new Event('input'));

		// this line should trigger a search
		inputElement.nativeElement.dispatchEvent(new Event('keyup'));
		tick(350);

		expect(componentInstance.applySearch.emit).toHaveBeenCalledTimes(1);
		expect(componentInstance.applySearch.emit).toHaveBeenCalledWith('search value');
	}));

	it('should not apply the search if keyup is never triggered', fakeAsync(() => {
		fixture.componentRef.setInput('preferInputEvent', false);
		inputElement.nativeElement.value = 'search value';
		fixture.detectChanges();
		// need to trigger input event here so ngModel will set `search` property correctly
		// this line by itself will not trigger a search
		inputElement.nativeElement.dispatchEvent(new Event('input'));

		tick(350);

		expect(componentInstance.applySearch.emit).toHaveBeenCalledTimes(0);
	}));

	it('should apply search if preferInputEvent is true and an input event is triggered', fakeAsync(() => {
		fixture.componentRef.setInput('preferInputEvent', true);
		inputElement.nativeElement.value = 'search value';
		fixture.detectChanges();

		inputElement.nativeElement.dispatchEvent(new Event('input'));

		tick(350);

		expect(componentInstance.applySearch.emit).toHaveBeenCalledTimes(1);
		expect(componentInstance.applySearch.emit).toHaveBeenCalledWith('search value');
	}));

	it('should not apply search if minSearchCharacterCount is specified not adhered to', fakeAsync(() => {
		fixture.componentRef.setInput('minSearchCharacterCount', 3);
		inputElement.nativeElement.value = 'se';
		fixture.detectChanges();

		inputElement.nativeElement.dispatchEvent(new Event('input'));
		inputElement.nativeElement.dispatchEvent(new Event('keyup'));

		tick(350);

		expect(componentInstance.applySearch.emit).not.toHaveBeenCalled();
	}));

	it('should show warning message if minSearchCharacterCount is specified and not adhered to', fakeAsync(() => {
		fixture.componentRef.setInput('minSearchCharacterCount', 3);
		inputElement.nativeElement.value = 'se';
		fixture.detectChanges();

		inputElement.nativeElement.dispatchEvent(new Event('input'));
		inputElement.nativeElement.dispatchEvent(new Event('keyup'));

		tick(350);

		fixture.detectChanges();

		expect(
			(
				fixture.debugElement.query(By.css('.text-body-secondary'))
					.nativeElement as HTMLElement
			).textContent?.trim()
		).toEqual('Searches require a minimum of 3 characters.');
	}));

	it('should not show warning message if minSearchCharacterCount is specified and adhered to', fakeAsync(() => {
		fixture.componentRef.setInput('minSearchCharacterCount', 3);
		inputElement.nativeElement.value = 'sea';
		fixture.detectChanges();

		inputElement.nativeElement.dispatchEvent(new Event('input'));
		inputElement.nativeElement.dispatchEvent(new Event('keyup'));

		tick(350);

		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.text-body-secondary'))).toBeNull();
	}));

	it('should not show warning message if disableMinCountMessage is set when minSearchCharacterCount is adhered to', fakeAsync(() => {
		fixture.componentRef.setInput('minSearchCharacterCount', 3);
		fixture.componentRef.setInput('disableMinCountMessage', true);
		inputElement.nativeElement.value = 'sea';
		fixture.detectChanges();

		inputElement.nativeElement.dispatchEvent(new Event('input'));
		inputElement.nativeElement.dispatchEvent(new Event('keyup'));

		tick(350);

		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.text-body-secondary'))).toBeNull();
	}));

	it('should not show warning message if disableMinCountMessage is set when minSearchCharacterCount is not adhered to', fakeAsync(() => {
		fixture.componentRef.setInput('minSearchCharacterCount', 3);
		fixture.componentRef.setInput('disableMinCountMessage', true);
		inputElement.nativeElement.value = 'se';
		fixture.detectChanges();

		inputElement.nativeElement.dispatchEvent(new Event('input'));
		inputElement.nativeElement.dispatchEvent(new Event('keyup'));

		tick(350);

		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('.text-body-secondary'))).toBeNull();
	}));

	it('should show clear-search options if search input length > 0', () => {
		inputElement.nativeElement.value = 'search';
		inputElement.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		expect(fixture.debugElement.queryAll(By.css('.icon.fa-times')).length).toBe(1);
	});

	it('should not show clear-search options if search input length === 0', () => {
		inputElement.nativeElement.value = '';
		inputElement.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		expect(fixture.debugElement.queryAll(By.css('span.icon.fa-times')).length).toBe(0);
	});

	it('should clear the search when the clearSearch span is clicked', waitForAsync(() => {
		const clearSearchSpy = spyOn(componentInstance, 'clearSearch').and.callThrough();

		inputElement.nativeElement.value = 'search';
		inputElement.nativeElement.dispatchEvent(new Event('input'));
		fixture.detectChanges();

		// click the clear-search option
		(
			fixture.debugElement.query(By.css('span.icon.fa-times')).nativeElement as HTMLElement
		).click();

		fixture.detectChanges();

		expect(clearSearchSpy).toHaveBeenCalledTimes(1);
		expect(componentInstance.search()).toBe('');
		expect(componentInstance.applySearch.emit).toHaveBeenCalledTimes(1);
		expect(componentInstance.applySearch.emit).toHaveBeenCalledWith('');

		fixture.whenRenderingDone().then(() => {
			expect(
				(fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement)
					.value
			).toBe('');
		});
	}));
});
