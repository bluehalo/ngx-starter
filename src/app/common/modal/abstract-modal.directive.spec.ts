import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UntilDestroy } from '@ngneat/until-destroy';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DOMUtils } from '../dom-utils.service';
import { AbstractModalDirective } from './abstract-modal.directive';
import { ModalAction } from './modal.model';

@UntilDestroy()
@Component({
	selector: 'ce-test-modal-component',
	template: `
		<button></button>
		<button></button>
	`
})
class ConcreteModalComponent extends AbstractModalDirective {}

describe('Abstract Modal Directive', () => {
	let fixture: ComponentFixture<ConcreteModalComponent>;
	let comp: ConcreteModalComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [ConcreteModalComponent],
			providers: [{ provide: BsModalRef, useValue: {} }]
		});

		fixture = TestBed.createComponent(ConcreteModalComponent);
		comp = fixture.componentInstance;
	});

	it('should exist and be initialized', () => {
		fixture.detectChanges();
		expect(comp).toBeDefined();
	});

	describe('#ngAfterViewInit', () => {
		beforeEach(() => {
			spyOn(window, 'setTimeout').and.callThrough();
			spyOn(DOMUtils, 'trapFocus').and.callThrough();
			spyOn(DOMUtils, 'getFocusableElements').and.returnValue(
				document.querySelectorAll('button')
			);
		});

		it('should call DOMUtils.trapFocus', done => {
			fixture.detectChanges();
			expect(window.setTimeout).toHaveBeenCalledTimes(1);
			setTimeout(() => {
				expect(DOMUtils.trapFocus).toHaveBeenCalledTimes(1);
				expect(DOMUtils.getFocusableElements).toHaveBeenCalledTimes(1);
				done();
			}, 0);
		});

		it('should call DOMUtils.getFocusableElements an extra time if focusFirstElement is true', done => {
			comp.focusFirstElement = true;
			fixture.detectChanges();
			setTimeout(() => {
				expect(DOMUtils.getFocusableElements).toHaveBeenCalledTimes(2);
				done();
			}, 0);
		});
	});

	describe('#ok', () => {
		it('should hide the modal and next an OK ModalAction to the onClose Subject', () => {
			comp.modalRef = new BsModalRef();
			spyOn(comp.modalRef, 'hide').and.returnValue();
			spyOn(comp.onClose, 'next').and.returnValue();
			comp.ok();
			expect(comp.modalRef.hide).toHaveBeenCalledTimes(1);
			expect(comp.onClose.next).toHaveBeenCalledOnceWith({ action: ModalAction.OK });
		});
	});

	describe('#cancel', () => {
		it('should hide the modal and next a CANCEL ModalAction to the onClose Subject', () => {
			comp.modalRef = new BsModalRef();
			spyOn(comp.modalRef, 'hide').and.returnValue();
			spyOn(comp.onClose, 'next').and.returnValue();
			comp.cancel();
			expect(comp.modalRef.hide).toHaveBeenCalledTimes(1);
			expect(comp.onClose.next).toHaveBeenCalledOnceWith({ action: ModalAction.CANCEL });
		});
	});
});
