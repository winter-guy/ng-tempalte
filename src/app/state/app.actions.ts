import { createAction, props } from '@ngrx/store';
import { OilDataRecord } from '../types/records.type';

export const loadItems = createAction('[App] Load Items');
export const loadItemsSuccess = createAction('[App] Load Items Success', props<{ items: OilDataRecord[] }>());
export const loadItemsFailure = createAction('[App] Load Items Failure', props<{ error: any }>());
