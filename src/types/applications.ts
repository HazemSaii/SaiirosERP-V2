export type IApplicationsTableFilters = {
  applicationName: string,
  active: string,
};

export type IApplicationsItem = {
  
  avatarUrl: string;
  createdByUserName: string;
  updatedByUserName: string;
  createdDate: string;
  updatedDate: string;
  applicationCode: string,
  applicationName: string,
  active: number,


  }



export type IApplicationFilterValue = string | string[];
