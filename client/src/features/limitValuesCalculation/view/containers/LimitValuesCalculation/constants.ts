const FIELDS_HEADERS = [
  'Граничное значение глинистости',
  'Граничное значение пористости',
  'Граничное значение водонасыщенности',
  'Граничное значение проницаемости',
];

const FIELDS_HEADERS_TRANSLATION_KEYS = [
  'shaleCutOff',
  'porosityCutOff',
  'waterSaturationCutOff',
  'permeabilityCutOff',
];

const CURVES_NAMES = [
  'Глинистость',
  'Мп',
  'Пористость',
  'Мк',
  'Водонасыщ-cть',
  'Мнк',
  'Проницаемость',
  'Мпк',
  'Мэнк',
];

const CURVES_NAMES_TRANSLATION_KEYS = [
  'shaliness',
  'gs',
  'porosity',
  'nt',
  'waterSaturation',
  'gop',
  'permeability',
  'gp',
  'np',
];

const THICKNESSES_NAMES = [
  'Мощность песчанника (МП), м',
  'Мощность коллектора (МК), м',
  'Мощность нефтенасыщенного коллектора (МНК), м',
  'Мощность проницаемого коллектора (МПК), м',
  'Мощность эффективного нефтенасыщенного коллектора (МЭНК, автоматически, на основе четырех предыдущих), м',
  'Общая мощность (автоматически на основе выделенных ранее коллекторов), м',
];

const THICKNESSES_NAMES_TRANSLATION_KEYS = [
  'grossSand',
  'netThickness',
  'grossOilPay',
  'grossPay',
  'netPay',
  'grossInterval',
];

const LINES_COLORS = [
  '#c44d29',
  '#f79e02',
  '#f00',
  '#f79e02',
  '#00f',
  '#f79e02',
  '#000',
  '#f79e02',
  '#f79e02',
];

const DATA_STEP = 0.1;

export { FIELDS_HEADERS, CURVES_NAMES, DATA_STEP, THICKNESSES_NAMES,
  LINES_COLORS, CURVES_NAMES_TRANSLATION_KEYS, FIELDS_HEADERS_TRANSLATION_KEYS,
  THICKNESSES_NAMES_TRANSLATION_KEYS };
