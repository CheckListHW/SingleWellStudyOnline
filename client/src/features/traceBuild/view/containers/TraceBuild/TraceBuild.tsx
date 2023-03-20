/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/no-did-update-set-state */

import React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { Redirect } from 'react-router-dom';
import { Badge } from 'consta-uikit-fork/Badge';
import { Button } from 'consta-uikit-fork/Button';
import { IconCheck } from 'consta-uikit-fork/IconCheck';
import { IconClose } from 'consta-uikit-fork/IconClose';
import { IconTrash } from 'consta-uikit-fork/IconTrash';
import { IconBag } from 'consta-uikit-fork/IconBag';

import { routes } from 'modules/routes';
import { IAppReduxState } from 'shared/types/app';
import { MainHeaderBar } from 'shared/view/components';
import { TRACE_ITEMS, TABS_TRANSLATIONS_KEYS } from 'shared/constants';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { actionCreators as notificationActions } from 'services/notification';
import { ITraceItem } from 'shared/types/models';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import './TraceBuild.scss';


interface IOwnProps {
  onRedirectHandler(to: string): void;
}

interface IStateProps {
  userServerMessage: string;
  userMessageStatus: number;
  userToken: string;
  userEmail: string;
  userName: string;
  userSurname: string;
  userSpeciality: string;
  userCourse: string;
  userExperience: number;
  userTraceData: ITraceItem[];
}

type ActionProps = typeof mapDispatch;

type Props = IStateProps & ActionProps & IOwnProps & ITranslationProps;

interface IState {
  elementsForChoice: ITraceItem[];
  selectedElements: ITraceItem[];
  currentDragElement: ITraceItem & { prevPositionIndex: number; };
  currentElementPositions: [number, number];
  isMovingElementVisible: boolean;
}

function mapState(state: IAppReduxState): IStateProps {
  return {
    userServerMessage: userSelectors.selectUserServerMessage(state),
    userMessageStatus: userSelectors.selectUserMessageStatus(state),
    userToken: userSelectors.selectUserToken(state),
    userEmail: userSelectors.selectUserEmail(state),
    userName: userSelectors.selectUserName(state),
    userSurname: userSelectors.selectUserSurname(state),
    userSpeciality: userSelectors.selectUserSpeciality(state),
    userCourse: userSelectors.selectUserCourse(state),
    userExperience: userSelectors.selectUserExperience(state),
    userTraceData: userSelectors.selectUserTraceData(state),
  };
}

const mapDispatch = {
  getTraceDataFromServer: userActions.getTraceData,
  saveTraceDataOnServer: userActions.saveTraceData,
  saveAppPositionOnServer: userActions.saveAppPosition,
  deleteUserDataForApp: userActions.deleteUserData,
  clearSessionStorage: userActions.clearLocalStorage,
  getAndSaveScreenshot: userActions.getAndSaveScreenshot,
  saveRouteTimePoint: userActions.saveRouteTimePoint,

  setNotification: notificationActions.setNotification,
};

const b = block('trace-build');
const { traceBuild: intl } = tKeys.features;
const { shared: sharedIntl, tabs: tabsIntl, warningMessages: warnIntl } = tKeys;

type Key = keyof typeof tabsIntl;

class TraceBuildComponent extends React.Component<Props, IState> {
  private contentRef: React.RefObject<HTMLDivElement> = React.createRef();
  private initialElementsForChoice = shuffle(TRACE_ITEMS.map(item => {
    const key = TABS_TRANSLATIONS_KEYS[item.id];
    return { id: item.id, text: this.props.t(tabsIntl[key as Key].text) };
  }));

  private initialSelectedElements = TRACE_ITEMS.map(item => ({ id: item.id, text: '' }));

  public state = this.getInitialState();

  private getInitialState(): IState {
    const { userTraceData } = this.props;
    const isUserTraceDataEmpty = userTraceData.every(item => item.text === '');

    return {
      currentDragElement: { id: -1, text: '', prevPositionIndex: -1 },
      elementsForChoice: isUserTraceDataEmpty
        ? this.initialElementsForChoice
        : this.initialSelectedElements,
      selectedElements: isUserTraceDataEmpty ? this.initialSelectedElements : userTraceData,
      currentElementPositions: [0, 0] as [number, number],
      isMovingElementVisible: false,
    };
  }

  public componentDidUpdate(prevProps: Props) {
    const { userServerMessage, userMessageStatus, setNotification, userTraceData } = this.props;
    if (userServerMessage !== '' && prevProps.userServerMessage !== userServerMessage) {
      setNotification({
        text: userServerMessage,
        kind: userMessageStatus === 200 ? 'success' : 'alert',
      });
    }

    const isTraceDataChanged = prevProps.userTraceData.reduce((acc, item, index) =>
      (userTraceData[index] && item.text !== userTraceData[index].text ? true : acc), false);

    if (isTraceDataChanged) {
      this.setState({
        elementsForChoice: this.initialSelectedElements,
        selectedElements: userTraceData,
      });
    }
  }

