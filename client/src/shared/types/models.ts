import { ICursor } from 'shared/types/common';

export type UserData = {
  token: string;
  id: string;
  email: string;
} & IPersonalData;

export interface IPersonalData {
  name: string;
  surname: string;
  speciality: string;
  course: string;
  experience: number;
  expectations: string;
}

export interface ITraceItem {
  id: number;
  text: string;
}

export interface ICoreData {
  id: number;
  depth: number;
  porosity: number;
  waterSaturation: number;
  permability: number;
  isVisible: boolean;
}

export interface ILevel {
  data: { [key: string]: number; };
  name: string;
  color: string;
  width?: number;
  position: [number, number];
  id: string;
}

export interface IVerticalLevel {
  chart: string;
  chartColor: string;
  type: 'clay' | 'sand';
  position: [number, number];
}

export interface INamedInterval {
  beginCoordinate: number;
  endCoordinate: number;
  name: string;
  id: number;
  imageUrl?: string;
  repeatByY?: boolean;
}

export interface IBasicParameter {
  name: string;
  value: string;
  comment: string;
  fileUrl: string;
}

export interface IChartsVisibilities {
  main: boolean[];
  user: boolean[];
  userForTab: boolean[];
}

export interface IChartsColors {
  main: string[];
  user: string[];
  userForTab: string[];
}

export interface ICurves {
  [key: string]: number[];
}

export interface INote {
  minDepth: number;
  maxDepth: number;
  noteText: string;
  controls?: null | { edit: boolean; delete: boolean; };
}

export interface ICustomMultiSelectOption {
  value: string;
  label: string;
  color?: string;
  altLabel?: string;
  imageUrl: string;
}

export type SelectedItems = ICustomMultiSelectOption & { checked: boolean; };

export interface IStructure {
  minDepth: number;
  maxDepth: number;
  structureItems: SelectedItems[];
  controls?: null | { edit: boolean; delete: boolean; };
}

export interface ISameChartSettings {
  header?: string;
  initialMessage?: string;
  fieldSize?: [number, number];
  minDepth?: number;
  maxDepth?: number;

  lineColor?: string;
  lineWidth?: number;
  gridStep?: number;
  gridColor?: string;
  dotColor?: string;
}

type ChartPopoverSettings = {
  isConstraintSet: boolean;
  constraint: { left: number; right: number; };
  isLogarithmic: boolean;
  chartColor: string;
};

export interface IChartsPopoversSettings {
  main: ChartPopoverSettings[];
  user: ChartPopoverSettings[];
  userForTab: ChartPopoverSettings[];
}

export type CoreType = 'porosity' | 'waterSaturation' | 'permability';

export interface ISameState {
  cursor: ICursor;
  chartsVisibilities: IChartsVisibilities;
  isAllChartsVisible: boolean;
  chartPopoversSettings: IChartsPopoversSettings;
}

export interface IAllUserAndAppData {
  token: string;
  id: string;
  traceData: ITraceItem[];
  appPosition: number;
  featuresStates: { [key: string]: { [key: string]: any }};
  calculatedCurves: ICurves;
  calculatedCurvesForTabs: { [key: string]: ICurves };
  basicParameters: IBasicParameter[];
  passedPoints: string[];
  coreData: ICoreData[];
  curvesExpressions: { [key: string]: string };
  researchData: ICurves;
}
