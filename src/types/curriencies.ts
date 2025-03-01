export type ICurrenciesTableFilters = {
  currencyName: string,
  currencyCode: string,
  active: string,

}
//wa7da
export type IGetCurrency = {
  createdBy: string,
  createdDate: string,
  updatedBy: string,
  updatedDate:string,
  createdByUserName: string,
  updatedByUserName: string,
  currencyCode: string,
  currencySymbol: string,
  active: number,
  currenciesTlDTOS: [
    {
      currencyCode: string,
      currencyName: string,
      langCode: string
    }
  ]
}

export type ICurrenciesItem = {
   createdBy: string,
   avatarUrl: string,
    createdDate: string,
    updatedBy: string,
    updatedDate: string,
    createdByUserName: string,
    updatedByUserName: string,
    currencyCode: string,
    currencySymbol: string,
    currencyName: string,
    active: number,
    langCode: string
}
//edit
export type ICurrenciesInfo = {
  createdBy: string,
  createdDate: string,
  updatedBy: string,
  updatedDate: string
  createdByUserName: string,
  updatedByUserName: string,
  currencyCode: string,
  currencySymbol: string,
  active: number,
  currencyName: any,
  currenciesTlDTOS: [
    {
      currencyCode: string,
      currencyName: string,
      langCode: string
    }
  ]
}

export type ICurrenciesFilterValue = string | string[];