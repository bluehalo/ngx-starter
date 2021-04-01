import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UntilDestroy } from '@ngneat/until-destroy';
import { AbstractModalizedDirective } from './abstract-modalized.directive';

@UntilDestroy()
@Component({
	selector: 'ce-test-modalized-component',
	template: ``
})
class ConcreteModalizedComponent extends AbstractModalizedDirective {
	onCancel() {}
	onOk() {}
}

describe('Abstract Modalized Directive', () => {
	let fixture: ComponentFixture<ConcreteModalizedComponent>;
	let comp: ConcreteModalizedComponent;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			declarations: [ConcreteModalizedComponent],
			providers: []
		});

		fixture = TestBed.createComponent(ConcreteModalizedComponent);
		comp = fixture.componentInstance;
	});

	it('should exist and be initialized', () => {
		fixture.detectChanges();
		expect(comp).toBeDefined();
	});

	it('should call onOk when the okSubject is nexted', () => {
		spyOn(comp, 'onOk').and.callThrough();
		comp.okSubject.next();
		expect(comp.onOk).toHaveBeenCalledTimes(1);
	});

	it('should call onCancel when the okSubject is nexted', () => {
		spyOn(comp, 'onCancel').and.callThrough();
		comp.cancelSubject.next();
		expect(comp.onCancel).toHaveBeenCalledTimes(1);
	});
});
