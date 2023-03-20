import React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { TextField } from 'consta-uikit-fork/TextField';
import { Button } from 'consta-uikit-fork/Button';
import { IconTrash } from 'consta-uikit-fork/IconTrash';

import { IBasicParameter } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { selectors as buttonClickProviderSelectors } from 'services/buttonClickProvider';
import { actionCreators as notificationActions } from 'services/notification';
import { getTabIndex } from 'shared/helpers';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import './BasicParametersCalculation.scss';


interface IStateProps {
  basicParameters: IBasicParameter[];
  appPosition: number;
  token: string;
  passedPoints: string[];
  isSaveButtonClicked: boolean;
}

interface IState {
  parameters: IBasicParameter[];
}

type ActionProps = typeof mapDispatch;
type Props = IStateProps & ActionProps & ITranslationProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    basicParameters: userSelectors.selectBasicParameters(state),
    appPosition: userSelectors.selectUserAppPosition(state),
    token: userSelectors.selectUserToken(state),
    passedPoints: userSelectors.selectPassedPoints(state),
    isSaveButtonClicked: buttonClickProviderSelectors.selectSaveButtonClickStatus(state),
  };
}

const mapDispatch = {
  saveBasicParameters: userActions.saveBasicParameters,
  savePassedPoints: userActions.savePassedPoints,
  getAndSaveScreenshot: userActions.getAndSaveScreenshot,
  saveRouteTimePoint: userActions.saveRouteTimePoint,
  setNotification: notificationActions.setNotification,
};

const b = block('basic-parameters-calculation');
const { baseParameters: intl } = tKeys.features;

class BasicParametersCalculationComponent extends React.PureComponent<Props, IState> {
  public state = { parameters: this.props.basicParameters.slice() };

  public componentDidUpdate(prevProps: Props) {
    const { isSaveButtonClicked, token, appPosition, getAndSaveScreenshot,
      saveRouteTimePoint } = this.props;

    if (isSaveButtonClicked && prevProps.isSaveButtonClicked !== isSaveButtonClicked) {
      this.onSaveBasicParametersButtonClick();
      getAndSaveScreenshot({ token, appPosition: String(appPosition) });
      saveRouteTimePoint({
        token,
        routeTimePoint: { tracePoint: String(appPosition), time: new Date().getTime() },
      });
    }
  }

  public render() {
    const { parameters } = this.state;
    const { t } = this.props;

    return (
      <div className={b()}>
        <div className={b('header')}>
          <div className={b('header-inner-wrapper')}>
            {t(intl.baseParameters)}
          </div>
          <Button
            label={t(intl.addParameter) as string}
            size="xs"
            onClick={this.onAddNewParameterButtonClick}
          />
        </div>
        <div className={b('params-list')}>
          {parameters.map((parameter: IBasicParameter, index: number) => (
            <div className={b('params-list-item')}>
              <div className={b('params-list-item-name')}>
                {`${t(intl.name)}: `}
                <TextField
                  value={parameter.name}
                  id={`parameterName${index}`}
                  size="xs"
                  onChange={args => this.onParameterNameInputChange(args, index)}
                />
              </div>
              <div className={b('params-list-item-value')}>
                {`${t(intl.value)}: `}
                <TextField
                  value={String(parameter.value)}
                  id={`parameterValue${index}`}
                  size="xs"
                  onChange={args => this.onParameterValueInputChange(args, index)}
                />
              </div>
              <div className={b('params-list-item-file')}>
                {`${t(intl.calculationLink)}: `}
                <TextField
                  value={parameter.fileUrl}
                  id={`parameterFile${index}`}
                  size="xs"
                  onChange={args => this.onParameterFileUrlInputChange(args, index)}
                />
              </div>
              <div className={b('params-list-item-comment')}>
                <div className={b('params-list-item-comment-inner-wrapper')}>
                  {`${t(intl.comments)}: `}
                </div>
                <TextField
                  value={parameter.comment}
                  id={`parameterComment${index}`}
                  size="xs"
                  type="textarea"
                  minRows={4}
                  width="full"
                  placeholder={t(intl.message)}
                  onChange={args => this.onParameterCommentInputChange(args, index)}
                />
              </div>
              <div className={b('params-list-item-inner-wrap')}>
                <Button
                  onlyIcon
                  iconLeft={IconTrash}
                  size="xs"
                  onClick={() => this.onDeleteParameterButtonClick(index)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  @autobind
  private onSaveBasicParametersButtonClick() {
    const { saveBasicParameters, savePassedPoints, setNotification,
      token, passedPoints, appPosition, t } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const { parameters } = this.state;
    const isSomeParametersFieldsEmpty = parameters.some(parameter => (
      parameter.name === '' || parameter.value === '' || parameter.fileUrl === '' || parameter.comment === ''));

    if (!isSomeParametersFieldsEmpty) {
      saveBasicParameters({ basicParameters: parameters, token });

      if (!passedPoints.includes(String(currentFeatureStateIndex))) {
        savePassedPoints({
          passedPoints: [...passedPoints, String(currentFeatureStateIndex)],
          token,
        });
      }
    } else if (isSomeParametersFieldsEmpty) {
      setNotification({
        text: t(intl.warningMessage),
        kind: 'warning',
      });
    }
  }

  private onParameterNameInputChange(args: { value: string | null }, index: number): void {
    const { value } = args;
    this.setState((prevState: IState) =>
      ({ parameters: prevState.parameters.map((parameter, id) =>
        (id === index ? { ...parameter, name: value ? value.toUpperCase() : '' } : parameter)) }));
  }

  private onParameterValueInputChange(args: { value: string | null }, index: number): void {
    const { value } = args;
    const validValue = value ? value.replace(/[^\d.,]/g, '').replace(/,/g, '.') : '0';
    this.setState((prevState: IState) =>
      ({ parameters: prevState.parameters.map((parameter, id) =>
        (id === index ? { ...parameter, value: validValue } : parameter)) }));
  }

  private onParameterFileUrlInputChange(args: { value: string | null }, index: number): void {
    const { value } = args;
    this.setState((prevState: IState) =>
      ({ parameters: prevState.parameters.map((parameter, id) =>
        (id === index ? { ...parameter, fileUrl: value || '' } : parameter)) }));
  }

  private onParameterCommentInputChange(args: { value: string | null }, index: number): void {
    const { value } = args;
    this.setState((prevState: IState) =>
      ({ parameters: prevState.parameters.map((parameter, id) =>
        (id === index ? { ...parameter, comment: value || '' } : parameter)) }));
  }

  @autobind
  private onAddNewParameterButtonClick(): void {
    this.setState((prevState: IState) =>
      ({ parameters: [...prevState.parameters, { name: '', value: '', comment: '', fileUrl: '' }] }));
  }


  private onDeleteParameterButtonClick(index: number): void {
    this.setState((prevState: IState) =>
      ({ parameters: prevState.parameters.reduce((acc, parameter, id) =>
        (id === index ? acc : [...acc, parameter]), []) }));
  }
}

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(BasicParametersCalculationComponent);
const BasicParametersCalculation = withTranslation()(connectedComponent);

export { BasicParametersCalculation };
