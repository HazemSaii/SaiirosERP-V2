export type IOrganizationTableFilters = {
  organizationName: string,
  approvalStatusDesc: string
};
export type IOrganizationsItem = {
  id?:string,
  managerName:string,
  avatarUrl: string;
  approvalStatusColor: any;
  activeDesc: string;
  activeColor: any;
  createdByUserName: string;
  updatedByUserName: string;
  createdDate: string;
  updatedDate: string;
  organizationId: string,
  langCode: string,
  organizationName: string,
  parentOrgnType: string,
  managerPersonId: number,
  locationId:number,
  approvalStatus:string,
  active: number,
  approvalStatusDesc: string;


}
export type IOrganizationsInfo = {
  
  
  organizationId: string|number,
  organizationKey: string,
  organizationType: string,
  parentOrgId: number,
  managerPersonId: number,
  locationId: number,
  uniqueId?: number,
  approvalStatus: string,
  active: number,
  organizationName:any,
  organizationsTlDTOS: [
    {
      langCode: string,
      organizationName: any
      organizationId: number,
    }
  ], orgnClassificationsDTOS: [
    {
      organizationId: number,
      classificationCode: string,
      active: boolean|number,
      createdByUserName: string,
        updatedByUserName: string,
        createdDate:string,
        updatedDate: string,
    }
  ]

}


export type IOrganizationFilterValue = string | string[];
