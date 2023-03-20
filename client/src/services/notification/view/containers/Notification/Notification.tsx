import React from 'react';
import { connect } from 'react-redux';
import block from 'bem-cn';
import { SnackBar, Item } from 'consta-uikit-fork/SnackBar';

import { IAppReduxState } from 'shared/types/app';
import { INotification } from 'shared/types/common';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import { selectors, actionCreators } from '../../../redux';
import './Notification.scss';

interface IStateProps {
  notification: INotification | null;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    notification: selectors.selectNotification(state),
  };
}

const mapDispatch = {
  removeNotification: actionCreators.removeNotification,
};

type ActionProps = typeof mapDispatch;
type IProps = IStateProps & ActionProps & ITranslationProps;

const b = block('notification');
const { notification: intl } = tKeys;

function NotificationComponent(props: IProps) {
  const { notification, t } = props;
  const onSnackBarCloseButtonClick = (): void => {
    props.removeNotification();
  };
  const item: Item[] = [{
    key: '001',
    message: notification ? notification.text : '',
    status: notification ? notification.kind : 'normal',
    icon: notification ? notification.icon : undefined,
    onClose: onSnackBarCloseButtonClick,
  }];


  return notification && (
    <div className={b()}>
      {notification.link && (
        <SnackBar items={[{
          ...item[0],
          actions: [{
            label: t(intl.goToLink) as string,
            onClick: () => {
              if (notification.link) {
                document.location.href = notification.link;
              }
            },
          }],
        }]}
        />
      )}
      {!notification.link && (
        <SnackBar items={item} />
      )}
    </div>
  );
}

const connectedComponent = connect(mapState, mapDispatch)(NotificationComponent);
const Notification = withTranslation()(connectedComponent);

export { Notification, NotificationComponent, IProps as INotificationProps };
