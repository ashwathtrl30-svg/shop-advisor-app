import { useApp } from '../context/AppContext';
import { t, TranslationKey, Language } from '../i18n/translations';

export function useTranslation() {
  const { state } = useApp();
  const lang: Language = state.language || 'en';
  
  return {
    t: (key: TranslationKey) => t(key, lang),
    lang,
  };
}
