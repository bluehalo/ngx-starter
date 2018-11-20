import { StringUtils } from './string-utils.service';

describe('StringUtils', () => {

	describe('isNonEmptyString', () => {
		it('returns true if input is non-empty string', () => {
			expect(StringUtils.isNonEmptyString('test-string')).toBe(true);
		});

		it('returns false if input is empty string', () => {
			expect(StringUtils.isNonEmptyString('')).toBe(false);
		});

		it ('returns false if input is not a string', () => {
			expect(StringUtils.isNonEmptyString({})).toBe(false);
		});
	});

	describe('isInvalid', () => {
		it('returns false if input is non-empty string', () => {
			expect(StringUtils.isInvalid('test-string')).toBe(false);
		});

		it('returns true if input is empty string', () => {
			expect(StringUtils.isInvalid('')).toBe(true);
		});

		it ('returns true if input is not a string', () => {
			expect(StringUtils.isInvalid({})).toBe(true);
		});
	});

	describe('toTitleCase', () => {
		it('returns null if input undefined', () => {
			expect(StringUtils.toTitleCase(undefined)).toBe(null);
		});

		it('returns null if input null', () => {
			expect(StringUtils.toTitleCase(null)).toBe(null);
		});

		it('returns empty string if input is empty', () => {
			expect(StringUtils.toTitleCase('')).toBe('');
		});

		it('returns Capitalized string if input is single character', () => {
			expect(StringUtils.toTitleCase('a')).toBe('A');
		});

		it('returns Capitalized single word if lower case', () => {
			expect(StringUtils.toTitleCase('test')).toBe('Test');
		});

		it('returns Capitalized single word if upper case', () => {
			expect(StringUtils.toTitleCase('TEST')).toBe('Test');
		});

		it('returns Capitalized single word if mixed case', () => {
			expect(StringUtils.toTitleCase('TEST TEsTeR testIng')).toBe('Test Tester Testing');
		});

		it('returns Capitalized 2 words', () => {
			expect(StringUtils.toTitleCase('test string')).toBe('Test String');
		});

		it('returns Capitalized on hyphenated word', () => {
			expect(StringUtils.toTitleCase('test-string')).toBe('Test-string');
		});

		it('returns Capitalized on hyphenated word sentence', () => {
			expect(StringUtils.toTitleCase('hello, test-strings are cool!')).toBe('Hello, Test-strings Are Cool!');
		});

		it('returns Capitalized on hyphenated word multiple sentences', () => {
			expect(StringUtils.toTitleCase('hello, test-strings are cool!  I really like how they are capitalized....a lot.')).toBe('Hello, Test-strings Are Cool!  I Really Like How They Are Capitalized....a Lot.');
		});
	});

});
