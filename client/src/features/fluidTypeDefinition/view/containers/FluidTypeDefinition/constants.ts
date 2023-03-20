const LINE_TYPE_SELECT = [
  {
    value: '1',
    label: 'Уровень границы флюида',
    color: '#000',
  },
  {
    value: '2',
    label: 'Уровень ВНК',
    color: '#00f',
  },
  {
    value: '3',
    label: 'Уровень ГНК',
    color: '#f90',
  },
];

const LINE_TYPE_SELECT_TRANSLATION_KEYS = [
  'fluidBoundaryLevel',
  'oilWaterContactLevel',
  'gasOilContactLevel',
];

export { LINE_TYPE_SELECT, LINE_TYPE_SELECT_TRANSLATION_KEYS };
