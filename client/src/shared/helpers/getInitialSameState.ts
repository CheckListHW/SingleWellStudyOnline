import { ICurves, ISameState } from 'shared/types/models';
import { ICursor } from 'shared/types/common';
import { MAX_CURVES_AMOUNT_IN_USER_SECTION, MAX_CURVES_AMOUNT_IN_USERFORTAB_SECTION,
  DIAGRAM_DEFAULT_COLORS, INITIAL_NUMBER_OF_VISIBLE_CURVES } from 'shared/constants';

const getInitialSameState = (researchData: ICurves): ISameState => ({
  chartsVisibilities: {
    main: Object.keys(researchData).map((_item, id) => id < INITIAL_NUMBER_OF_VISIBLE_CURVES),
    user: Array(MAX_CURVES_AMOUNT_IN_USER_SECTION).fill(false),
    userForTab: Array(MAX_CURVES_AMOUNT_IN_USERFORTAB_SECTION).fill(false),
  },
  chartPopoversSettings: {
    main: Object.keys(researchData).map((key: string) => ({
      chartColor: DIAGRAM_DEFAULT_COLORS[key]
        ? DIAGRAM_DEFAULT_COLORS[key]
        : DIAGRAM_DEFAULT_COLORS.DEFAULT,
      isConstraintSet: false,
      isLogarithmic: false,
      constraint: { left: 0, right: 10 },
    })),
    user: Array(MAX_CURVES_AMOUNT_IN_USER_SECTION).fill({
      chartColor: DIAGRAM_DEFAULT_COLORS.DEFAULT,
      isConstraintSet: false,
      isLogarithmic: false,
      constraint: { left: 0, right: 10 },
    }),
    userForTab: Array(MAX_CURVES_AMOUNT_IN_USERFORTAB_SECTION).fill({
      chartColor: DIAGRAM_DEFAULT_COLORS.DEFAULT,
      isConstraintSet: false,
      isLogarithmic: false,
      constraint: { left: 0, right: 10 },
    }),
  },
  cursor: { position: [0, 0], visible: false } as ICursor,
  isAllChartsVisible: false,
});

export { getInitialSameState };
