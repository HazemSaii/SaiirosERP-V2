export type ILocationsTableFilters = {
  locationName: string,
  approvalStatus: string
};

export type ILocationsItem = {
  
  avatarUrl: string;
  createdByUserName: string;
  updatedByUserName: string;
  createdDate: string;
  updatedDate: string;
  locationId: string,
  langCode: string,
  approvalStatus: string,
  countryCode: string,
  locationName: string,
  countryName:string,
  active: string,
  approvalStatusColor: any,
  activeColor: any,

    
    
  }
export type ILocationsInfo = {
  
  
    locationId: string|number,
    locationKey: string,
    addressLine1: string,
    addressLine2: string,
    poBox: string,
    countryCode: string,
    city: string,
    uniqueId: number,
    approvalStatus: string,
    active: number,
    locationTlDTOS: [
      {
        location: null,
        langCode: string,
        locationName: any
      }
    ]
  }


export type ILocationFilterValue = string | string[];
