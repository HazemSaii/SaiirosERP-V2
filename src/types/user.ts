// import { CustomFile } from 'src/components/upload';

// ----------------------------------------------------------------------

export type IUserTableFilterValue = string | string[];

export type IUserTableFilters = {
  userName: string;
  userEmail?: any;
  status: string | number;
};

// ----------------------------------------------------------------------

export type IUserSocialLink = {
  facebook: string;
  instagram: string;
  linkedin: string;
  twitter: string;
};

export type IUserProfileCover = {
  // ?Hire Person dont need  name,role (For now)
  name?: string;
  role?: string;
  coverUrl: string;
  avatarUrl: string;
};

export type IUserProfile = {
  id: string;
  role: string;
  quote: string;
  email: string;
  school: string;
  country: string;
  company: string;
  totalFollowers: number;
  totalFollowing: number;
  socialLinks: IUserSocialLink;
};

export type IUserProfileFollower = {
  id: string;
  name: string;
  country: string;
  avatarUrl: string;
};

export type IUserProfileGallery = {
  id: string;
  title: string;
  imageUrl: string;
  postedAt: Date;
};

export type IUserProfileFriend = {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
};

export type IUserProfilePost = {
  id: string;
  media: string;
  message: string;
  createdAt: Date;
  personLikes: {
    name: string;
    avatarUrl: string;
  }[];
  comments: {
    id: string;
    message: string;
    createdAt: Date;
    author: {
      id: string;
      name: string;
      avatarUrl: string;
    };
  }[];
};

export type IUserCard = {
  id: string;
  name: string;
  role: string;
  coverUrl: string;
  avatarUrl: string;
  totalPosts: number;
  totalFollowers: number;
  totalFollowing: number;
};

export type IUserItem = {
  id: string;
  userId: string;
  avatarUrl: string;
  createdByUserName: string;
  updatedByUserName: string;
  createdDate: string;
  updatedDate: string;
  userName: string;
  personId: number;
  supplierId: number;
  userEmail: string;
  startDate: string;
  endDate: string;
  locked: boolean;
  builtIn: boolean;
  numberOfAttempt: boolean;
  lastAttempted: number;
  loggerEnabled: number;
  defaultLangCode: string;
  defaultDateFormat: string;
  defaultTimezoneId: boolean;
  startPage: number;
  receiveEmail: number;
  mustChangePassword: number;
  passwordExpireDate: number;
  status: string;
  password: string;
  confirmPassword: string;
  statusCode?: any;
  selected?: number;
};
export type IUserInfo = {
  userName: string;
  userEmail: string;
  personId: any;
  supplierId: any;
  startDate: string | null;
  endDate: string | null;
  password: string;
  confirmPassword: string;
  locked: number;
  builtIn: number;
  loggerEnabled: number;
  status: string;
};
export type IUserPreferences = {
  defaultLangCode: string;
  defaultTimezoneId: number;
  startPage: any;
  defaultDateFormat: string;
  receiveEmail: number;
};

export type IUserDataAccess = {
  personScope: number;
  person: string[];
  manager?: string | null;
  personHierarchy: boolean;
  perTop: boolean;
  organizationScope: number;
  organization: string[];
  organizationManager?: string | null;
  organizationHierarchy: boolean;
  orgTop: boolean;
  payrollScope: number;
  payroll: string[];
  locationScope: number;
  location: string[];
  ledgerScope: number;
  ledger: string[];
  legalEntityScope: number;
  legalEntity: string[];
  businessUnitScope: number;
  businessUnit: string[];
  accountScope: number;
  account: string[];
};

// export type IUserAccount = {
//   email: string;
//   isPublic: boolean;
//   displayName: string;
//   city: string | null;
//   state: string | null;
//   about: string | null;
//   country: string | null;
//   address: string | null;
//   zipCode: string | null;
//   phoneNumber: string | null;
//   photoURL: CustomFile | string | null;
// };

export type IUserAccountBillingHistory = {
  id: string;
  price: number;
  createdAt: Date;
  invoiceNumber: string;
};

export type IUserAccountChangePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};
