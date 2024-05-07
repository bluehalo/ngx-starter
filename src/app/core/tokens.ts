import { InjectionToken, Signal } from '@angular/core';

import { Session } from './auth';
import { Config } from './config.model';

export const APP_CONFIG = new InjectionToken<Signal<Config | null | undefined>>('APP_CONFIG');

export const APP_SESSION = new InjectionToken<Signal<Session>>('APP_SESSION');
