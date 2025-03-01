export type ITimeZoneItem = {
  timezoneId: string,
    timezoneName: string,
  }
  
export type ILookupItem = {
    valueCode: string;
    valueName: string;
    color?:string;
};

export type ILanguageItem = {
    langCode: string,
    langName: string,
  }
export type IApplicationItem = {
    applicationCode: string;
    applicationName: string;
    langCode: string;
  };
  export type IDuityItem = {
    dutyCode: string,
    dutyName: string,
    langCode: string,
    active: number,
  };
  