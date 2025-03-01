//i need the apii
export type IPositionsTableFilters = {
    positionName: string,
    approvalStatus: string,
  };
  
  //wa7da 
  export type IGetPosition = {
    id: number,
    positionKey: string,
    uniqueId: number,
    approvalStatus: string,
    active: boolean,
  };
  
  export type IPositionsInfo = {
    id: string,
        positionName: any,
        uniqueId: any,
        approvalStatus: string
        locationId:string,
        organizationsId:string,
        jobId:string,
        headcounts:string,
        aplicableGrades: any, 
        hrPositionsTlDTOS: [
          {
            langCode: string,
            positionName: any
          }
        ],
        hrPositionGradeDTOS:[
          {
            positionId: any,
            gradeId: number,
            active: number
          }
        ]
        active: number,
  };
  export type IPositionsItem = {
    createdBy: string,
    createdDate: string,
    updatedBy: string,
    updatedDate: string,
    createdByUserName: string,
    updatedByUserName: string,
    id: number,
    positionName: string,
    organization: string,
    job: string,
    headcounts: number,
    status: number,
    approvalStatus: string,
    approvalStatusColor:string;
  };
  export type IPositionsFilterValue = string | string[];