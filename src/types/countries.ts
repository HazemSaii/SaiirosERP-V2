export type ICountriesTableFilters = {
  countryName: string,
  countryCode: string,
  active: string,

}

export type IGetCountry = {
  createdBy: string,
  createdDate: string,
  updatedBy: string,
  updatedDate: string,
  createdByUserName: string,
  updatedByUserName: string,
  countryCode: string,
  active: number,
  countriesTlDTOS: [
    {
      countryCode: string,
      langCode: string,
      countryName: string,
      nationalNameMale: string,
      nationalNameFemale: string
    }
  ]
}

export type ICountriesItem = {
    createdBy: string,
    avatarUrl: string,
    createdDate:string,
    updatedBy: string,
    updatedDate: string,
    createdByUserName: string,
    updatedByUserName: string,
    countryCode: string,
    langCode: string,
    countryName: string,
    active: number

}
//edit
export type ICountriesInfo = {
 createdBy: string,
  createdDate: string,
  updatedBy: string,
  updatedDate: string,
  createdByUserName: string,
  updatedByUserName: string,
  countryCode:string,
  active: number,
  countryName:any,
  countriesTlDTOS: [
    {
      countryCode: string,
      langCode: string,
      countryName: string,
      nationalNameMale: string,
      nationalNameFemale: string
    }
  ]
}

export type ICountriesFilterValue = string | string[];