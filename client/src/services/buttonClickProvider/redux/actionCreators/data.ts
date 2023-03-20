import * as NS from '../../namespace';

export function setSaveButtonClickEvent(): NS.ISetSaveButtonClickEvent {
  return { type: 'BUTTON_CLICK_PROVIDER:SET_SAVE_BUTTON_CLICK_EVENT' };
}

export function removeSaveButtonClickEvent(): NS.IRemoveSaveButtonClickEvent {
  return { type: 'BUTTON_CLICK_PROVIDER:REMOVE_SAVE_BUTTON_CLICK_EVENT' };
}
