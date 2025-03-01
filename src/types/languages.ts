export type ILanguagesTableFilters = {
  langName: string,
  active: string
};

export type ILanguagesItem = {
  
  langName: string;
  defaultLanguage: number;
  avatarUrl: string;
  updatedByUserName: string;
  createdDate: string;
  createdByUserName: string;
  updatedDate: string;
  languageId: string,
  languagecode: string,
  Language: string,
  langCode: string,
  approvalStatus: string,
  active: number,
  activestatus: string,
  activeColor: any,

    
    
  }
  interface ILanguageTranslation {
    language: any | null;
    langCode: string;
    languageName: string;
  }
export type ILanguagesInfo = {
  langCode: string,
  defaultLanguage: number;
  langName: string;
  languageName: any;
  activestatus: string;
  active: number;
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;
  activeColor: string;
  // // 
  languageTlDTOS?: ILanguageTranslation[];
  defaultLang?:number;

}

export type ILanguageFilterValue = string | string[];
