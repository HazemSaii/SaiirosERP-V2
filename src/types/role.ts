export type IRoleItem = {
  id: string;
  roleId: string;
  roleName: string;
  applicationCode: string;
  createdByUserName: string;
  updatedByUserName: string;
  createdDate: string;
  updatedDate: string;
  roleCode: string;
  startDate: Date | null;
  endDate: Date | null;
  builtIn: boolean;
  avatarUrl: string;
  status: any;
  statusCode?:any;
  active?:string|number,

  lang: {
    EN: string;
    // AR: string;
  };
};
export type IRoleInfo = {
  id: string;
  applicationCode: string;
  roleCode: string;
  startDate: string;
  endDate: string;
  builtIn: boolean;
  lang: {
    EN: string;
  };
};
export type IRoleFunction = {
  id?: string;
  roleId?: string;
  rolesFunctionDTOS: [
    {
      functionId: string;
      accessType: number;
      operation: string;
    },
  ];
};
export type IRoleFunctionInfo = {
  id?: string;
  functionId: string;
  applicationCode?: string;
  shortName: string;
  langCode: string;
  active: number;
  functionName:string;
  accessType?:number;
  selected?: number;
  status: string ;
};


export type IRoleTableFilters = {
  roleName: string;
  active?: string;

   status?: string;
};

export type IRoleFunctionTableFilters = {
  functionName: string;
};

export type IRoleTableFilterValue = string | string[];

export type IRoleUser = {
  id: string;
  username: string;
  startDate: Date;
  endDate: Date;
  autProvision: boolean;
};
