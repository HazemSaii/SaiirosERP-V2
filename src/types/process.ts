export type IProcessesTableFilters = {
  processName: string;
  byPass: string;
};
export type IProcessesItem = {
  processCode:string;
  applicationCode:string;
  processName:string,
  approvalTypeName:number,
  archiveMonths: number,
  addHocAllowed:boolean , 
  byPass: number, 
  createdDate:string,
  createdByUserName: string,
  updatedDate: string,
  updatedByUserName: string,
  avatarUrl?: string;
  prohibitSelfApprover: boolean ,// 1=>yes 0=>No
  Subject_Definition: {
    AR:string,
    EN:string,
    }, 
    Body_Definition:{
    AR:string,
    EN:string, 
    },
    Secured_Subject_Definition: {
    AR:string,
    EN:string,
    },
    Secured_Body_Definition:{
    AR:string, 
    EN:string, 
    },
}
export type Definitions ={
  AR: string;
  EN: string;
}

export type IProcessesInfo = {
  processCode?: string,
  processName:string,
  approvalTypeName: string, 
  applicationCode: string,
  baseTable: string,
  processInitiationAction :string,
  processOutcomeAction: string,
  payloadBuilderApi: string,
  duplicateApprover: string, 
    // 1=> all , 2=> first , 3=> last
    prohibitSelfApprover: number ,// 1=>yes 0=>No
    archiveMonths: number,
    addHocAllowed: number , // 1=>yes 0=>No
    byPass: number, // 1=>yes 0=>No
    subjectDef?:string,
    bodyDef?:string,
    securedsubjectDef?:string,
    securedBodyDef?:string
    wfProcessesTls: [
            {
              processCode:string
              langCode: string,
              approvalType:string,
              approvalTypeName: string,
              processName: string,
              subjectDef: string,
              bodyDef: string,
              securedBodyDef: string
            }
          ]
          ,
          fyiDefaultBodyDef?: Definitions;
  fyiSecuredBodyDef?: Definitions;
  fyaDefaultBodyDefinition?: Definitions;
  fyaSecuredBodyDefinition?: Definitions;
  fyiDefaultSubjectDef?: Definitions;
  fyiSecuredSubjectDef?: Definitions;
  fyaDefaultSubjectDefinition?: Definitions;
  fyaSecuredSubjectDefinition?: Definitions;
          
    
    
}


export type IProcessesTableFilterValue = string | string[];
