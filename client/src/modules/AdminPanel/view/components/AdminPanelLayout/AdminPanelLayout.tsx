import React from 'react';
import block from 'bem-cn';
import { autobind } from 'core-decorators';
import { RouteComponentProps } from 'react-router-dom';

import { AdminPanel } from 'features/adminPanel';
import { Trace } from 'features/trace';
import { ReservoirsDefinition } from 'features/reservoirsDefinition';
import { LithologyDefinition } from 'features/lithologyDefinition';
import { ClayContentCalculation } from 'features/сlayContentCalculation';
import { PorosityCalculation } from 'features/porosityCalculation';
import { WaterSaturationCalculation } from 'features/waterSaturationCalculation';
import { PenetrabilityCalculation } from 'features/penetrabilityCalculation';
import { LimitValuesCalculation } from 'features/limitValuesCalculation';
import { BasicParametersCalculation } from 'features/basicParametersCalculation';
import { FluidTypeDefinition } from 'features/fluidTypeDefinition';
import { PerforationIntervalsDefinition } from 'features/perforationIntervalsDefinition';
import { SedimentationEnvironmentDetermination } from 'features/sedimentationEnvironmentDetermination';
import { AnalogueFieldSelection } from 'features/analogueFieldSelection';
import { SummarySection } from 'features/summarySection';
import { Calculator } from 'features/calculator';
import { CurvesDownload } from 'features/curvesDownload';
import { RoutesTypes } from 'shared/types/routes';

import { routes } from '../../../../routes';
import './AdminPanelLayout.scss';


const b = block('admin-panel-layout');

class AdminPanelLayoutComponent extends React.PureComponent<RouteComponentProps> {
  public render() {
    const tabsFeatures = [
      ReservoirsDefinition,
      LithologyDefinition,
      ClayContentCalculation,
      PorosityCalculation,
      WaterSaturationCalculation,
      PenetrabilityCalculation,
      LimitValuesCalculation,
      BasicParametersCalculation,
      FluidTypeDefinition,
      PerforationIntervalsDefinition,
      AnalogueFieldSelection,
      SedimentationEnvironmentDetermination,
      SummarySection,
      Calculator,
      CurvesDownload,
    ];
    return (
      <div className={b()}>
        <AdminPanel
          onRedirectHandler={this.onRedirect}
          userTraceFeature={Trace}
          propsForTraceFeature={tabsFeatures}
        />
      </div>
    );
  }

  @autobind
  private onRedirect(to: RoutesTypes) {
    const { history } = this.props;
    history.push(routes[to].getRoutePath());
  }
}

export { AdminPanelLayoutComponent as AdminPanelLayout };
