import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalAction } from '../modal.model';
import { ModalComponent } from './modal.component';

describe('Modal Component', () => {
	let fixture: ComponentFixture<ModalComponent>;
	let comp: ModalComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule],
			declarations: [ModalComponent],
			providers: [{ provide: BsModalRef, useValue: {} }]
		});

		fixture = TestBed.createComponent(ModalComponent);
		comp = fixture.componentInstance;
	});

	it('should exist and be initialized', () => {
		expect(comp).toBeDefined();
	});

	describe('#ok', () => {
		it('should hide the modal and next an OK ModalAction if there are no inputs', () => {
			comp.modalRef = new BsModalRef();
			spyOn(comp.modalRef, 'hide').and.returnValue();
			spyOn(comp.onClose, 'next').and.returnValue();
			comp.ok();
			expect(comp.modalRef.hide).toHaveBeenCalledTimes(1);
			expect(comp.onClose.next).toHaveBeenCalledOnceWith({
				action: ModalAction.OK
			});
		});
		it('should hide the modal and next an OK ModalAction and form data to the onClose Subject if there are inputs', () => {
			comp.inputs = [{ type: 'text', label: 'Test', key: 'test', required: true }];
			comp.modalRef = new BsModalRef();
			spyOn(comp.modalRef, 'hide').and.returnValue();
			spyOn(comp.onClose, 'next').and.returnValue();
			comp.ok();
			expect(comp.modalRef.hide).toHaveBeenCalledTimes(1);
			expect(comp.onClose.next).toHaveBeenCalledOnceWith({
				action: ModalAction.OK,
				inputData: comp.formData
			});
		});
	});
});
