export type IGradesTableFilters = {
  gradeName: string,
  approvalStatus: string
}

//wa7da 
export type IGetGrade = {
 gradeId: number,
  active: number,
  approvalStatus: string,
  gradeTlDTOS: [
    {
      gradeName: string,
      langCode: string
    }
  ],
  saveOrSubmit: string
}

export type IGradesItem = {
  createdBy: string,
  createdDate: string,
  updatedBy: string,
  updatedDate: string,
  createdByUserName: string,
  updatedByUserName: string,
  gradeId: number,
  active: number,
  approvalStatus: string,
  langCode: string,
  activeColor: string,
  approvalStatusColor: string
  gradeName: string
  avatarUrl: string
  status: string

}

export type IGradesInfo = {
  id?:string,
  gradeId: number,
  active: number,
  uniqueId:any,
  approvalStatus: string,
  gradeName:any,
  gradeTlDTOS: [
    {
      gradeName: string,
      langCode: string
    }
  ],
  saveOrSubmit: string
}

export type IGradesFilterValue = string | string[];