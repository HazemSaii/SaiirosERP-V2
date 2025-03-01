export type IApprovalTableFiltersValue = string | string[];

export type IApprovalTableFilters = {
  groupName: string;
  groupType: string;
  activeName: string;
};

//------------------------

export type IGetApproval = {
  groupName: string;
  groupType: string;
  active: number;
};

export type IApprovalItem = {
  activeName: string;
  groupTypeDisplay: string;
  createdBy: string;
  createdDate: string;
  updatedBy: string;
  updatedDate: string;
  createdByUserName: string;
  updatedByUserName: string;
  avatarUrl: string;
  groupId: number;
  groupName: string;
  groupType: string;
  dutyType: boolean;
  dutyOf: string;
  groupQuery: string;
  userId: number;
  active: number;
  builtIn: boolean;
};


// endpoints >> edit
export type IApprovalInfo = {
  groupId: number;
  groupName: string;
  groupType: string;
  dutyCode: string;
  dutyOf: string;
  groupQuery: string;
  userId: any;
  active: number;
  builtIn: boolean;
};
