//i need the apii
export type IJobFamiliesTableFilters = {
  jobFamilyName: string,
  approvalStatus: string,
};

//wa7da 
export type IGetJobFamilie = {
  id: number,
  jobFamilyKey: string,
  uniqueId: number,
  approvalStatus: string,
  active: boolean,
};

export type IJobFamiliesItem = {
  createdBy: string,
  createdDate: string,
  updatedBy: string,
  updatedDate: string,
  createdByUserName: string,
  updatedByUserName: string,
  id: number,
  jobFamilyKey: string,
  uniqueId: string,
  langCode: string,
  jobFamilyName: string,
  active: number,
  userId: number;
  avatarUrl: string;
  approvalStatus: string,
  approvalStatusColor:string;
};

// endpoints >> edit
export type IJobFamiliesInfo = {
  id: number,
  jobFamilyKey: string,
  uniqueId: number,
  active: number,
  approvalStatus: string,
  jobFamilyName: any,
  jobFamiliesTlDTO: [
    {
      langCode: string,
      jobFamilyName: any
    }
  ],
  
};
 

export type IJobFamiliesFilterValue = string | string[];


//------------------------





