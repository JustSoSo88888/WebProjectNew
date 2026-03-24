import en from '../language/en'
import pt from '../language/pt'
import {storage} from '~/utils/index'
import config from '~/config'

const $ccLanguage = {
    en,
    pt
}

const langEvent = (text) => {
    let locale = storage.get('locale');
    if (!locale || locale == 'null') {
        locale = config.defaultLang
        storage.set('locale', locale);
    }
    let langs = $ccLanguage[locale];
    let defaultLands = $ccLanguage[config.defaultLang];
    if (!langs) {
        langs = $ccLanguage[config.defaultLang]
    }
    if (langs[text]) {
        return langs[text];
    }
    if (defaultLands[text]) {
        return defaultLands[text];
    }
    return '';
}

export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.config.globalProperties.$lang = langEvent;
    return {
        provide: {
            lang: langEvent
        }
    }
})