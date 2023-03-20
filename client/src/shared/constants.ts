export const TRACE_ITEMS = [
  { id: 0, text: 'Выделение коллекторов', altText: 'Выделение коллекторов' },
  { id: 1, text: 'Определение литологии', altText: 'Литология' },
  { id: 2, text: 'Расчет глинистости', altText: 'Глинистость' },
  { id: 3, text: 'Расчет пористости', altText: 'Пористость' },
  { id: 4, text: 'Расчет водонасыщенности', altText: 'Водонасыщенность' },
  { id: 5, text: 'Расчет проницаемости', altText: 'Проницаемость' },
  { id: 6, text: 'Расчет граничных значений', altText: 'Граничные значения' },
  { id: 7, text: 'Расчет базовых параметров (a, m, n, Rw)', altText: 'Базовые параметры' },
  { id: 8, text: 'Определение типа флюида и ВНК', altText: 'Тип флюида и ВНК' },
  { id: 9, text: 'Определение интервалов перфорации', altText: 'Интервалы перфорации' },
  { id: 10, text: 'Подбор месторождения аналога', altText: 'Месторождение аналог' },
  { id: 11, text: 'Определение обстановки осадконакопления', altText: 'Обстановка осадконакопления' },
  {
    id: 12,
    text: 'Заключение и рекомендации. Отправка результатов заказчику',
    altText: 'Заключение, рекомендации и отправка результатов',
  },
];

export const FORBIDDEN_CURVE_NAMES = [
  'SANDTHICK',
  'COLCAPAC',
  'OILSRCAPAC',
  'PERMRETHICK',
  'EOILSRCAPAC',
  'RESERVOIRS',
  'POROSITY',
  'PERMABIL',
  'WATERSAT',
  'CLAYCONT',
  'LITHO',
  'FLUID',
  'PERFO',
  'LITHOCORE',
  'PARTSIZES',
  'TEXTURES',
];

export const TABS_TRANSLATIONS_KEYS = [
  // порядок соответствует списку выше, для перевода используется
  'reservoirIntervals',
  'lithology',
  'shaliness',
  'porosity',
  'waterSaturation',
  'permeability',
  'cutOffs',
  'baseParameters',
  'fluidsType',
  'perforationIntervals',
  'analogueField',
  'depositionalEnvironment',
  'conclusions',
];

export const RESERVOIRS_DEFINITION_ID = '0';
export const LITHOLOGY_DEFINITION_ID = '1';
export const CLAY_CONTENT_CALCULATION_ID = '2';
export const POROSITY_CALCULATION_ID = '3';
export const WATER_SATURATION_CALCULATION_ID = '4';
export const PENETRABILITY_CALCULATION_ID = '5';
export const LIMIT_VALUES_CALCULATION_ID = '6';
export const FLUID_TYPE_DEFINITION_ID = '8';
export const PERFORATION_INTERVALS_DEFINITION_ID = '9';
export const ANALOGUE_FIELD_SELECTION_ID = '10';
export const SEDIMENTATION_ENVIRONMENT_DETERMINATION_ID = '11';

export const TABS_WITH_CALCULATION_FOR_TAB = [0, 2, 3, 4, 5];

export const DIAGRAM_DEFAULT_COLORS: { [key: string]: string } = {
  DEPTH: 'rgba(0, 0, 0, 0.8)',
  GK: '#ff0000',
  SP: '#00ff00',
  IK: '#0000ff',
  DS: '#00e7ff',
  BK: '#ff00f5',
  DT: '#ff8200',
  GZ1: '#00ffff',
  GZ2: '#6d00ff',
  GZ3: '#ff004c',
  GZ4: '#009cff',
  GZ5: '#d2ff00',
  GZ7: '#d2ffd2',
  NKT: '#31b53c',
  NKTD: '#31b5cc',
  MBK: '#000000',
  MGZ: '#ff00f5',
  MPZ: '#ff00f5',
  PZ: '#ff0088',
  NEUT: '#ff00f5',
  PORO: '#000000',
  SW: '#000000',
  PERM: '#000000',
  DEFAULT: '#00ff00',
};

export const DIAGRAM_UNITS: { [key: string]: string } = {
  DEPTH: 'm',
  GK: 'uR/h',
  SP: 'mV',
  IK: 'mS/m',
  DS: 'm',
  BK: 'ohm.m',
  DT: 'us/m',
  GZ1: 'ohm.m',
  GZ2: 'ohm.m',
  GZ3: 'ohm.m',
  GZ4: 'ohm.m',
  GZ5: 'ohm.m',
  GZ7: 'ohm.m',
  NKT: 'm3/m3',
  NKTD: 'u.e.',
  MBK: 'ohm.m',
  MGZ: 'ohm.m',
  MPZ: 'ohm.m',
  PZ: '',
  NEUT: '',
  PORO: '',
  SW: '',
  PERM: '',
};

export const FIELD_SIZE: [number, number] = [
  160,
  700,
];

export const LITOLOGY_SELECT = [
  {
    value: '1',
    label: 'Глина',
    color: '#0f0',
    imageUrl: 'images/clay.png',
  },
  {
    value: '2',
    label: 'Песчаник',
    color: '#ffee00',
    imageUrl: 'images/sand.png',
  },
  {
    value: '3',
    label: 'Уголь',
    color: '#000000',
    imageUrl: 'images/coal.png',
  },
  {
    value: '4',
    label: 'Известняк',
    color: '#3e3ece',
    imageUrl: 'images/limestone.png',
  },
  {
    value: '5',
    label: 'Песчаник глинистый',
    color: '#db9531',
    imageUrl: 'images/clayey-sandstone.png',
  },
  {
    value: '6',
    label: 'Алевролит',
    color: '#a09797',
    imageUrl: 'images/siltstone.png',
  },
];

