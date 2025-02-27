export type ITransacionsTableFiltersValue = string | string[];

export type ITransacionsTableFilters = {
  processCode:string,
  status: string,
  // actionCode: string,
}

export type IGetTranaction = {
  processCode: string,
  status: string,
  actionCode: string,
  // transactionId: number,
  // transactionKey: number,
  // transactionPayload: string,
  // notes: string,
  // uniqueId: number
}

export type ITransactionsItem = {
  createdBy: string,
  createdDate: string,
  updatedBy: 0,
  updatedDate: string,
  createdByUserName: string,
  updatedByUserName: string,
  transactionId: number,
  transactionKey: number,
  processCode: string,
  transactionPayload: string,
  status: string|number,
  actionCode: string,
  notes: string,
  uniqueId: number,
}

export type Definitions ={
  AR: string;
  EN: string;
}

export type ITransactionInfo = {
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
