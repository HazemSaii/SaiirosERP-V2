export type IJobsTableFilters = {
    JobName: any,
    approvalStatus: string,
}

export type IGetJob ={
  id: number,
  jobKey: string,
  jobFamily: string,
  progressingJobId: number,
  uniqueId: number,
  approvalStatus: string,
  active: number,
}

export type  IJobsItem = {
  jobId:number;
  createdBy: string,
  createdDate: string,
  updatedBy:string ,
  updatedDate: string,
  createdByUserName: string,
  updatedByUserName: string,
  id: number,
  jobFamilyId: number,
  progressingJobId: number,
  jobKey: string,
  langCode: string,
  approvalStatus: string,
  jobName: string,
  familyName: string,
  active: string,
  activeColor: string,
  approvalStatusColor: string
}

export type IJobsInfo={
  id: number,
  jobKey: string,
  jobFamily: string,
  progressingJobId: string,
  uniqueId: number,
  approvalStatus: string,
  active: number,
  jobName: any,
  jobTlDTO: [
    {
      id: number,
      jobName: any,
      langCode: string
    }
  ]
}

export type IJobsFilterValue = string | string[];