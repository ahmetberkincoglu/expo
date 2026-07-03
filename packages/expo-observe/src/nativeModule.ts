import { requireNativeModule } from 'expo';

import type { ObserveModule } from './types';

export default requireNativeModule<ObserveModule>('ExpoObserve');
