import { A11yModule } from '@angular/cdk/a11y';
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { AbstractModalizableDirective } from '../abstract-modalizable.directive';
import { ModalComponent } from '../modal/modal.component';
import { ContainerModalComponent } from './container-modal.component';

@Component({
	selector: 'test-modalized-component',
	template: ` <button></button><button></button> `
})
class ConcreteModalizedComponent extends AbstractModalizableDirective {
	onCancel() {
		// do nothing
	}
	onOk() {
		// do nothing
	}
}

describe('Container Modal Component', () => {
	let fixture: ComponentFixture<ContainerModalComponent>;
	let comp: ContainerModalComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [A11yModule, ContainerModalComponent, ModalComponent],
			providers: [{ provide: BsModalRef, useValue: {} }]
		});

		fixture = TestBed.createComponent(ContainerModalComponent);
		comp = fixture.componentInstance;
		comp.modalizableComponent = ConcreteModalizedComponent;
		comp.modalizableComponentProperties = { testProperty: 'foo' };
		comp.modalRef = new BsModalRef();
		fixture.detectChanges();
	});

	it('should exist and be initialized', () => {
		expect(comp).toBeDefined();
	});

	describe('#ngAfterViewInit', () => {
		it('should define ok/cancel observables', () => {
			spyOn(comp.modalizableComponentContainer, 'clear').and.callThrough();
			spyOn(comp.modalizableComponentContainer, 'createComponent').and.callThrough();
			comp.ngAfterViewInit();

			expect(comp.modalizableComponentContainer.clear).toHaveBeenCalledTimes(1);
			// eslint-disable-next-line deprecation/deprecation
			expect(comp.modalizableComponentContainer.createComponent).toHaveBeenCalledTimes(1);

			expect(comp.okSubject).toBeDefined();
			expect(comp.cancelSubject).toBeDefined();
		});
	});

	describe('#ok', () => {
		it('should call next on the okSubject', () => {
			spyOn(comp.okSubject, 'next').and.callThrough();
			comp.ok();
			expect(comp.okSubject.next).toHaveBeenCalledTimes(1);
		});
	});

	describe('#cancel', () => {
		it('should call next on the cancelSubject', () => {
			spyOn(comp.cancelSubject, 'next').and.callThrough();
			comp.cancel();
			expect(comp.cancelSubject.next).toHaveBeenCalledTimes(1);
		});
	});
});
