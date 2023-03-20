import { IconProps } from 'consta-uikit-fork/Icon';

export interface IPaginationState {
  page: number;
  totalPages: number;
}

export type NotificationKind = 'system'
| 'success'
| 'warning'
| 'alert'
| 'normal';

export interface INotification {
  title?: string;
  text: string;
  icon?: React.FC<IconProps>;
  kind: NotificationKind;
  duration?: number;
  link?: string;
}

export interface ICursor {
  position: [number, number];
  visible: boolean;
  chart?: string;
  chartColor?: string;
  type?: 'main' | 'user' | 'userForTab';
}
