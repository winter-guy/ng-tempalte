import { createReducer, on } from '@ngrx/store';
import { loadItems, loadItemsSuccess, loadItemsFailure } from './app.actions';
import { OilDataRecord } from '../types/records.type';

export interface AppState {
  items: OilDataRecord[];
  loading: boolean;
  error: any;
}

export const initialState: AppState = {
  items: [],
  loading: false,
  error: null,
};

export const appReducer = createReducer(
  initialState,
  on(loadItems, (state) => ({ ...state, loading: true, error: null })),
  on(loadItemsSuccess, (state, { items }) => ({
    ...state,
    items,
    loading: false,
    error: null,
  })),
  on(loadItemsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
