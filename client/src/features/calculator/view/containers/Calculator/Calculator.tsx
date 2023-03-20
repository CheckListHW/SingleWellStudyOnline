/* eslint-disable no-eval */

import React from 'react';
import block from 'bem-cn';
import { connect } from 'react-redux';
import { autobind } from 'core-decorators';
import { TextField } from 'consta-uikit-fork/TextField';
import { Button } from 'consta-uikit-fork/Button';
import { Badge } from 'consta-uikit-fork/Badge';
import { Checkbox } from 'consta-uikit-fork/Checkbox';
import { IconClose } from 'consta-uikit-fork/IconClose';
import { IconEdit } from 'consta-uikit-fork/IconEdit';
import { IconCheck } from 'consta-uikit-fork/IconCheck';
import { IconTrash } from 'consta-uikit-fork/IconTrash';
import { IconInfo } from 'consta-uikit-fork/IconInfo';

import { ICurves, IBasicParameter } from 'shared/types/models';
import { IAppReduxState } from 'shared/types/app';
import { TABS_WITH_CALCULATION_FOR_TAB,
  FORBIDDEN_CURVE_NAMES } from 'shared/constants';
import { selectors as userSelectors, actions as userActions } from 'services/user';
import { actionCreators as notificationActions } from 'services/notification';
import { getTabIndex } from 'shared/helpers';
import { withTranslation, ITranslationProps, tKeys } from 'services/i18n';

import { ACCORDANCE_BUTTON_NAMES_TO_STRINGS, BUTTONS } from './constants';
import './Calculator.scss';


interface IOperators {
  [key: string]: (x: number, y?: number) => number;
}

interface IStateProps {
  researchData: ICurves;
  calculatedCurves: ICurves;
  calculatedCurvesForTab: { [key: string]: ICurves };
  basicParameters: IBasicParameter[];
  appPosition: number;
  curvesExpressions: { [key: string]: string };
  token: string;
}

interface IOwnProps {
  onCloseButtonClickHandler(): void;
}

interface IState {
  expressionValue: string;
  nameOfNewCurve: string;
  curveSelectorValue: string;
  calculateForCurrentTab: boolean;
  isEditControlsOpen: boolean;
  oldCurveName: string;
  newCurveName: string;
  typeCurvesList: 'user' | 'userForTab';
  currentCurveId: number;
  isInstructionVisible: boolean;
}

type ActionProps = typeof mapDispatch;

type Props = IStateProps & ActionProps & IOwnProps & ITranslationProps;

function mapState(state: IAppReduxState): IStateProps {
  return {
    researchData: userSelectors.selectResearchData(state),
    calculatedCurves: userSelectors.selectCalculatedCurves(state),
    calculatedCurvesForTab: userSelectors.selectCalculatedCurvesForTab(state),
    basicParameters: userSelectors.selectBasicParameters(state),
    appPosition: userSelectors.selectUserAppPosition(state),
    curvesExpressions: userSelectors.selectCurvesExpressions(state),
    token: userSelectors.selectUserToken(state),
  };
}

const mapDispatch = {
  saveCalculatedCurves: userActions.saveCalculatedCurvesData,
  saveCalculatedCurvesForTabs: userActions.saveCalculatedCurvesForTabData,
  saveCurvesExpressions: userActions.saveCurvesExpressions,
  setNotification: notificationActions.setNotification,
};

const b = block('calculator');
const { calculator: intl } = tKeys.features;

class CalculatorComponent extends React.Component<Props, IState> {
  public state = {
    expressionValue: '',
    nameOfNewCurve: 'CURVE1',
    curveSelectorValue: '0',
    calculateForCurrentTab: TABS_WITH_CALCULATION_FOR_TAB
      .includes(String(this.props.appPosition).length > 1
        ? Number(String(this.props.appPosition).slice(1)) : this.props.appPosition),
    isEditControlsOpen: false,
    oldCurveName: '',
    newCurveName: '',
    typeCurvesList: 'user' as 'user' | 'userForTab',
    currentCurveId: -1,
    isInstructionVisible: false,
  };

