import React from 'react';
import block from 'bem-cn';
import uuid from 'uuid';
import { Badge } from 'consta-uikit-fork/Badge';
import { Checkbox } from 'consta-uikit-fork/Checkbox';
import { Radio } from 'consta-uikit-fork/Radio';

import { ICurves, IChartsVisibilities } from 'shared/types/models';
import { TranslateFunction, tKeys } from 'services/i18n';

import './CurvesBrowser.scss';

interface IProps {
  researchData?: ICurves;
  calculatedCurvesData?: ICurves;
  calculatedCurvesForTabData?: ICurves;
  isAllChartsVisible?: boolean;
  isRadioSwitch?: boolean;
  chartsVisibilities: IChartsVisibilities;
  t: TranslateFunction;
  onCheckboxClickHandler?(index: number, type: 'same' | 'user' | 'userForTab'): void;
  onShowAllChartsCheckboxClick?(): void;
}

const b = block('curves-browser');
const { curvesBrowser: intl } = tKeys;

function CurvesBrowser(props: IProps) {
  const {
    researchData, calculatedCurvesData, calculatedCurvesForTabData,
    isAllChartsVisible, chartsVisibilities, isRadioSwitch,
    onCheckboxClickHandler, onShowAllChartsCheckboxClick, t,
  } = props;
  const researchDataKeys = researchData && Object.keys(researchData)
    ? Object.keys(researchData)
    : null;
  const calculatedCurvesDataKeys = calculatedCurvesData && Object.keys(calculatedCurvesData)
    ? Object.keys(calculatedCurvesData)
    : null;
  const calculatedCurvesForTabDataKeys = calculatedCurvesForTabData
  && Object.keys(calculatedCurvesForTabData)
    ? Object.keys(calculatedCurvesForTabData)
    : null;

  return (
    <div className={b()}>
      {researchDataKeys && onCheckboxClickHandler && onShowAllChartsCheckboxClick && (
        <>
          <div className={b('header')}>
            <Badge label={t(intl.charts)} />
          </div>
          <div className={b('content')}>
            {researchDataKeys.map((key: string, index: number) => (
              key !== 'DEPTH' && key !== 'PORO' && key !== 'SW'
              && key !== 'PERM' && (
                <div className={b('item')} key={key}>
                  <Checkbox
                    label={key}
                    checked={chartsVisibilities.main[index]}
                    size="l"
                    onChange={() => onCheckboxClickHandler(index, 'same')}
                  />
                </div>
              )
            ))}
            {isAllChartsVisible !== undefined && (
              <div className={b('item')} key={uuid()}>
                <Checkbox
                  label={t(intl.all)}
                  checked={isAllChartsVisible}
                  size="l"
                  onChange={onShowAllChartsCheckboxClick}
                />
              </div>
            )}
          </div>
        </>
      )}
      {calculatedCurvesDataKeys && calculatedCurvesDataKeys.length !== 0
      && onCheckboxClickHandler && (
        <>
          <div className={b('header')}>
            <Badge label={t(intl.forWholeApp)} />
          </div>
          <div className={b('content')}>
            {calculatedCurvesDataKeys.map((key: string, index: number) => (
              <div className={b('item')} key={key}>
                <Checkbox
                  label={key}
                  checked={chartsVisibilities.user[index]}
                  size="l"
                  onChange={() => onCheckboxClickHandler(index, 'user')}
                />
              </div>
            ))}
          </div>
        </>
      )}
      {calculatedCurvesForTabDataKeys && calculatedCurvesForTabDataKeys.length !== 0
      && onCheckboxClickHandler && (
        <>
          <div className={b('header')}>
            <Badge label={t(intl.forThisTab)} />
          </div>
          <div className={b('content')}>
            {calculatedCurvesForTabDataKeys.map((key: string, index: number) => {
              if (!isRadioSwitch) {
                return (
                  <div className={b('item')} key={key}>
                    <Checkbox
                      label={key}
                      checked={chartsVisibilities.userForTab[index]}
                      size="l"
                      onChange={() => onCheckboxClickHandler(index, 'userForTab')}
                    />
                  </div>
                );
              }
              return (
                <div className={b('item')} key={key}>
                  <Radio
                    label={key}
                    checked={chartsVisibilities.userForTab[index]}
                    size="l"
                    onChange={() => onCheckboxClickHandler(index, 'userForTab')}
                  />
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export { CurvesBrowser };
