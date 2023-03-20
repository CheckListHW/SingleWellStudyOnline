import { Lang } from 'shared/types/app';

import { buildTranslationKeys } from './helpers/buildTranslationKeys';
import { ru } from './locales';

export const FALLBACK_LANGUAGE: Lang = 'ru-RU';
export const tKeys = buildTranslationKeys(ru);
