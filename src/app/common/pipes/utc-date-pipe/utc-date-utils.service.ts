import { DateTime } from 'luxon';

export class UtcDateUtils {
	private static defaultFormat = 'yyyy-MM-dd HH:mm:ss';

	static format(value: string | number | DateTime | null | undefined, format?: string): string {
		if (null != value) {
			let luxonDate;
			if (value instanceof DateTime) {
				luxonDate = value;
			} else {
				if (typeof value === 'string') {
					luxonDate = DateTime.fromISO(value).toUTC();
				}
				if (typeof value === 'number') {
					luxonDate = DateTime.fromMillis(value).toUTC();
				}
				if (!luxonDate.isValid) {
					// converts a string of milliseconds into a number
					value = +value;
					luxonDate = DateTime.fromMillis(value).toUTC();
				}
			}

			if (luxonDate.isValid) {
				return luxonDate.toFormat(null != format ? format : UtcDateUtils.defaultFormat);
			}
		}

		return '-';
	}
}
