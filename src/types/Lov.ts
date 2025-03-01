

export type ILOVTableFilters = {
  typeCode: string,
  active: string,

}
//wa7da
export type IGetLOV = {
  createdBy: string,
  createdDate: string,
  updatedBy: string,
  updatedDate: string,
  createdByUserName:string,
  updatedByUserName: string,
  typeCode: string,
  typeDescription: string,
  typeName: string,
  applicationCode: string,
  description: string,
  extendable: number,
  builtIn: number,
  active: number,
  lovValuesDTOS: [
    {
      createdBy: string,
      createdDate: string,
      updatedBy: string,
      updatedDate: string,
      createdByUserName: string,
      updatedByUserName: string,
      valueCode: string,
      valueName: string,
      langCode: string,
      valueOrder: number,
      description: string,
      parentValueCode: string,
      builtIn: number,
      active: number,
      finAllowBudget: number,
      finAllowPost: number,
      finReconsile: number,
      finAccountType: string
    }
  ]
}
//kolo
export type ILOVItem = {
  typeCode:string,
  typeName:string,
  applicationCode:string,
  description:string,
  extendable: number,
  avatarUrl: string,
  active: number,
  typeDescription: string,
  builtIn: number,
  createdBy: string;
  updatedAt: string;
  createdAt: string;
  updatedBy: string;
    }
//edit
export type ILOVInfo = {
  createdBy: string,
  createdDate: string,
  updatedBy: string,
  updatedDate: string,
  createdByUserName: string,
  updatedByUserName: string,
  typeCode: string,
  typeName: string,
  applicationCode:string,
  description: any,
  typeDescription: any,
  extendable: number,
  builtIn: number,
  active: number,
  valueName: any,

  lovValuesDTOS: [
    {
      createdBy: string,
      createdDate: string,
      updatedBy: string,
      updatedDate: string,
      createdByUserName: string,
      updatedByUserName: string,
      valueCode: string,
      valueName: string,
      langCode: string,
      valueOrder:number,
      description: string,
      parentValueCode: string,
      builtIn: number,
      active: number,
      finAllowBudget: number,
      finAllowPost: number,
      finReconsile: number,
      finAccountType: string
    }
  ]
}

export type ILOVFilterValue = string | string[];