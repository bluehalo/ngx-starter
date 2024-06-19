import { InjectionToken } from '@angular/core';

import { Topic } from '../../common';

export const ADMIN_TOPICS = new InjectionToken<Topic[][]>('ADMIN_TOPIC');