export const LITHOLOGY_TRANSLATION_KEYS = [
  'shale',
  'sand',
  'coal',
  'limestone',
  'shalySand',
  'siltstone',
];

export const FLUID_TYPE_SELECT = [
  {
    value: '1',
    label: 'Нефть',
    color: '#663300',
    imageUrl: 'images/oil.png',
  },
  {
    value: '2',
    label: 'Вода',
    color: '#0000ff',
    imageUrl: 'images/water.png',
  },
  {
    value: '3',
    label: 'Нефть с водой',
    color: '#663300',
    imageUrl: 'images/oil-with-water.png',
  },
  {
    value: '4',
    label: 'Вода с нефтью',
    color: '#0000ff',
    imageUrl: 'images/water-with-oil.png',
  },
];

export const FLUID_TYPE_SELECT_TRANSLATION_KEYS = [
  'oil',
  'water',
  'oilWithWater',
  'waterWithOil',
];

export const PERFORATION_SELECT = [
  {
    value: '1',
    label: 'Инт. перф.',
    color: '#ffffff',
    imageUrl: 'images/perforation-simbol.png',
  },
];

export const PERFORATION_SELECT_TRANSLATION_KEYS = [
  'perforationInterval',
];

export const STRUCTURES_SELECT = [
  {
    value: '1',
    label: 'Структуры биотурбации',
    altLabel: 'bioturbationStructures',
    imageUrl: 'images/bioturbation-structures.png',
  },
  {
    value: '2',
    label: 'Восходящая рябь',
    altLabel: 'climbingCurrentRipples',
    imageUrl: 'images/climbing-current-ripples.png',
  },
  {
    value: '3',
    label: 'Косая слоистость',
    altLabel: 'crossBedding',
    imageUrl: 'images/cross-bedding.png',
  },
  {
    value: '4',
    label: 'Рябь течений',
    altLabel: 'currentRipples',
    imageUrl: 'images/current-ripples.png',
  },
  {
    value: '5',
    label: 'Двойные глинистые слойки',
    altLabel: 'doubleMudDrapes',
    imageUrl: 'images/double-mud-drapes.png',
  },
  {
    value: '6',
    label: 'Текстуры убегания',
    altLabel: 'escapeStructures',
    imageUrl: 'images/escape-structures.png',
  },
  {
    value: '7',
    label: 'Пламенная текстура',
    altLabel: 'flameStructures',
    imageUrl: 'images/flame-structures.png',
  },
  {
    value: '8',
    label: 'Горизонтальная слоистость',
    altLabel: 'flatLamination',
    imageUrl: 'images/flat-lamination.png',
  },
  {
    value: '9',
    label: 'Флазерная слоистость',
    altLabel: 'flazerBedding',
    imageUrl: 'images/flazer-bedding.png',
  },
  {
    value: '10',
    label: 'Жидкие илы',
    altLabel: 'fluidMuds',
    imageUrl: 'images/fluid-muds.png',
  },
  {
    value: '11',
    label: 'Градационная слоистость',
    altLabel: 'gradatedBedding',
    imageUrl: 'images/gradated-bedding.png',
  },
  {
    value: '12',
    label: 'Слоистость, образованная штормами',
    altLabel: 'hcs',
    imageUrl: 'images/hcs.png',
  },
  {
    value: '13',
    label: 'Тонко-линзовидная слоистость',
    altLabel: 'lenticularBedding',
    imageUrl: 'images/lenticular-bedding.png',
  },
  {
    value: '14',
    label: 'Текстуры деформации в результате оползания / взмучивания осадка',
    altLabel: 'loadCast',
    imageUrl: 'images/load-cast.png',
  },
  {
    value: '15',
    label: 'Текстуры деформации',
    altLabel: 'softSedimentDeformation',
    imageUrl: 'images/soft-sediment-deformation.png',
  },
  {
    value: '16',
    label: 'Троговая',
    altLabel: 'troughCrossBedding',
    imageUrl: 'images/trough-cross-bedding.png',
  },
  {
    value: '17',
    label: 'Волновая рябь',
    altLabel: 'waveRipples',
    imageUrl: 'images/wave-ripples.png',
  },
  {
    value: '18',
    label: 'Волнистая слоистость',
    altLabel: 'wavyLamination',
    imageUrl: 'images/wavy-lamination.png',
  },
];

export const STRUCTURES_SELECT_TRANSLATION_KEYS = [
  'bioturbationStructures',
  'climbingCurrentRipples',
  'crossBedding',
  'currentRipples',
  'doubleMudDrapes',
  'escapeStructures',
  'flameStructures',
  'flatLamination',
  'flazerBedding',
  'fluidMuds',
  'gradatedBedding',
  'hcs',
  'lenticularBedding',
  'loadCast',
  'softSedimentDeformation',
  'troughCrossBedding',
  'waveRipples',
  'wavyLamination',
];

export const MAX_CURVES_AMOUNT_IN_USER_SECTION = 30;
export const MAX_CURVES_AMOUNT_IN_USERFORTAB_SECTION = 10;
export const INITIAL_NUMBER_OF_VISIBLE_CURVES = 6;
