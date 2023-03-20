import { autobind } from 'core-decorators';
import { ResponseType } from 'axios';

import { IPersonalData, ITraceItem, ICurves, IBasicParameter, ICoreData } from 'shared/types/models';

import { baseUrl } from '../../../../config/default.json';
import { HttpActions } from './HttpActions';

class Api {
  private actions: HttpActions;

  constructor() {
    this.actions = new HttpActions(`${baseUrl}/api/`);
  }

  @autobind
  public async loginUser(email: string, password: string): Promise<any> {
    const data = { email, password };
    const response = await this.actions.post<any>(
      'authorization/login',
      data,
    );
    return response;
  }

  @autobind
  public async savePersonalData(data: IPersonalData & { token: string }): Promise<any> {
    const { token, name, surname, speciality, course, experience, expectations } = data;
    const personalData = { name, surname, speciality, course, experience, expectations };
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'personal-data/save',
      personalData,
      options,
    );
    return response;
  }

  @autobind
  public async getPersonalData(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'personal-data/get',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async getAllUserData(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'personal-data/get-all-data',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async getTraceData(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-trace',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async getResearchData(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-research-data',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async saveTraceData(traceData: ITraceItem[], token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-trace',
      { traceData },
      options,
    );
    return response;
  }

  @autobind
  public async getAppPosition(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-app-position',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async saveAppPosition(appPosition: number, token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-app-position',
      { appPosition },
      options,
    );
    return response;
  }

  @autobind
  public async saveTabState(tabState: { [key: string]: { [key: string]: any } },
    token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-tab-state',
      { tabState },
      options,
    );
    return response;
  }

  @autobind
  public async getTabsStates(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-tabs-states',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async saveCalculatedCurves(calculatedCurves: ICurves, token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-calculated-curves',
      { calculatedCurves },
      options,
    );
    return response;
  }

  @autobind
  public async getCalculatedCurves(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-calculated-curves',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async saveCalculatedCurvesForTabs(calculatedCurvesForTabs:
  { [key: string]: ICurves }, token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-calculated-curves-for-tab',
      { calculatedCurvesForTabs },
      options,
    );
    return response;
  }

  @autobind
  public async getCalculatedCurvesForTabs(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-calculated-curves-for-tab',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async saveBasicParameters(basicParameters: IBasicParameter[],
    token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-basic-parameters',
      { basicParameters },
      options,
    );
    return response;
  }

  @autobind
  public async getBasicParameters(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-basic-parameters',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async savePassedPoints(passedPoints: string[], token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-passed-points',
      { passedPoints },
      options,
    );
    return response;
  }

  @autobind
  public async getPassedPoints(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-passed-points',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async saveCoreData(coreData: ICoreData[], token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-core-data',
      { coreData },
      options,
    );
    return response;
  }

  @autobind
  public async getCoreData(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-core-data',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async saveCurvesExpressions(curvesExpressions: { [key: string]: string; },
    token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-curves-expressions',
      { curvesExpressions },
      options,
    );
    return response;
  }

  @autobind
  public async getCurvesExpressions(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'user-application-data/get-curves-expressions',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async saveScreenshot(token: string, appPosition: string,
    base64Image: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-screenshot',
      { appPosition, base64Image },
      options,
    );
    return response;
  }

  @autobind
  public async saveRouteTimePoint(token: string, routeTimePoint:
  { tracePoint: string; time: number; }): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'user-application-data/save-route-time-point',
      { routeTimePoint },
      options,
    );
    return response;
  }

  @autobind
  public async loginAdmin(email: string, password: string): Promise<any> {
    const data = { email, password };
    const response = await this.actions.post<any>(
      'adminAuthorization/login',
      data,
    );
    return response;
  }

  @autobind
  public async deleteUser(token: string, userId: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'adminActions/delete-user',
      { userId },
      options,
    );
    return response;
  }

  @autobind
  public async changeUserPassword(token: string, userId: string,
    newPassword: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'adminActions/change-user-password',
      { userId, newPassword },
      options,
    );
    return response;
  }

  @autobind
  public async registrateUser(token: string, email: string, password: string,
    activeUntil: number, datasetId: number): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'adminActions/registrate-user',
      { email, password, activeUntil, datasetId },
      options,
    );
    return response;
  }


  @autobind
  public async findUsers(token: string, email: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'adminActions/find-users',
      { email },
      options,
    );
    return response;
  }

  @autobind
  public async changeUserActivity(token: string, userId: string, activeUntil: number,
    isActive: boolean): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'adminActions/change-user-activity',
      { userId, activeUntil, isActive },
      options,
    );
    return response;
  }

  @autobind
  public async getAllUserAndAppData(token: string, userId: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'adminActions/get-all-user-data',
      { userId },
      options,
    );
    return response;
  }

  @autobind
  public async getAllDatasets(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'adminActions/get-all-datasets',
      {},
      options,
    );
    return response;
  }

  @autobind
  public async saveDataset(token: string, dataset: { [key: string]: number[]; }, datasetId: number,
    description: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'adminActions/save-dataset',
      { dataset, datasetId, description },
      options,
    );
    return response;
  }

  @autobind
  public async removeDataset(token: string, datasetId: number): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.post<any>(
      'adminActions/remove-dataset',
      { datasetId },
      options,
    );
    return response;
  }

  @autobind
  public async getUsersReports(token: string, usersList: { userId: string; email: string; }[]): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/zip',
      },
      responseType: 'arraybuffer' as ResponseType,
    };
    const response = await this.actions.post<any>(
      'adminActions/get-users-reports',
      { usersList },
      options,
    );
    return response;
  }

  @autobind
  public async getUsersList(token: string): Promise<any> {
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await this.actions.get<any>(
      'adminActions/get-all-users',
      {},
      options,
    );
    return response;
  }
}

export { Api };
