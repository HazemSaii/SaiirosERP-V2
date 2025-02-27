export type IDutiesTableFilters = {
  dutyName: string,
  active: string,
  };
  
  export type IDutiesItem = {
    
    avatarUrl: string;
    createdByUserName: string;
    updatedDate: string;
    createdDate: string;
    updatedByUserName: string;
    dutyCode: string,
    dutyName: string,
    langCode: string,
    active: number,
    builtIn: number,

    }
    interface IDutiesTranslation {
      dutyCode: string;
      dutyName: string;
      langCode: string;
    }
  export type IDutiesInfo = {
    
    dutyCode: string,
    dutyName: any,
    builtIn: number,
    active: number,
    dutiesTlDTOS: IDutiesTranslation[];
  
  }
  
  export type IDutyFilterValue = string | string[];
  