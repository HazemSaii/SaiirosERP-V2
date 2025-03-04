import { kebabCase } from 'es-toolkit';

import { _id, _postTitles } from 'src/_mock/assets';

// ----------------------------------------------------------------------

const MOCK_ID = _id[1];

const MOCK_TITLE = _postTitles[2];

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  SECURITY: '/security',
  WORKFLOW: '/workflow',
  HUMAN_RESOURCES: '/hr',
  Settings: '/settings',
};

// ----------------------------------------------------------------------

export const paths = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  pricing: '/pricing',
  payment: '/payment',
  about: '/about-us',
  contact: '/contact-us',
  faqs: '/faqs',
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',
  components: '/components',
  docs: 'https://docs.minimals.cc',
  changelog: 'https://docs.minimals.cc/changelog',
  zoneStore: 'https://mui.com/store/items/zone-landing-page/',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  freeUI: 'https://mui.com/store/items/minimal-dashboard-free/',
  figmaUrl: 'https://www.figma.com/design/cAPz4pYPtQEXivqe11EcDE/%5BPreview%5D-Minimal-Web.v6.0.0',
  product: {
    root: `/product`,
    checkout: `/product/checkout`,
    details: (id: string) => `/product/${id}`,
    demo: { details: `/product/${MOCK_ID}` },
  },
  post: {
    root: `/post`,
    details: (title: string) => `/post/${kebabCase(title)}`,
    demo: { details: `/post/${kebabCase(MOCK_TITLE)}` },
  },
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    jwt: {
      signIn: `${ROOTS.AUTH}/jwt/sign-in`,
      signUp: `${ROOTS.AUTH}/jwt/sign-up`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  authDemo: {
    split: {
      signIn: `${ROOTS.AUTH_DEMO}/split/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/split/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/split/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/split/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/split/verify`,
    },
    centered: {
      signIn: `${ROOTS.AUTH_DEMO}/centered/sign-in`,
      signUp: `${ROOTS.AUTH_DEMO}/centered/sign-up`,
      resetPassword: `${ROOTS.AUTH_DEMO}/centered/reset-password`,
      updatePassword: `${ROOTS.AUTH_DEMO}/centered/update-password`,
      verify: `${ROOTS.AUTH_DEMO}/centered/verify`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    mail: `${ROOTS.DASHBOARD}/mail`,
    chat: `${ROOTS.DASHBOARD}/chat`,
    blank: `${ROOTS.DASHBOARD}/blank`,
    kanban: `${ROOTS.DASHBOARD}/kanban`,
    calendar: `${ROOTS.DASHBOARD}/calendar`,
    fileManager: `${ROOTS.DASHBOARD}/file-manager`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
      ecommerce: `${ROOTS.DASHBOARD}/ecommerce`,
      analytics: `${ROOTS.DASHBOARD}/analytics`,
      banking: `${ROOTS.DASHBOARD}/banking`,
      booking: `${ROOTS.DASHBOARD}/booking`,
      file: `${ROOTS.DASHBOARD}/file`,
      course: `${ROOTS.DASHBOARD}/course`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      demo: {
        edit: `${ROOTS.DASHBOARD}/user/${MOCK_ID}/edit`,
      },
    },
    product: {
      root: `${ROOTS.DASHBOARD}/product`,
      new: `${ROOTS.DASHBOARD}/product/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/product/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/product/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/product/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/product/${MOCK_ID}/edit`,
      },
    },
    invoice: {
      root: `${ROOTS.DASHBOARD}/invoice`,
      new: `${ROOTS.DASHBOARD}/invoice/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/invoice/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/invoice/${MOCK_ID}/edit`,
      },
    },
    post: {
      root: `${ROOTS.DASHBOARD}/post`,
      new: `${ROOTS.DASHBOARD}/post/new`,
      details: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}`,
      edit: (title: string) => `${ROOTS.DASHBOARD}/post/${kebabCase(title)}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}`,
        edit: `${ROOTS.DASHBOARD}/post/${kebabCase(MOCK_TITLE)}/edit`,
      },
    },
    order: {
      root: `${ROOTS.DASHBOARD}/order`,
      details: (id: string) => `${ROOTS.DASHBOARD}/order/${id}`,
      demo: {
        details: `${ROOTS.DASHBOARD}/order/${MOCK_ID}`,
      },
    },
    job: {
      root: `${ROOTS.DASHBOARD}/job`,
      new: `${ROOTS.DASHBOARD}/job/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/job/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/job/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/job/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/job/${MOCK_ID}/edit`,
      },
    },
    tour: {
      root: `${ROOTS.DASHBOARD}/tour`,
      new: `${ROOTS.DASHBOARD}/tour/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/tour/${id}/edit`,
      demo: {
        details: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}`,
        edit: `${ROOTS.DASHBOARD}/tour/${MOCK_ID}/edit`,
      },
    },
  },
  security: {
    root: ROOTS.SECURITY,
    users: {
      root: `${ROOTS.SECURITY}/users`,
      new: `${ROOTS.SECURITY}/users/new`,
      management: `${ROOTS.SECURITY}/users`,
      list: `${ROOTS.SECURITY}/users/list`,
      cards: `${ROOTS.SECURITY}/users/cards`,
      profile: `${ROOTS.SECURITY}/users/profile`,
      account: `${ROOTS.SECURITY}/users/account`,
      edit: (id: string) => `${ROOTS.SECURITY}/users/${id}/edit`,
      demo: {
        edit: `${ROOTS.SECURITY}/users/${MOCK_ID}/edit`,
      },
    },
    roles: {
      root: `${ROOTS.SECURITY}/roles`,
      create: `${ROOTS.SECURITY}/roles/create`,
      management: `${ROOTS.SECURITY}/roles`,
      edit: (id: string) => `${ROOTS.SECURITY}/roles/${id}/edit`,
      demo: {
        edit: `${ROOTS.SECURITY}/roles/${MOCK_ID}/edit`,
      },
    },
    passwordPolicy: {
      management: `${ROOTS.SECURITY}/passwordPolicy/management`,
    },
    serverInfo: {
      management: `${ROOTS.SECURITY}/server_info/management`,
    },

    delegations: {
      root: `${ROOTS.SECURITY}/delegations`,
      create: `${ROOTS.SECURITY}/delegations/create`,
      management: `${ROOTS.SECURITY}/delegations`,
      edit: (id: string) => `${ROOTS.SECURITY}/delegations/${id}/edit`,
      demo: {
        edit: `${ROOTS.SECURITY}/delegations/${MOCK_ID}/edit`,
      },
    },
  },
  workflow: {
    root: ROOTS.WORKFLOW,
    processes: {
      root: `${ROOTS.WORKFLOW}/processes`,
      management: `${ROOTS.WORKFLOW}/processes`,

      edit: (processCode: string) => `${ROOTS.WORKFLOW}/processes/${processCode}/edit`,
      demo: {
        edit: `${ROOTS.WORKFLOW}/processes/${MOCK_ID}/edit`,
      },
    },
    approvalGroups: {
      root: `${ROOTS.WORKFLOW}/approverGroups`,
      new: `${ROOTS.WORKFLOW}/approverGroups/new`,
      management: `${ROOTS.WORKFLOW}/approverGroups`,
      edit: (id: string) => `${ROOTS.WORKFLOW}/approverGroups/${id}/edit`,
      demo: {
        edit: `${ROOTS.WORKFLOW}/approverGroups/${MOCK_ID}/edit`,
      },
    },
    rules: {
      root: `${ROOTS.WORKFLOW}/rules`,
      management: `${ROOTS.WORKFLOW}/rules`,
      create: `${ROOTS.WORKFLOW}/rules/create`,
      edit: (id: string) => `${ROOTS.WORKFLOW}/rules/${id}/edit`,
    },
    transaction: {
      root: `${ROOTS.WORKFLOW}/transactionConsole`,
      new: `${ROOTS.WORKFLOW}/transactionConsole/new`,
      management: `${ROOTS.WORKFLOW}/transactionConsole`,
      information: `${ROOTS.WORKFLOW}/transactionConsole/information`,
    },
  },
  // HUMAN_RESOURCES
  hr: {
    root: ROOTS.HUMAN_RESOURCES,
    locations: {
      root: `${ROOTS.HUMAN_RESOURCES}/locations`,
      management: `${ROOTS.HUMAN_RESOURCES}/locations`,
      new: `${ROOTS.HUMAN_RESOURCES}/locations/new`,
      edit: (locationId: string) => `${ROOTS.HUMAN_RESOURCES}/locations/${locationId}/edit`,
      demo: {},
    },
    jobFamilies: {
      root: `${ROOTS.HUMAN_RESOURCES}/jobFamilies`,
      management: `${ROOTS.HUMAN_RESOURCES}/jobFamilies`,
      new: `${ROOTS.HUMAN_RESOURCES}/jobFamilies/new`,
      edit: (id: string) => `${ROOTS.HUMAN_RESOURCES}/jobFamilies/${id}/edit`,
      demo: {
        edit: `${ROOTS.HUMAN_RESOURCES}/jobFamilies/${MOCK_ID}/edit`,
      },
    },
    jobs: {
      root: `${ROOTS.HUMAN_RESOURCES}/jobs`,
      management: `${ROOTS.HUMAN_RESOURCES}/jobs`,
      new: `${ROOTS.HUMAN_RESOURCES}/jobs/new`,
      edit: (id: string) => `${ROOTS.HUMAN_RESOURCES}/jobs/${id}/edit`,
      demo: {
        edit: `${ROOTS.HUMAN_RESOURCES}/jobs/${MOCK_ID}/edit`,
      },
    },
    organizations: {
      root: `${ROOTS.HUMAN_RESOURCES}/organizations`,
      management: `${ROOTS.HUMAN_RESOURCES}/organizations`,
      new: `${ROOTS.HUMAN_RESOURCES}/organizations/new`,
      edit: (id: string) => `${ROOTS.HUMAN_RESOURCES}/organizations/${id}/edit`,
      demo: {
        edit: `${ROOTS.HUMAN_RESOURCES}/organizations/${MOCK_ID}/edit`,
      },
    },
    grades: {
      root: `${ROOTS.HUMAN_RESOURCES}/grades`,
      management: `${ROOTS.HUMAN_RESOURCES}/grades`,
      new: `${ROOTS.HUMAN_RESOURCES}/grades/new`,
      edit: (id: string) => `${ROOTS.HUMAN_RESOURCES}/grades/${id}/edit`,
      demo: {
        edit: `${ROOTS.HUMAN_RESOURCES}/grades/${MOCK_ID}/edit`,
      },
    },
    gradeRates: {
      root: `${ROOTS.HUMAN_RESOURCES}/gradeRates`,
      management: `${ROOTS.HUMAN_RESOURCES}/gradeRates`,
      new: `${ROOTS.HUMAN_RESOURCES}/gradeRates/new`,
      edit: (id: string) => `${ROOTS.HUMAN_RESOURCES}/gradeRates/${id}/edit`,
      demo: {
        edit: `${ROOTS.HUMAN_RESOURCES}/gradeRates/${MOCK_ID}/edit`,
      },
    },
    positions: {
      root: `${ROOTS.HUMAN_RESOURCES}/positions`,
      management: `${ROOTS.HUMAN_RESOURCES}/positions`,
      new: `${ROOTS.HUMAN_RESOURCES}/positions/new`,
      edit: (id: string) => `${ROOTS.HUMAN_RESOURCES}/positions/${id}/edit`,
    },
    personManagement: {
      root: `${ROOTS.HUMAN_RESOURCES}/personManagement`,
      management: `${ROOTS.HUMAN_RESOURCES}/personManagement`,
      new: `${ROOTS.HUMAN_RESOURCES}/personManagement/new`,
      hire: `${ROOTS.HUMAN_RESOURCES}/personManagement/hire`,
      update: (id: string) => `${ROOTS.HUMAN_RESOURCES}/personManagement/${id}/update`,
      correct: (id: string) => `${ROOTS.HUMAN_RESOURCES}/personManagement/${id}/details`,
    },
  },
  settings: {
    root: ROOTS.Settings,
    applications: {
      root: `${ROOTS.Settings}/applications`,
      management: `${ROOTS.Settings}/applications`,
    },
    languages: {
      root: `${ROOTS.Settings}/languages`,
      management: `${ROOTS.Settings}/languages`,
      new: `${ROOTS.Settings}/languages/new`,
      edit: (id: string) => `${ROOTS.Settings}/languages/${id}/edit`,
      demo: {
        edit: `${ROOTS.Settings}/languages/${MOCK_ID}/edit`,
      },
    },
    countries: {
      root: `${ROOTS.Settings}/countries`,
      management: `${ROOTS.Settings}/countries`,
      new: `${ROOTS.Settings}/countries/new`,
      edit: (id: string) => `${ROOTS.Settings}/countries/${id}/edit`,
      demo: {
        edit: `${ROOTS.Settings}/countries/${MOCK_ID}/edit`,
      },
    },
    curriencies: {
      root: `${ROOTS.Settings}/Currencies`,
      management: `${ROOTS.Settings}/Currencies`,
      new: `${ROOTS.Settings}/Currencies/new`,
      edit: (id: string) => `${ROOTS.Settings}/Currencies/${id}/edit`,
      demo: {
        edit: `${ROOTS.Settings}/Currencies/${MOCK_ID}/edit`,
      },
    },
    Lov: {
      root: `${ROOTS.Settings}/listofvalues`,
      management: `${ROOTS.Settings}/listofvalues`,
      new: `${ROOTS.Settings}/listofvalues/new`,
      edit: (id: string) => `${ROOTS.Settings}/listofvalues/${id}/edit`,
      demo: {
        edit: `${ROOTS.Settings}/listofvalues/${MOCK_ID}/edit`,
      },
    },
    timeZones: {
      root: `${ROOTS.Settings}/timeZones`,
      management: `${ROOTS.Settings}/timeZones`,
      new: `${ROOTS.Settings}/timeZones/new`,
      edit: (id: string) => `${ROOTS.Settings}/timeZones/${id}/edit`,
    },
    duties: {
      root: `${ROOTS.Settings}/duties`,
      management: `${ROOTS.Settings}/duties`,
      new: `${ROOTS.Settings}/duties/new`,
      edit: (id: string) => `${ROOTS.Settings}/duties/${id}/edit`,
    },
    user_duties: {
      root: `${ROOTS.Settings}/userDuties`,
      management: `${ROOTS.Settings}/userDuties`,
      new: `${ROOTS.Settings}/userDuties/new`,
      edit: (id: string) => `${ROOTS.Settings}/userDuties/${id}/edit`,
    },
  },
};
