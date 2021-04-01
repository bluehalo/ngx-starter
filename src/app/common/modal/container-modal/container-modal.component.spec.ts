import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UntilDestroy } from '@ngneat/until-destroy';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AbstractModalizedDirective } from '../abstract-modalized.directive';
import { ContainerModalComponent } from './container-modal.component';

@UntilDestroy()
@Component({
	selector: 'ce-test-modalized-component',
	template: `
		<button></button><button></button>
	`
})
class ConcreteModalizedComponent extends AbstractModalizedDirective {
	onCancel() {}
	onOk() {}
}

describe('Container Modal Component', () => {
	let fixture: ComponentFixture<ContainerModalComponent>;
	let comp: ContainerModalComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [ContainerModalComponent],
			providers: [{ provide: BsModalRef, useValue: {} }]
		});

		fixture = TestBed.createComponent(ContainerModalComponent);
		comp = fixture.componentInstance;
		comp.modalizedComponent = ConcreteModalizedComponent;
		comp.modalizedComponentProperties = { testProperty: 'foo' };
		comp.modalRef = new BsModalRef();
		fixture.detectChanges();
	});

	it('should exist and be initialized', () => {
		expect(comp).toBeDefined();
	});

	describe('#ngAfterViewInit', () => {
		it('should define ok/cancel observables', () => {
			spyOn(comp.modalizedComponentContainer, 'clear').and.callThrough();
			spyOn(comp.modalizedComponentContainer, 'createComponent').and.callThrough();
			// tslint:disable-next-line:no-lifecycle-call
			comp.ngAfterViewInit();

			expect(comp.modalizedComponentContainer.clear).toHaveBeenCalledTimes(1);
			expect(comp.modalizedComponentContainer.createComponent).toHaveBeenCalledTimes(1);

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
