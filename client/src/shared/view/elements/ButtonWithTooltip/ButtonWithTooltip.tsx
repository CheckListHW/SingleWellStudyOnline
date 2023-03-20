import { Button } from 'consta-uikit-fork/Button';
import { withTooltip } from 'consta-uikit-fork/withTooltip';

import './ButtonWithTooltip.scss';


export const ButtonWithTooltip = withTooltip({ content: '' })(Button);
