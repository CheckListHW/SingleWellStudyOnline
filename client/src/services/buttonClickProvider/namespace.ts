import { IPlainAction } from 'shared/types/redux';

export interface IReduxState {
  data: {
    saveButtonClicked: boolean;
  };
}

export type ISetSaveButtonClickEvent = IPlainAction<'BUTTON_CLICK_PROVIDER:SET_SAVE_BUTTON_CLICK_EVENT'>;
export type IRemoveSaveButtonClickEvent = IPlainAction<'BUTTON_CLICK_PROVIDER:REMOVE_SAVE_BUTTON_CLICK_EVENT'>;

export type Action = ISetSaveButtonClickEvent | IRemoveSaveButtonClickEvent;
