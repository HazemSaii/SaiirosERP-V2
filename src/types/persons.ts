export type IPersonsTableFilters = {
  fullName: string,
  firstName?: string[];
  approvalStatus: string,
  };

  export type IPersonsItem = {
    employeeNumber:number;
    fullName:string;
    workEmail:string;
    firstName:string;
    secondName:string;
    lastName:string;
    department:string;
    position:string;
    avatarUrl: string;
    updatedByUserName: string;
    updatedDate: string;
    createdDate: string;
    createdByUserName: string;
    active: number,
    activestatus: string,
    approvalStatus: string,
    activeColor: any,

    }
    // interface IPersonsTranslation {
    //   language: any | null;
    //   langCode: string;
    //   languageName: string;
    // }
  export type IEmploymentInfo = {
    startDate: string | null;
  endDate: string | null;
  actionCode: string;
  approvalStatus: string;
  positionId: string;
  organizationId: string;
  jobId: string;
  gradeId: string;
  locationId: string;
  payrollId: string;
  managerId: string;
  uniqueId: number;
  contractId: number;
  historyId: number;
  historyKey: string;

  }
  export type IContractInfo = {
    startDate: string | null;
  endDate: string | null;
  employmentType: string;
  approvalStatus: string;
  probationLength: string;
  probationUnits: string;
  probationEndDate: string | null;
  employeeNoticeLength: string;
  employerNoticeLength: string;
  employerNoticeUnits: string;
  employeeNoticeUnits: string;
  finalProcessDate: string | null;
  reason: string;
  notes: string;
  legalEntityId: number;
  contractKey: number;
  uniqueId: number;
  contractId: number;

  }
  export type IFamilyInfo = {
    relationshipType: string|null;
    parentPersonId: string;
    personId: string;
    approvalStatus: string;
    firstName: string;
    secondName: string;
    thirdName: string;
    lastName: string;
    alternativeFirstName: string;
    alternativeSecondName: string;
    alternativeThirdName: string;
    alternativeLastName: string;
    dateOfBirth: string | null;
    age: number | null;
    maritalStatus: string;
    gender: string;
    religion: string;
    nationalityCode: string;
    registeredDisabled: number;
    highestEducationLevel: string;
    passportNumber: string;
    nationalId: string;
    personalEmail: string;
    personalMobile: string;
    uniqueId: number;

  }
  export type IPesonalInfo = {
      employeeNumber: number;
      approvalStatus: string;
      firstName: string;
      secondName: string;
      thirdName: string;
      lastName: string;
      alternativeFirstName: string;
      alternativeSecondName: string;
      alternativeThirdName: string;
      alternativeLastName: string;
      dateOfBirth: string;
      gender: string;
      religion: string;
      maritalStatus: string;
      registeredDisabled: number;
      highestEducationLevel: string;
      workEmail: string;
      personalEmail: string;
      passportNumber: string;
      workMobile: string;
      personalMobile: string;
      nationalId: string;
      nationalityCode:string;
      uniqueId: number;
      changeable?: any;

  }

  export type IPersonsFilterValue = string | string[];

  export interface IPersonInfo {
    createdBy: number;
    createdDate: string; // ISO 8601 format
    updatedBy: number;
    updatedDate: string; // ISO 8601 format
    createdByUserName: string;
    updatedByUserName: string;
    personId: number;
    employeeNumber: number;
    firstName: string;
    secondName: string;
    thirdName: string;
    lastName: string;
    dateOfBirth: string; // ISO 8601 format
    gender: string;
    nationalityCode: string;
    maritalStatus: string;
    registeredDisabled: number;
    workEmail: string;
    personalEmail: string;
    workMobile: string;
    personalMobile: string;
    highestEducationLevel: string;
    alternativeFirstName: string;
    alternativeSecondName: string;
    alternativeThirdName: string;
    alternativeLastName: string;
    personPhoto: string;
    nationalId: string;
    passportNumber: string;
    parentPersonId: number;
    relationshipType: string;
    uniqueId: number;
    approvalStatus: string;
    fullName: string;
    setNullForContracts: boolean;
    emplContractDTOS: IContractInfo[];
    emplContractHistoryDTOS: IEmploymentInfo[];
    familyDTOS: IFamilyInfo[];
    saveOrSubmit: string;
    religion: string;
    changeable?: any;
  }

  export interface familyDTOS {
    // createdBy: number;
    // createdDate: string; // ISO 8601 format
    // updatedBy: number;
    // updatedDate: string; // ISO 8601 format
    // createdByUserName: string;
    // updatedByUserName: string;
    personId: number;
    employeeNumber: number;
    firstName: string;
    secondName: string;
    thirdName: string;
    lastName: string;
    dateOfBirth: string; // ISO 8601 format
    gender: string;
    nationalityCode: string;
    maritalStatus: string;
    registeredDisabled: number;
    workEmail: string;
    personalEmail: string;
    workMobile: string;
    personalMobile: string;
    highestEducationLevel: string;
    alternativeFirstName: string;
    alternativeSecondName: string;
    alternativeThirdName: string;
    alternativeLastName: string;
    personPhoto: string;
    nationalId: string;
    passportNumber: string;
    parentPersonId: number;
    relationshipType: string;
    uniqueId: number;
    approvalStatus: string;
    fullName: string;
    setNullForContracts: boolean;
    emplContractDTOS: EmploymentContract[];
    emplContractHistoryDTOS: EmploymentContractHistory[];
    saveOrSubmit: string;
    religion: string;
  }


  export interface EmploymentContract {
    // createdBy: number;
    // createdDate: string; // ISO 8601 format
    // updatedBy: number;
    // updatedDate: string; // ISO 8601 format
    // createdByUserName: string;
    // updatedByUserName: string;
    contractId: number;
    contractKey: string;
    personId: number;
    legalEntityId: number;
    startDate: string; // ISO 8601 format
    endDate: string; // ISO 8601 format
    finalProcessDate: string; // ISO 8601 format
    reason: string;
    notes: string;
    probationLength: number;
    probationUnits: string;
    probationEndDate: string; // ISO 8601 format
    employeeNoticeLength: number;
    employeeNoticeUnits: string;
    employerNoticeLength: number;
    employerNoticeUnits: string;
    uniqueId: number;
    approvalStatus: string;
    employmentType: string;
    saveOrSubmit: string;
  }

  export interface EmploymentContractHistory {
    // createdBy: number;
    // createdDate: string; // ISO 8601 format
    // updatedBy: number;
    // updatedDate: string; // ISO 8601 format
    // createdByUserName: string;
    // updatedByUserName: string;
    historyId: number;
    historyKey: string;
    personId: number;
    contractId: number;
    startDate: string; // ISO 8601 format
    endDate: string; // ISO 8601 format
    positionId: number;
    organizationId: number;
    jobId: number;
    gradeId: number;
    locationId: number;
    payrollId: number;
    managerId: number;
    actionCode: string;
    uniqueId: number;
    approvalStatus: string;
    saveOrSubmit: string;
  }