import { DateTime } from 'luxon';

export class UtcDateUtils {
	private static defaultFormat = 'yyyy-MM-dd HH:mm:ss';

	static format(
		value: string | number | Date | DateTime | null | undefined,
		format?: string
	): string {
		if (value) {
			let luxonDate;
			if (value instanceof DateTime) {
				luxonDate = value;
			} else if (value instanceof Date) {
				luxonDate = DateTime.fromJSDate(value).toUTC();
			} else if (typeof value === 'number') {
				luxonDate = DateTime.fromMillis(value).toUTC();
			} else {
				luxonDate = DateTime.fromISO(value).toUTC();

				if (!luxonDate.isValid) {
					luxonDate = DateTime.fromFormat(value, 'D').toUTC();
				}
				if (!luxonDate.isValid) {
					luxonDate = DateTime.fromFormat(value, 'M-d-yyyy').toUTC();
				}
				if (!luxonDate.isValid) {
					// converts a string of milliseconds into a number
					value = +value;
					luxonDate = DateTime.fromMillis(value).toUTC();
				}
			}

			if (luxonDate?.isValid) {
				return luxonDate.toFormat(format || UtcDateUtils.defaultFormat);
			}
		}

		return '-';
	}
}
