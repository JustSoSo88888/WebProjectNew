import en from '../language/en'
import pt from '../language/pt'
import {storage} from '~/utils/index'

const $ccLanguage = {
    en,
    pt
}

const langEvent = (text) => {
    let locale = storage.get('locale');
    if (!locale || locale == 'null') {
        locale = 'pt'
        storage.set('locale', locale);
    }
    let langs = $ccLanguage[locale];
    let enLands = $ccLanguage['pt'];
    if (!langs) {
        langs = $ccLanguage['pt']
    }
    if (langs[text]) {
        return langs[text];
    }
    if (enLands[text]) {
        return enLands[text];
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