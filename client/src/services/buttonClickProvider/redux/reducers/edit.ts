import * as NS from '../../namespace';
import { initial } from '../initial';

function dataReducer(state: NS.IReduxState['data'] = initial.data, action: NS.Action): NS.IReduxState['data'] {
  switch (action.type) {
    case 'BUTTON_CLICK_PROVIDER:SET_SAVE_BUTTON_CLICK_EVENT': {
      return { ...state, saveButtonClicked: true };
    }
    case 'BUTTON_CLICK_PROVIDER:REMOVE_SAVE_BUTTON_CLICK_EVENT': {
      return { ...state, saveButtonClicked: false };
    }
    default: {
      return state;
    }
  }
}

export { dataReducer };