  public render() {
    const { userToken, userEmail, userName, userSurname, userSpeciality, userCourse,
      userExperience, t } = this.props;
    const items = [
      {
        label: t(sharedIntl.profile),
        onClick: this.onProfileMenuItemClick,
      },
      {
        label: t(sharedIntl.traceBuild),
        active: true,
      },
      {
        label: t(intl.trace),
        onClick: this.onGoToTraceMenuItemClick,
      },
    ];
    const {
      elementsForChoice,
      selectedElements,
      currentElementPositions,
      isMovingElementVisible,
    } = this.state;
    const userData = {
      email: userEmail,
      name: userName,
      surname: userSurname,
      speciality: userSpeciality,
      course: userCourse,
      experience: userExperience,
    };

    return (
      <div className={b()}>
        {userToken === '' && (
          <Redirect to={routes.login.getRedirectPath()} />
        )}
        {userToken !== '' && (
          <div className={b('main-wrap')}>
            <MainHeaderBar
              menuItems={items}
              personalData={userData}
              onLogoutButtonClickHadler={this.onLogoutButtonClick}
              t={t}
            />
            <div className={b('main-header')}>
              <div className={b('main-header-wrapper')}>
                {t(intl.instructionMessage)}
              </div>
              <div className={b('main-header-wrapper')}>
                <Button
                  label={t(intl.clearTrack) as string}
                  iconLeft={IconTrash}
                  size="xs"
                  onClick={this.onClearAllSelectedButtonClick}
                />
              </div>
              <div className={b('main-header-wrapper')}>
                <Button
                  label={t(intl.saveTrack) as string}
                  iconLeft={IconCheck}
                  size="xs"
                  onClick={this.onSaveTraceButtonClick}
                />
              </div>
            </div>
            <div
              className={b('content')}
              onMouseMove={event => this.onMouseOnDraggableAreaMove(event)}
              onMouseUp={this.onMouseInDraggableAreaUp}
              ref={this.contentRef}
            >
              <div className={b('dropable-elements')}>
                {selectedElements.map((element, index) => (
                  <div className={b('dropable-elements-line')} key={index + 100}>
                    {selectedElements.map((_element, id) => {
                      if (id < index) {
                        return (<div className={b('spacer')} key={id + 101}>{}</div>);
                      }
                      return false;
                    })}
                    <div
                      className={b('drop-element')}
                      onMouseUp={event => this.onDropableElementMouseUp(event, index)}
                      key={index}
                    >
                      {element.text}
                      {element.text !== '' && (
                        <div className={b('button-wrapper')}>
                          <Button
                            iconLeft={IconClose}
                            size="xs"
                            onClick={() => this.onDeleteSelectedElementButtonClick(index)}
                            onlyIcon
                          />
                        </div>
                      )}
                    </div>
                    {index === 0 && (
                      <div className={b('spacer')}><Badge label={t(intl.start)} status="error" /></div>
                    )}
                    {index === selectedElements.length - 1 && (
                      <div className={b('spacer')}><Badge label={t(intl.finish)} status="success" /></div>
                    )}
                  </div>
                ))}
              </div>
              <div className={b('draggable-elements')}>
                {elementsForChoice.map((element, index) => (
                  <div
                    className={b('drag-element')}
                    onMouseDown={event => this.onDraggableElementMouseDown(event, index)}
                    key={index}
                  >
                    {element.text}
                  </div>
                ))}
              </div>
              {isMovingElementVisible && (
                <div className={b('draggable-icon')} style={{ top: currentElementPositions[1], left: currentElementPositions[0] }}>
                  <IconBag
                    style={{ top: currentElementPositions[1], left: currentElementPositions[0] }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  private onDropableElementMouseUp(event: any, index: number): void {
    event.stopPropagation();

    this.setState((prevState: IState) => {
      const { elementsForChoice, selectedElements, currentDragElement } = prevState;
      const newSelectedElements = selectedElements.map((element, id) => {
        if (id === index && currentDragElement.text !== '' && element.text === '') {
          return { ...currentDragElement };
        }
        return element;
      });
      const condition = selectedElements[index].text !== '' && currentDragElement.text !== '';
      const newElementsForChoice = condition
        ? elementsForChoice.map(element => {
          if (element.id === currentDragElement.id) {
            return { ...currentDragElement };
          }
          return element;
        })
        : elementsForChoice.slice();

      return {
        selectedElements: newSelectedElements,
        elementsForChoice: newElementsForChoice,
        isMovingElementVisible: false,
        currentDragElement: { id: -1, text: '', prevPositionIndex: -1 },
      };
    });
  }

  private onDraggableElementMouseDown(event: any, index: number): void {
    event.preventDefault();
    const { elementsForChoice } = this.state;
    const spacer = 1;

    if (this.contentRef.current && elementsForChoice[index].text !== '') {
      const newElementsForChoice = elementsForChoice.map((element, id) => {
        if (index === id) {
          return { ...element, text: '' };
        }
        return element;
      });

      const { x, y } = this.contentRef.current.getBoundingClientRect();
      const xCoordinate = event.clientX - x + spacer;
      const yCoordinate = event.clientY - y + spacer;

      this.setState({
        currentDragElement: { ...elementsForChoice[index], prevPositionIndex: index },
        elementsForChoice: newElementsForChoice,
        isMovingElementVisible: true,
        currentElementPositions: [xCoordinate, yCoordinate],
      });
    }
  }

  private onMouseOnDraggableAreaMove(event: any): void {
    event.stopPropagation();
    const { currentDragElement } = this.state;

    if (currentDragElement.text !== '' && this.contentRef.current) {
      const { x, y } = this.contentRef.current.getBoundingClientRect();
      const xCoordinate = event.clientX - x + 1;
      const yCoordinate = event.clientY - y + 1;
      this.setState({ currentElementPositions: [xCoordinate, yCoordinate] });
    }
  }

  @autobind
  private onMouseInDraggableAreaUp(): void {
    this.setState((prevState: IState) => {
      const elementsForChoice = prevState.elementsForChoice.map((element, index) => {
        if (index === prevState.currentDragElement.prevPositionIndex) {
          return prevState.currentDragElement;
        }
        return element;
      });
      return {
        isMovingElementVisible: false,
        currentDragElement: { id: -1, text: '', prevPositionIndex: -1 },
        elementsForChoice,
      };
    });
  }

  private onDeleteSelectedElementButtonClick(index: number): void {
    this.setState(prevState => {
      const { elementsForChoice, selectedElements } = prevState;
      const positionIndex = selectedElements[index].id;
      const newSelectedElements = selectedElements.map((element, id) => {
        if (id === index) {
          return { ...element, text: '' };
        }
        return element;
      });
      const newElementsForChoice = elementsForChoice.map(element => {
        if (element.id === positionIndex) {
          return { ...selectedElements[index] };
        }
        return element;
      });

      return {
        selectedElements: newSelectedElements,
        elementsForChoice: newElementsForChoice,
      };
    });
  }

  @autobind
  private onClearAllSelectedButtonClick(): void {
    this.setState({
      selectedElements: this.initialSelectedElements,
      elementsForChoice: this.initialElementsForChoice,
    });
  }

  @autobind
  private onSaveTraceButtonClick(): void {
    const { userToken, saveTraceDataOnServer, setNotification,
      getAndSaveScreenshot, saveRouteTimePoint, t } = this.props;
    const { selectedElements } = this.state;
    const isTraceNotBuilded = selectedElements.some(item => item.text === '');
    if (isTraceNotBuilded) {
      setNotification({
        text: t(warnIntl.needToBuildTrace),
        kind: 'warning',
      });
    } else if (!isTraceNotBuilded) {
      saveTraceDataOnServer({ traceData: selectedElements, token: userToken });
      getAndSaveScreenshot({ token: userToken, appPosition: '1' });
      saveRouteTimePoint({
        token: userToken,
        routeTimePoint: { tracePoint: '1', time: new Date().getTime() },
      });
    }
  }

  @autobind
  private onLogoutButtonClick(): void {
    const { deleteUserDataForApp, saveAppPositionOnServer, clearSessionStorage,
      userToken } = this.props;
    saveAppPositionOnServer({ appPosition: 1, token: userToken });
    clearSessionStorage();
    deleteUserDataForApp();
  }

  @autobind
  private onProfileMenuItemClick(): void {
    const { onRedirectHandler, saveAppPositionOnServer, userToken } = this.props;
    saveAppPositionOnServer({ appPosition: 0, token: userToken });
    onRedirectHandler('profile');
  }

  @autobind
  private onGoToTraceMenuItemClick(): void {
    const {
      onRedirectHandler, saveAppPositionOnServer,
      setNotification, userTraceData, userToken, t,
    } = this.props;
    const { selectedElements } = this.state;
    const isTraceNotBuilded = selectedElements.some(item => item.text === '');

    if (isTraceNotBuilded) {
      setNotification({
        text: t(warnIntl.needToBuildTrace),
        kind: 'warning',
      });
    } else {
      saveAppPositionOnServer({ appPosition: Number(`2${userTraceData[0].id}`), token: userToken });
      onRedirectHandler('trace');
    }
  }
}

// тасование Фишера-Йетса
function shuffle(iniArray: any[]): any[] {
  return iniArray.reduceRight((acc, _item, i) => {
    const j = Math.floor(Math.random() * (i + 1));
    const accCopy = acc.slice();
    [accCopy[i], accCopy[j]] = [accCopy[j], accCopy[i]];
    return accCopy;
  }, iniArray);
}

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(TraceBuildComponent);
const TraceBuild = withTranslation()(connectedComponent);

export { TraceBuild };
