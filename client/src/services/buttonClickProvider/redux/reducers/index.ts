import { combineReducers } from 'redux';

import { dataReducer } from './edit';
import * as NS from '../../namespace';

export const reducer = combineReducers<NS.IReduxState>({
  data: dataReducer,
});

export { dataReducer };
