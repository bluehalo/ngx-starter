import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UntilDestroy } from '@ngneat/until-destroy';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { AbstractModalDirective } from './abstract-modal.directive';
import { ModalAction } from './modal.model';

@UntilDestroy()
@Component({
	selector: 'test-modal-component',
	template: ``,
	standalone: true,
	imports: [A11yModule]
})
class ConcreteModalComponent extends AbstractModalDirective {}

describe('Abstract Modal Directive', () => {
	let fixture: ComponentFixture<ConcreteModalComponent>;
	let comp: ConcreteModalComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [A11yModule, ConcreteModalComponent],
			providers: [{ provide: BsModalRef, useValue: {} }]
		});

		fixture = TestBed.createComponent(ConcreteModalComponent);
		comp = fixture.componentInstance;
	});

	it('should exist and be initialized', () => {
		fixture.detectChanges();
		expect(comp).toBeDefined();
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