  public render() {
    const { expressionValue, nameOfNewCurve,
      curveSelectorValue, calculateForCurrentTab,
      isEditControlsOpen, newCurveName, currentCurveId,
      typeCurvesList, isInstructionVisible } = this.state;
    const { researchData, calculatedCurves, calculatedCurvesForTab, basicParameters,
      appPosition, curvesExpressions, onCloseButtonClickHandler, t } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const items = Object.keys(researchData).map((dataItem: string) => (
      { label: dataItem, value: dataItem }));
    const userCalculatedItems = calculatedCurves
      ? Object.keys(calculatedCurves).map((dataItem: string) => (
        { label: dataItem, value: dataItem }))
      : null;
    const userCalculatedItemsForTab = calculatedCurvesForTab[String(currentFeatureStateIndex)]
      ? Object.keys(calculatedCurvesForTab[String(currentFeatureStateIndex)])
        .map((dataItem: string) => ({ label: dataItem, value: dataItem }))
      : null;

    return (
      <div className={b()}>
        <div className={b('main-header-panel')}>
          <div className={b('main-header-panel-inner-wrapper')}>
            <Button
              iconLeft={IconInfo}
              onlyIcon
              size="xs"
              onClick={this.onInstructionButtonClick}
            />
          </div>
          <Button
            iconLeft={IconClose}
            onlyIcon
            size="xs"
            onClick={onCloseButtonClickHandler}
          />
        </div>
        <div className={b('main-body-wrapper')}>
          <div className={b('calculator-body', { 'border-right': isInstructionVisible ? 'dashed' : null })}>
            <div className={b('calculated-curves-block')}>
              <div className={b('calculated-curves-block-header')}>
                <Badge label={t(intl.calculatedCurves)} />
              </div>
              <div className={b('calculated-curves-block-inner')}>
                {calculatedCurves && Object.keys(calculatedCurves).length !== 0 && (
                  <Badge label={t(intl.forWholeApp)} />
                )}
                {calculatedCurves && Object.keys(calculatedCurves)
                  .map((key: string, index: number) => (
                    <div className={b('calculated-curves-block-item')} key={`${key}${index}`}>
                      <div className={b('calculated-curves-block-item-name')}>
                        {`${key} = ${curvesExpressions[key] ? curvesExpressions[key] : 'N/A'}`}
                      </div>
                      {isEditControlsOpen && currentCurveId === index && typeCurvesList === 'user' && (
                        <>
                          <div className={b('calculated-curves-block-item-inner-wrap')}>
                            <TextField
                              value={newCurveName}
                              id="newCurveName1"
                              size="xs"
                              onChange={this.onNewCurveNameInputChange}
                            />
                          </div>
                          <div className={b('calculated-curves-block-item-inner-wrap')}>
                            <Button
                              onlyIcon
                              iconLeft={IconCheck}
                              size="xs"
                              onClick={this.onSaveNewCurveNameButtonClick}
                            />
                          </div>
                        </>
                      )}
                      <div className={b('calculated-curves-block-item-inner-wrap')}>
                        <Button
                          onlyIcon
                          iconLeft={IconEdit}
                          size="xs"
                          onClick={() => this.onEditCalculatedCurveButtonClick(key, 'user', index)}
                        />
                      </div>
                      <Button
                        onlyIcon
                        iconLeft={IconTrash}
                        size="xs"
                        onClick={() => this.onDeleteCalculatedCurveButtonClick(key, 'user')}
                      />
                    </div>
                  ))}
                {calculatedCurvesForTab[String(currentFeatureStateIndex)]
                && Object.keys(calculatedCurvesForTab[String(currentFeatureStateIndex)])
                  .length !== 0 && (
                  <div className={b('calculated-curves-block-group-header')}>
                    <Badge label={t(intl.forThisTab)} />
                  </div>
                )}
                {calculatedCurvesForTab[String(currentFeatureStateIndex)]
                && Object.keys(calculatedCurvesForTab[String(currentFeatureStateIndex)])
                  .map((key: string, index: number) => (
                    <div className={b('calculated-curves-block-item')} key={`${key}${index}`}>
                      <div className={b('calculated-curves-block-item-name')}>
                        {key}
                        {' '}
                          =
                        {curvesExpressions[key] ? curvesExpressions[key] : 'N/A'}
                      </div>
                      {isEditControlsOpen && currentCurveId === index && typeCurvesList === 'userForTab' && (
                        <>
                          <div className={b('calculated-curves-block-item-inner-wrap')}>
                            <TextField
                              value={newCurveName}
                              id="newCurveName2"
                              size="xs"
                              onChange={this.onNewCurveNameInputChange}
                            />
                          </div>
                          <div className={b('calculated-curves-block-item-inner-wrap')}>
                            <Button
                              onlyIcon
                              iconLeft={IconCheck}
                              size="xs"
                              onClick={this.onSaveNewCurveNameButtonClick}
                            />
                          </div>
                        </>
                      )}
                      <div className={b('calculated-curves-block-item-inner-wrap')}>
                        <Button
                          onlyIcon
                          iconLeft={IconEdit}
                          size="xs"
                          onClick={() => this.onEditCalculatedCurveButtonClick(key, 'userForTab', index)}
                        />
                      </div>
                      <Button
                        onlyIcon
                        iconLeft={IconTrash}
                        size="xs"
                        onClick={() => this.onDeleteCalculatedCurveButtonClick(key, 'userForTab')}
                      />
                    </div>
                  ))}
              </div>
            </div>
            <div className={b('upper-control-line')}>
              <div className={b('new-line-name')}>
                <TextField
                  value={nameOfNewCurve}
                  id="curvename"
                  onChange={this.onCurveNameInputChange}
                />
              </div>
              <div className={b('equal-sign')}>
                =
              </div>
              <div className={b('expression')}>
                <TextField
                  value={expressionValue}
                  width="full"
                  id="expressionvalue"
                  rows={2}
                  onChange={this.onExpressionValueInputChange}
                />
              </div>
            </div>
            <div className={b('down-control-line')}>
              <select
                className={b('curve-select')}
                onChange={this.onSelectCurveComboboxChange}
                value={curveSelectorValue}
              >
                <option className={b('curve-select-option', { color: 'grey' })} value="0">
                  {t(intl.selectForInsert)}
                </option>
                {items.map(item => {
                  if (item.value !== 'kern') {
                    return (
                      <option className={b('curve-select-option')} value={item.value} key={item.label}>
                        {item.label}
                      </option>
                    );
                  }
                  return false;
                })}
                {userCalculatedItems
                && userCalculatedItems.map((item: { label: string; value: string }) => (
                  <option className={b('curve-select-option')} value={item.value} key={item.label}>{item.label}</option>
                ))}
                {userCalculatedItemsForTab
                && userCalculatedItemsForTab.map((item: { label: string; value: string }) => (
                  <option className={b('curve-select-option')} value={item.value} key={item.label}>{item.label}</option>
                ))}
                {basicParameters.map((item: IBasicParameter) => (
                  <option className={b('curve-select-option')} value={item.name} key={item.name}>{item.name}</option>
                ))}
              </select>
            </div>
            <div className={b('calculate-for-current-tab-checkbox-line')}>
              <Checkbox
                label={t(intl.calculatedOnlyForThisTab)}
                checked={calculateForCurrentTab}
                size="l"
                onChange={this.onCalculateForCurrentTabCheckboxChange}
              />
            </div>
            <div className={b('control-buttons')}>
              {BUTTONS.map((button, index) => (
                <div className={b('control-buttons-cell')} key={index}>
                  {button.color ? (
                    <Button
                      label={button.name}
                      view={button.view}
                      width="full"
                      size="xs"
                      onClick={() => this.onCalculatorControlButtonClick(button.name)}
                      className={`calculator__control-button calculator__control-button_color_${button.color}`}
                    />
                  ) : (
                    <Button
                      label={button.name}
                      view={button.view}
                      width="full"
                      size="xs"
                      onClick={() => this.onCalculatorControlButtonClick(button.name)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className={b('instruction', { visible: isInstructionVisible })}>
            <div className={b('instruction-wrapper')}>
              <Badge label="disclaimer" />
            </div>
            <div className={b('instruction-wrapper')}>
              {t(intl.instructionDisclaimer)}
            </div>
            <div className={b('instruction-wrapper')}>
              <Badge label={t(intl.instructionLogicalOperatorsHeader)} />
            </div>
            <div className={b('instruction-wrapper')}>
              {t(intl.instructionLogicalOperators)}
            </div>
            <div className={b('instruction-wrapper')}>
              <Badge label={t(intl.instructionFunctionHeader)} />
            </div>
            <div className={b('instruction-wrapper')}>
              {t(intl.instructionFunction)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  @autobind
  private onExpressionValueInputChange(args: { value: string | null }): void {
    this.setState({ expressionValue: args.value
      ? args.value.replace(/[^0-9A-Za-z-+*/=!<>.,&|()^\s]/g, '').replace(/,/g, '.')
      : '' });
  }

  @autobind
  private onInstructionButtonClick(): void {
    this.setState((prevState: IState) =>
      ({ isInstructionVisible: !prevState.isInstructionVisible }));
  }

  @autobind
  private onNewCurveNameInputChange(args: { value: string | null }): void {
    const { value } = args;
    this.setState({ newCurveName: value ? value.replace(/\W/g, '').replace(/_/g, '').toUpperCase() : '' });
  }

  private onEditCalculatedCurveButtonClick(oldName: string, type: 'user' | 'userForTab', index: number): void {
    this.setState({
      oldCurveName: oldName,
      typeCurvesList: type,
      isEditControlsOpen: true,
      currentCurveId: index,
    });
  }

  @autobind
  private onSaveNewCurveNameButtonClick(): void {
    const { calculatedCurves, calculatedCurvesForTab, appPosition, token, curvesExpressions,
      saveCurvesExpressions, saveCalculatedCurves, saveCalculatedCurvesForTabs,
      setNotification, t } = this.props;
    const { oldCurveName, newCurveName, typeCurvesList } = this.state;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const curvesExpressionsWithRenamedKey = Object.keys(curvesExpressions)
      .reduce((acc, curveExpressionKey) => (curveExpressionKey === oldCurveName
        ? { ...acc, [newCurveName]: curvesExpressions[oldCurveName] }
        : { ...acc, [curveExpressionKey]: curvesExpressions[curveExpressionKey] }), {});

    if (typeCurvesList === 'user') {
      const isCurveNameExist = this.checkKeyAvailability(newCurveName);
      const newUserCalculatedCurves = Object.keys(calculatedCurves)
        .reduce((acc, key: string) => (key === oldCurveName
          ? { ...acc, ...{ [newCurveName]: calculatedCurves[key] } }
          : { ...acc, ...{ [key]: calculatedCurves[key] } }), {});

      if (isCurveNameExist) {
        setNotification({
          text: t(intl.nameIsAlreadyExist),
          kind: 'warning',
        });
      } else {
        saveCurvesExpressions({ curvesExpressions: curvesExpressionsWithRenamedKey, token });
        saveCalculatedCurves({ calculatedCurves: newUserCalculatedCurves, token });
      }
    }

    if (typeCurvesList === 'userForTab') {
      const isCurveNameExist = this.checkKeyAvailability(newCurveName);
      const newUserCalculatedCurvesForTab = Object
        .keys(calculatedCurvesForTab[String(currentFeatureStateIndex)])
        .reduce((acc, key: string) => (key === oldCurveName
          ? {
            ...acc,
            [newCurveName]: calculatedCurvesForTab[String(currentFeatureStateIndex)][key],
          }
          : { ...acc, [key]: calculatedCurvesForTab[String(currentFeatureStateIndex)][key] }), {});

      if (isCurveNameExist) {
        setNotification({
          text: t(intl.nameIsAlreadyExist),
          kind: 'warning',
        });
      } else {
        saveCurvesExpressions({ curvesExpressions: curvesExpressionsWithRenamedKey, token });
        saveCalculatedCurvesForTabs({
          calculatedCurvesForTabs: {
            ...calculatedCurvesForTab,
            [String(currentFeatureStateIndex)]: newUserCalculatedCurvesForTab,
          },
          token });
      }
    }

    this.setState({ isEditControlsOpen: false,
      oldCurveName: '',
      newCurveName: '',
      currentCurveId: -1 });
  }

  private onDeleteCalculatedCurveButtonClick(name: string, type: 'user' | 'userForTab'): void {
    const { calculatedCurves, calculatedCurvesForTab, curvesExpressions, appPosition, token,
      saveCurvesExpressions, saveCalculatedCurves, saveCalculatedCurvesForTabs } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const curvesExpressionsWithDeletedKey = Object.keys(curvesExpressions)
      .reduce((acc, curveExpressionKey) => (curveExpressionKey === name
        ? acc
        : { ...acc, [curveExpressionKey]: curvesExpressions[curveExpressionKey] }), {});

    saveCurvesExpressions({ curvesExpressions: curvesExpressionsWithDeletedKey, token });

    if (type === 'user') {
      const newUserCalculatedCurves = Object.keys(calculatedCurves)
        .reduce((acc, key: string) =>
          (key === name ? acc : { ...acc, [key]: calculatedCurves[key] }), {});
      saveCalculatedCurves({ calculatedCurves: newUserCalculatedCurves, token });
    }

    if (type === 'userForTab') {
      const newUserCalculatedCurvesForTab = Object
        .keys(calculatedCurvesForTab[String(currentFeatureStateIndex)])
        .reduce((acc, key: string) => (key === name
          ? acc
          : { ...acc, [key]: calculatedCurvesForTab[String(currentFeatureStateIndex)][key] }), {});

      saveCalculatedCurvesForTabs({
        calculatedCurvesForTabs: {
          ...calculatedCurvesForTab,
          [String(currentFeatureStateIndex)]: newUserCalculatedCurvesForTab,
        },
        token,
      });
    }
  }

  @autobind
  private onCalculateForCurrentTabCheckboxChange(): void {
    this.setState((prevState: IState) => (
      { calculateForCurrentTab: !prevState.calculateForCurrentTab }));
  }

  @autobind
  private onSelectCurveComboboxChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    const { target } = event;
    if (target && target.value !== '0') {
      this.setState((prevState: IState) => (
        { expressionValue: `${prevState.expressionValue}${target.value}`, curveSelectorValue: '0' }
      ));
    }
  }

  @autobind
  private onCurveNameInputChange(args: { value: string | null }): void {
    const { value } = args;
    this.setState({ nameOfNewCurve: value ? value.replace(/\W/g, '').replace(/_/g, '').toUpperCase() : '' });
  }

  private onCalculatorControlButtonClick(controlButtonName: string): void {
    switch (controlButtonName) {
      case 'CALC':
        this.onCalculateButtonClick();
        break;
      case 'C':
        this.setState({ expressionValue: '' });
        break;
      case '<-':
        this.setState((prevState: IState) => (
          { expressionValue: prevState.expressionValue
            .slice(0, prevState.expressionValue.length - 1) }
        ));
        break;
      case 'POW':
      case 'e':
      case '\u03C0':
      case 'round':
      case 'ABS':
      case 'SIN':
      case 'COS':
      case 'TAN':
      case 'LOG':
      case 'LN':
      case 'LG':
      case 'SQRT':
      case 'if':
      case 'then':
      case 'else':
      case 'or':
      case 'and':
        this.setState((prevState: IState) => (
          { expressionValue:
            `${prevState.expressionValue}${ACCORDANCE_BUTTON_NAMES_TO_STRINGS[controlButtonName]}` }
        ));
        break;
      case '?':
        this.setState((prevState: IState) => (
          { expressionValue:
            `${prevState.expressionValue}if ((DEPTH>=2620) && (DEPTH<=2650) && (IK>90) && ((3===3) || (1>2))) then (1) else (0)` }
        ));
        break;
      default:
        this.setState((prevState: IState) => (
          { expressionValue: `${prevState.expressionValue}${(controlButtonName).toLowerCase()}` }
        ));
    }
  }

  @autobind
  private onCalculateButtonClick(): void {
    const { curvesExpressions, token, saveCurvesExpressions, setNotification, t } = this.props;
    const { nameOfNewCurve, calculateForCurrentTab, expressionValue } = this.state;
    const numberOfOpenParentheses = expressionValue.match(/\(/g);
    const numberOfCloseParentheses = expressionValue.match(/\)/g);
    if (numberOfOpenParentheses && numberOfCloseParentheses
      && numberOfOpenParentheses.length !== numberOfCloseParentheses.length) {
      setNotification({
        text: t(intl.parenthesesBalance),
        kind: 'warning',
      });
      return;
    }

    if (expressionValue !== '') {
      saveCurvesExpressions({
        curvesExpressions: { ...curvesExpressions, [nameOfNewCurve]: expressionValue },
        token,
      });
      if (/^if/.test(expressionValue)) {
        this.saveNewCalculatedCurve({
          curveData: {
            [nameOfNewCurve]: this.calculateNewCurveFromLogicExpression(expressionValue),
          },
          isCalculatedForCurrentTab: calculateForCurrentTab,
        });
      } else {
        this.saveNewCalculatedCurve({
          curveData: { [nameOfNewCurve]: this.calculateNewCurve(expressionValue) },
          isCalculatedForCurrentTab: calculateForCurrentTab,
        });
      }
    }
  }

  private calculateNewCurve(expressionValue: string): number[] {
    if (expressionValue !== '') {
      const { researchData, calculatedCurves, calculatedCurvesForTab,
        basicParameters, appPosition } = this.props;
      const currentFeatureStateIndex = String(getTabIndex(appPosition));
      const RPNExpression = formatExpressionToReversePolishNotation(expressionValue);
      const combinedData = {
        ...researchData,
        ...calculatedCurves,
        ...calculatedCurvesForTab[currentFeatureStateIndex],
      };
      const combinedDataKeys = Object.keys(combinedData);
      const basicParametersVariables = basicParameters
        .reduce((acc, parameter) => ({ ...acc, [parameter.name]: parameter.value }), {});

      return researchData.DEPTH.map((_item, index: number) => {
        const variables = combinedDataKeys.reduce((acc, key: string) => {
          const currentDataValue = combinedData[key];
          return { ...acc, [key]: currentDataValue ? currentDataValue[index] : 0 };
        }, {});
        return calculateValueOfReversPolishNotation(RPNExpression,
          { ...variables, ...basicParametersVariables });
      });
    }
    return [];
  }

  private calculateNewCurveFromLogicExpression(expressionValue: string): number[] {
    if (expressionValue !== '') {
      const { researchData, calculatedCurves, calculatedCurvesForTab,
        basicParameters, appPosition } = this.props;
      const currentFeatureStateIndex = String(getTabIndex(appPosition));
      const basicParametersVariables = basicParameters
        .reduce((acc, parameter) => ({ ...acc, [parameter.name]: parameter.value }), {});
      const preparedExpression = expressionValue.replace(/\s+/g, '');
      const beginIndexOfLogicExpression = preparedExpression.indexOf('if(') + 3;
      const endIndexOfLogicExpression = preparedExpression.indexOf(')then(');
      const condition = preparedExpression
        .slice(beginIndexOfLogicExpression, endIndexOfLogicExpression);

      const beginIndexOfTrueExpression = endIndexOfLogicExpression + 6;
      const endIndexOfTrueExpression = preparedExpression.indexOf(')else(');
      const trueRPNExpression = formatExpressionToReversePolishNotation(
        preparedExpression.slice(beginIndexOfTrueExpression, endIndexOfTrueExpression),
      );

      const beginIndexOfFalseExpression = endIndexOfTrueExpression + 6;
      const endIndexOfFalseExpression = preparedExpression.length - 1;
      const falseRPNExpression = formatExpressionToReversePolishNotation(
        preparedExpression.slice(beginIndexOfFalseExpression, endIndexOfFalseExpression),
      );

      const combinedData = {
        ...researchData,
        ...calculatedCurves,
        ...calculatedCurvesForTab[currentFeatureStateIndex],
      };
      const combinedDataKeys = Object.keys(combinedData);

      return researchData.DEPTH.map((_item, index: number) => {
        const variables = combinedDataKeys.reduce((acc, key) => {
          const currentDataValue = combinedData[key as keyof typeof combinedData];
          return { ...acc, [key]: currentDataValue ? currentDataValue[index] : 0 };
        }, {});
        const isConditionTrue = calculateValueOfLogicExpression(condition,
          { ...variables, ...basicParametersVariables });

        return (isConditionTrue
          ? calculateValueOfReversPolishNotation(trueRPNExpression, variables)
          : calculateValueOfReversPolishNotation(falseRPNExpression, variables)
        );
      });
    }
    return [];
  }

  @autobind
  private saveNewCalculatedCurve(newLine: {
    curveData: ICurves; isCalculatedForCurrentTab: boolean; }): void {
    const { calculatedCurves, calculatedCurvesForTab, appPosition, token,
      saveCalculatedCurves, saveCalculatedCurvesForTabs, setNotification, t } = this.props;
    const currentFeatureStateIndex = getTabIndex(appPosition);
    const { curveData, isCalculatedForCurrentTab } = newLine;

    if (Object.keys(curveData).length === 0) {
      setNotification({
        text: t(intl.needToInsertEquation),
        kind: 'warning',
      });
    } else if (isCalculatedForCurrentTab) {
      const currentKey = Object.keys(curveData)[0];
      const isCurrentKeyAlreadyExist = this.checkKeyAvailability(currentKey);
      if (isCurrentKeyAlreadyExist) {
        setNotification({
          text: t(intl.nameIsAlreadyExist),
          kind: 'warning',
        });
      } else if (calculatedCurvesForTab[String(currentFeatureStateIndex)]) {
        const newCurvesListForTab = {
          ...calculatedCurvesForTab[String(currentFeatureStateIndex)],
          ...curveData,
        };
        saveCalculatedCurvesForTabs({
          calculatedCurvesForTabs: {
            ...calculatedCurvesForTab,
            [String(currentFeatureStateIndex)]: newCurvesListForTab,
          },
          token,
        });
      } else {
        saveCalculatedCurvesForTabs({
          calculatedCurvesForTabs: {
            ...calculatedCurvesForTab,
            [String(currentFeatureStateIndex)]: curveData,
          },
          token,
        });
      }
    } else {
      const currentKey = Object.keys(curveData)[0];
      const isCurrentKeyAlreadyExist = this.checkKeyAvailability(currentKey);
      if (isCurrentKeyAlreadyExist) {
        setNotification({
          text: t(intl.nameIsAlreadyExist),
          kind: 'warning',
        });
      } else {
        saveCalculatedCurves({ calculatedCurves: { ...calculatedCurves, ...curveData }, token });
      }
    }
  }

  private checkKeyAvailability(key: string): boolean {
    const { researchData, calculatedCurves, calculatedCurvesForTab } = this.props;
    const researchDataKeys = researchData && Object.keys(researchData)
      ? Object.keys(researchData)
      : [];
    const calculatedCurvesDataKeys = calculatedCurves && Object.keys(calculatedCurves)
      ? Object.keys(calculatedCurves)
      : [];
    const calculatedCurvesForTabsDataKeys = calculatedCurvesForTab
    && Object.keys(calculatedCurvesForTab)
      ? Object.keys(calculatedCurvesForTab).reduce((acc, tab) => (calculatedCurvesForTab[tab]
        && Object.keys(calculatedCurvesForTab[tab]).length !== 0 ? [...acc, tab] : acc), [])
      : [];
    const allCurvesForTabsKeys = calculatedCurvesForTabsDataKeys.reduce((mainAcc, tab) => {
      const tabKeys = calculatedCurvesForTab[tab] && Object.keys(calculatedCurvesForTab[tab])
        ? Object.keys(calculatedCurvesForTab[tab])
        : [];
      return [...mainAcc, ...tabKeys];
    }, []);
    const combinedDataKeys = [
      ...researchDataKeys,
      ...calculatedCurvesDataKeys,
      ...allCurvesForTabsKeys,
      ...FORBIDDEN_CURVE_NAMES,
    ];

    return combinedDataKeys.includes(key);
  }
}

const calculateValueOfReversPolishNotation = (reversePolishNotation: string[],
  variables: { [key: string]: number } = { GZ1: 1 }): number => {
  const operators: IOperators = {
    '+': (x, y) => (y ? x + y : x),
    '-': (x, y) => (y ? x - y : x),
    '*': (x, y) => (y ? x * y : x),
    '/': (x, y) => (y ? x / y : x),
    '^': (x, y) => (y ? x ** y : x),
    log: (x, y) => (y ? Math.log(y) / Math.log(x) : x),
    sqrt: x => Math.sqrt(x),
    ln: x => Math.log(x),
    lg: x => Math.log10(x),
    sin: x => Math.sin(x),
    cos: x => Math.cos(x),
    tan: x => Math.tan(x),
    abs: x => Math.abs(x),
    round: x => Math.round(x),
  };
  const variablesKeys = Object.keys(variables);
  const RPNArrayWithInsertedVariables = variablesKeys.length !== 0
    ? reversePolishNotation.map(item => (variablesKeys.includes(item)
      ? String(variables[item])
      : item))
    : reversePolishNotation;
  const stack: any[] = [];

  RPNArrayWithInsertedVariables.forEach((item: string) => {
    if (Object.keys(operators).includes(item)) {
      if (item !== 'sqrt' && item !== 'ln' && item !== 'lg'
      && item !== 'sin' && item !== 'cos' && item !== 'tan'
      && item !== 'abs' && item !== 'round') {
        const [y, x] = [stack.pop(), stack.pop()];
        stack.push(operators[item as keyof IOperators](x, y));
      } else {
        const [x] = [stack.pop()];
        stack.push(operators[item as keyof IOperators](x));
      }
    } else {
      stack.push(parseFloat(item));
    }
  });

  const result = stack.pop();
  return result ? Math.round(result.toFixed(14) * 100) / 100 : -9999;
};

const getTokenizedExpression = (expressionCharactersArray: string[]): string[] => {
  const tokenizedExpressionObject = expressionCharactersArray
    .reduce((acc: { expression: string[], buffer: string}, character: string, index: number) => {
      if (character === '.' || /[0-9A-Za-z]/.test(character)
      || (index === 0 && /-/.test(character))
      || (/[(-+/*]/.test(acc.expression[acc.expression.length - 1]) && acc.buffer === '' && /-/.test(character))) {
        const buffer = acc.buffer.concat(character);
        return index === expressionCharactersArray.length - 1
          ? { expression: [...acc.expression, buffer], buffer: '' }
          : { ...acc, buffer };
      }
      return {
        expression: acc.buffer !== '' ? [...acc.expression, acc.buffer, character] : [...acc.expression, character],
        buffer: '',
      };
    }, { expression: [], buffer: '' });
  return tokenizedExpressionObject.expression;
};

const formatExpressionToReversePolishNotation = (expression: string): string[] => {
  const expressionCharactersArray = expression.replace(/\s+/g, '').split('');
  const tokenizedExpressionArray = getTokenizedExpression(expressionCharactersArray);
  const operatorsWeights = {
    '(': 0,
    '-': 1,
    '+': 1,
    '*': 2,
    '/': 2,
    '^': 3,
    sqrt: 3,
    sin: 3,
    cos: 3,
    tan: 3,
    abs: 3,
    round: 3,
    lg: 3,
    ln: 3,
    log: 3,
  };

  type OperatorsWeights = keyof typeof operatorsWeights;

  const reversePolishNotation = tokenizedExpressionArray
    .reduce((acc: { result: string[], stack: string[] }, token: string) => {
      if (/[0-9A-Z]/.test(token.split('')[0]) || /^-[0-9A-Z]/.test(token)) {
        return { ...acc, result: [...acc.result, token] };
      }
      if (token === '(') {
        return { ...acc, stack: [...acc.stack, token] };
      }
      if (token === ')') {
        let stackCopy = [...acc.stack];
        let resultCopy = [...acc.result];
        while (stackCopy[stackCopy.length - 1] !== '(') {
          const extractedElement = stackCopy.slice(stackCopy.length - 1)[0];
          stackCopy = stackCopy.slice(0, stackCopy.length - 1);
          resultCopy = [...resultCopy, extractedElement];
        }
        return { result: [...resultCopy], stack: stackCopy.slice(0, stackCopy.length - 1) };
      }
      if (operatorsWeights[acc.stack[acc.stack.length - 1] as OperatorsWeights]
        < operatorsWeights[token as OperatorsWeights] || acc.stack.length === 0) {
        return { ...acc, stack: [...acc.stack, token] };
      }
      if (operatorsWeights[acc.stack[acc.stack.length - 1] as OperatorsWeights]
        >= operatorsWeights[token as OperatorsWeights]) {
        let stackCopy = [...acc.stack];
        let resultCopy = [...acc.result];
        while (operatorsWeights[stackCopy[stackCopy.length - 1] as OperatorsWeights]
          >= operatorsWeights[token as OperatorsWeights]) {
          const extractedElement = stackCopy.slice(stackCopy.length - 1)[0];
          stackCopy = stackCopy.slice(0, stackCopy.length - 1);
          resultCopy = [...resultCopy, extractedElement];
        }
        return { result: [...resultCopy], stack: [...stackCopy, token] };
      }
      return acc;
    }, { result: [], stack: [] });

  const res = [...reversePolishNotation.result, ...reversePolishNotation.stack.reverse()];

  return res;
};

const calculateValueOfLogicExpression = (expression: string, variables: {
  [key: string]: number } = { GZ1: 1 }): boolean => {
  const expressionCharactersArray = expression.replace(/\s+/g, '').split('');
  const tokenizedExpressionArray = getTokenizedExpression(expressionCharactersArray);
  const tokenizedExpressionArrayWithInsertedVariables = Object.keys(variables).length !== 0
    ? tokenizedExpressionArray.map(item => (Object.keys(variables).includes(item)
      ? String(variables[item])
      : item))
    : tokenizedExpressionArray;
  return Boolean(eval(''.concat(...tokenizedExpressionArrayWithInsertedVariables)));
};

const connectedComponent = connect<IStateProps, ActionProps, {}>(mapState,
  mapDispatch)(CalculatorComponent);
const Calculator = withTranslation()(connectedComponent);

export { Calculator };
