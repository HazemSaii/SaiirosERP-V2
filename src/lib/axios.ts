import type { AxiosRequestConfig } from 'axios';

import axios from 'axios';

import { CONFIG } from 'src/global-config';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: CONFIG.serverUrl });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong!')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  try {
    const [url, config] = Array.isArray(args) ? args : [args];

    const res = await axiosInstance.get(url, { ...config });

    return res.data;
  } catch (error) {
    console.error('Failed to fetch:', error);
    throw error;
  }
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: { me: '/auth/me', signIn: '/auth/login', signUp: '/api/auth/sign-up' },
  mail: { list: '/api/mail/list', details: '/api/mail/details', labels: '/api/mail/labels' },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
  user: {
    list: '/user/getAllUser?pageNo=1&pageSize=1000000&orderBy=userName&asc=true',
    details: '/user/getUser',
    create: '/user/addUser',
    validate: '/user/validateUser',
    getRolesByUser: 'user/getRolesByUser',
    addUserRoles: '/user/addRolesForUser',
    editUserRoles: '/user/editRolesForUser',
    addUserDataAccess: '/userDataAccess/addUser',
    updateUserDataAccess: '/userDataAccess/updateUser',
    getDataAccessByUser: '/userDataAccess/getDataAccessByUser',
    edit: '/user/editUser',
    delete: '/user/deleteUser',
    resetPassword: '/resetPassword/updatePassword',
  },
  role: {
    list: '/role/getAllRoles?pageNo=1&pageSize=1000',
    allFunctions: '/role/getAllFunctions',
    details: '/role/getRole',
    create: '/role/addRole',
    edit: '/role/editRole',
    delete: '/role/deleteRole',
    addRoleUsers: '/role/addUsersRoles',
    getUsersByRole: '/role/getUsersForRole',
    addFunctionForRole: '/role/addFunctionForRole',
    getFunctionForRole: '/role/getFunctionForRole',
  },
  person: {
    list: '/person/getAllPersons',
    details: '/person/getPerson',
    create: '/person/addPerson',
    correct: '/person/editPerson',
    update: '/person/updatePerson',
    Approved:
      '/person/getAllPersonsByApprovalStatus?pageNo=1&pageSize=1000000&orderBy=firstName&asc=true',
  },
  shared: {
    getAllLanguages: '/languages/getAllLanguages',
    getAllTimeZones:
      '/timezones/getAllTimezones?pageNo=1&pageSize=1000000&orderBy=timezoneName&asc=true',
    legalEntities:
      '/shared/getAllLegalEntities?pageNo=1&pageSize=1000000&orderBy=legalEntityName&asc=true',
    businessUnites:
      '/shared/getAllBusinessUnits?pageNo=1&pageSize=1000000&orderBy=businessUnitName&asc=true',
    payrolls: '/shared/getAllPayrolls?pageNo=1&pageSize=1000000&orderBy=payrollName&asc=true',
    // getAllLookup:'/listOfValues/getAllLookup',
    // getAllApplications: '/applications/getAllApplications',
    // getAllDuties: '/duties/getAllDuties?pageNo=1&pageSize=1000000',
    // getAllCountries: '/countries/getAllCountries',
    // getAllCurrencies:'/currencies/getAllCurrencies',
    getMenues: '/menu/findAllMenusSplit',
  },
  resetPassword: {
    updatePasswordPolicy: '/resetPassword/updatePasswordPolicy',
    getPasswordPolicy: '/resetPassword/getPasswordPolicy',
  },
  Processes: {
    list: '/processes/getAllProcess?pageNo=1&pageSize=1000000&orderBy=processName&asc=true',
    shortList: '/processes/getAllProcessList',
    details: '/processes/getProcess',
    edit: '/processes/editProcess',
  },
  approvalGroups: {
    list: '/approverGroup/getAllApprovers?pageNo=1&pageSize=1000000&orderBy=groupName&asc=true',
    edit: '/approverGroup/editApproverGroup',
    create: '/approverGroup/addApproverGroup',
    delete: '/approverGroup/deleteApproverGroup',
    details: '/approverGroup/getApproverGroup',
  },
  rules: {
    list: '/rules/getAllRules?pageNo=1&pageSize=1000000&orderBy=ruleName&asc=true',
    create: '/rules/addWfRule',
    details: '/rules/getRule',
    edit: '/rules/editWfRule',
    delete: '/rules/deleteRule',
    addRuleConditions: '/rules/mangeRuleConditions',
    addRuleApprovers: '/rules/mangeRuleApprover',
    manageRuleConditions: '/rules/mangeRuleConditions',
    manageRuleApprovers: '/rules/mangeRuleApprover',
  },
  transaction: {
    list: 'transactions/getTransactions?pageNo=1&pageSize=1000000&orderBy=processCode&asc=true',
    details: '/transactions/getTransaction',
  },
  delegations: {
    list: '/Delegation/getAllDelegation?pageNo=1&pageSize=1000000&orderBy=fromUserName&asc=true',
    details: '/Delegation/getDelegation',
    create: '/Delegation/addDelegation',
    edit: '/Delegation/editDelegation',
    delete: '/Delegation/deleteDelegation',
  },
  jobFamilies: {
    list: '/jobFamilies/getALLJobFamilies?pageNo=1&pageSize=1000000&orderBy=jobFamilyName&asc=true',
    details: '/jobFamilies/getJobFamily',
    create: '/jobFamilies/addJobFamily',
    edit: '/jobFamilies/editJobFamily',
    delete: '/jobFamilies/deleteJobFamily',
    Approved:
      '/jobFamilies/getAllJobFamiliesByApprovalStatus?pageNo=1&pageSize=1000000&orderBy=jobFamilyName&asc=true&approvalStatus=APPROVED',
  },
  jobs: {
    list: '/job/getAllJobs?pageNo=1&pageSize=1000000&orderBy=jobName&asc=true',
    details: '/job/getJob',
    create: '/job/addJob',
    edit: '/job/editJob',
    delete: '/job/deleteJob',
    Approved:
      '/job/getAllJobsByApprovalStatus?pageNo=1&pageSize=1000000&orderBy=jobName&asc=true&approvalStatus=APPROVED',
  },
  Grades: {
    list: '/grades/getAllGrades?pageNo=1&pageSize=1000000&orderBy=gradeName&asc=true',
    details: '/grades/getGrade',
    create: '/grades/addGrade',
    edit: '/grades/editGrade',
    delete: '/grades/deleteGrade',
    Approved:
      '/grades/getAllGradesByApprovalStatus?pageNo=1&pageSize=1000000&orderBy=gradeName&asc=true&approvalStatus=APPROVED',
  },
  location: {
    list: '/location/getAllLocations?pageNo=1&pageSize=1000000&orderBy=locationName&asc=true',
    details: '/location/getLocation',
    create: '/location/addLocation',
    edit: '/location/editLocation',
    delete: '/location/deleteLocation',
    validate: '/location/validateLocation',
    Approved:
      '/location/getAllLocationByApprovalStatus?pageNo=1&pageSize=1000000&orderBy=locationName&asc=true',
  },
  organization: {
    list: '/organization/getAllOrganization?pageNo=1&pageSize=1000000&orderBy=organizationName&asc=true',
    details: '/organization/getOrganization',
    create: '/organization/addOrganization',
    edit: '/organization/editOrganization',
    delete: '/organization/deleteOrganization',
    Approved:
      '/organization/getAllOrganizationsByApprovalStatus?pageNo=1&pageSize=1000000&orderBy=organizationName&asc=true&approvalStatus=APPROVED',
  },
  positions: {
    list: '/positions/getAllPosition?pageNo=1&pageSize=1000000&orderBy=positionName&asc=true',
    details: '/positions/getPosition',
    create: '/positions/addPosition',
    edit: '/positions/editPosition',
    delete: '/positions/deletePosition',
    Approved:
      '/positions/getAllPositionsByApprovalStatus?pageNo=1&pageSize=1000000&orderBy=positionName&asc=true&approvalStatus=APPROVED',
  },
  gradeRates: {
    list: '/gradeRates/getAllGradeRates?pageNo=1&pageSize=1000000&orderBy=gradeRateName&asc=true',
    details: '/gradeRates/getGradeRate',
    create: '/gradeRates/addGradeRate',
    edit: '/gradeRates/editGradeRate',
    delete: '/gradeRates/deleteGradeRate',
    Approved:
      '/gradeRates/getAllGradeRatesByApprovalStatus?pageNo=1&pageSize=1000000&orderBy=gradeRateName&asc=true',
  },
  countries: {
    list: '/countries/getAllCountries?pageNo=1&pageSize=1000000&orderBy=countryName&asc=true',
    details: '/countries/getCountry',
    create: '/countries/addCountry',
    edit: '/countries/editCountry',
    delete: '/countries/deleteCountry',
  },
  currencies: {
    list: '/currencies/getAllCurrencies?pageNo=1&pageSize=1000000&orderBy=currencyName&asc=true',
    details: '/currencies/getCurrency',
    create: '/currencies/addCurrency',
    edit: '/currencies/editCurrency',
    delete: '/currencies/deleteCurrency',
  },
  listOfValues: {
    getAllLookup: '/listOfValues/getAllLookup',
    list: '/listOfValues/getDistinctLookup',
    details: '/listOfValues/getLov',
    create: '/listOfValues/addLov',
    edit: '/listOfValues/editLov',
    delete: '/listOfValues/deleteLov',
  },
  duties: {
    list: '/duties/getAllDuties?pageNo=1&pageSize=1000000&orderBy=dutyName&asc=true',
    details: '/duties/getDuty',
    create: '/duties/addDuty',
    edit: '/duties/editDuty',
    delete: '/duties/deleteDuty',
  },
  userDuties: {
    list: '/userDuties/getAllUserDuties?pageNo=1&pageSize=1000000&orderBy=userName&asc=true',
    details: '/userDuties/getUserDuty',
    create: '/userDuties/addUserDuty',
    edit: '/userDuties/editUserDuty',
    delete: '/userDuties/deleteUserDuty',
    Approved:
      '/userDuties/getAllUserDutiesByApprovalStatus?pageNo=1&pageSize=1000000&orderBy=userName&asc=true&approvalStatus=APPROVED',
  },
  languages: {
    list: '/languages/getAllLanguages',
    details: '/languages/getLanguage',
    create: '/languages/addLanguage',
    edit: '/languages/editLanguage',
    delete: '/languages/deleteLanguage',
  },
  timezones: {
    create: '/timezones/addTimezone',
    details: '/timezones/getTimezone',
    edit: '/timezones/editTimezone',
    delete: '/timezones/deleteTimezone',
  },
  applications: {
    list: '/applications/getAllApplications?pageNo=1&pageSize=1000000&orderBy=applicationName&asc=true',
  },
  contract: {
    terminateContract: '/contract/terminateContract',
    resignEmployee: '/contract/resignEmployee',
    updateContract: '/contract/updateContract',
    correctContract: '/contract/editContract',
    getContractsByPersonId: '/contract/getContractsByPersonId',
  },
  family: {
    Add: '/family/addFamily',
    edit: '/family/editFamily',
    details: '/family/getFamilyByPersonId',
  },
  emplHistory: {
    updateHistory: '/history/updateHistory',
    correctHistory: '/history/editHistory',
    getContractHistoriesByPersonId: '/history/getContractHistoriesByPersonId',
  },
  suppliers: {
    list: '/suppliers/getAllSuppliers',
  },
  ledgers: {
    list: '/ledgers/getAllLedgers',
  },
  accounts: {
    list: '/accounts/getAllAccounts',
  },
};
