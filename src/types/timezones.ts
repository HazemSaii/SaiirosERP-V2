export type ITimeZoneItem = {
    avatarUrl: string;
    createdByUserName: string;
    updatedByUserName: string;
    createdDate: string;
    updatedDate: string;
    timezoneId: string,
    timezoneName: string,
    globalTimezoneName: string,
    standardTimezoneCode: string,
    gmtDeviationHours: string,
    active:number|boolean;
}
export type ITimeZoneInfo = {
    createdBy: string,
    createdDate: string,
    updatedBy: string,
    updatedDate: string
    createdByUserName: string,
    updatedByUserName: string,
    timezoneId: string,
    timezoneName: any,
    globalTimezoneName: string,
    standardTimezoneCode: string,
    gmtDeviationHours: string,
    active: number,
    timeZonesTlDTOS: [
      {
        timezoneId: string,
        langCode: string,
        timezoneName: string
      }
    ]
  }
export type ITimeZoneTableFilters = {
    timezoneName: string,
    active: string
};


export type ITimeZoneFilterValue = string | string[];