import * as NS from '../../namespace';

export function clearMessage(): NS.IClearMessage {
  return { type: 'PRIVATE_AREA:CLEAR_MESSAGE' };
}
