import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import mal from './mal.json';


i18next.use(initReactI18next).init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
        en: en,
        mal: mal,
    },
    interpolation: {
        escapeValue: false // react already safes from xss
    },
    react:{
        useSuspense:false,
    }
});

export default i18next;
