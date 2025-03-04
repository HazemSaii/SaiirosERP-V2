import type { IFamilyInfo, IPesonalInfo, IContractInfo, IEmploymentInfo } from 'src/types/persons';

import { t } from 'i18next';
import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { _userAbout } from 'src/_mock';
import { useLocales } from 'src/locales';
import { UseGetApprovedJobs } from 'src/actions/Hr/jobs';
import { UseGetApprovedGrades } from 'src/actions/Hr/grades';
import { useGetCountries } from 'src/actions/settings/countries';
import { useGetApprovedLocations } from 'src/actions/Hr/locations';
import { UseGetApprovedPositions } from 'src/actions/Hr/positions';
import { UseAddPerson, UseGetPersons } from 'src/actions/Hr/person';
import { UseGetApprovedOrganizations } from 'src/actions/Hr/organizations';
import { useGetAllLookups, useGetAllPayrolls } from 'src/actions/shared/shared';

import {Iconify} from 'src/components/iconify';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import {ProfileCover} from 'src/sections/user/profile-cover';

import FamilyNewEditForm from '../family-new-edit-form';
import PersonalNewEditForm from '../personal-new-edit-form';
import ContractNewEditForm from '../contract-new-edit-form';
import EmploymentNewEditForm from '../employment-new-edit-form';

import type { FamilyNewEditFormHandle } from '../family-new-edit-form';
import type { PersonalNewEditFormHandle } from '../personal-new-edit-form';
import type { ContractNewEditFormHandle } from '../contract-new-edit-form';
import type { EmploymentNewEditFormHandle } from '../employment-new-edit-form';

// ----------------------------------------------------------------------

const TABS = [
  {
    value: 'personal',
    label: t('Personal'),
    icon: <Iconify icon="mdi:account-circle" width={24} />,
  },
  {
    value: 'contract',
    label: t('Contract'),
    icon: <Iconify icon="mdi:file-document" width={24} />,
  },
  {
    value: 'employment',
    label: t('Employment'),
    icon: <Iconify icon="mdi:work" width={24} />,
  },
  {
    value: 'family',
    label: t('Family'),
    icon: <Iconify icon="mdi:home-group" width={24} />,
  },
];

// ----------------------------------------------------------------------

export default function PersonCreateView() {
  const settings = useSettingsContext();
  const { currentLang } = useLocales();
  const router = useRouter();

  const { user } = useMockedUser();
  const [currentPersonalInfo, setcurrentPersonalInfo] = useState<IPesonalInfo>();
  const [currentcontractInfo, setcurrentcontractInfo] = useState<IContractInfo>();
  const [currentEmploymentInfo, setcurrentEmploymentInfo] = useState<IEmploymentInfo>();
  const [currentFamilyInfo, setcurrentFamilyInfo] = useState<IFamilyInfo>();
  const [submitLoading, setSubmitLoading] = useState(false);

  const { approvedpositions, approvedpositionsLoading } = UseGetApprovedPositions(
    currentLang.value
  );
  const { approvedjobs, approvedjobsLoading } = UseGetApprovedJobs(currentLang.value);
  const { approvedGrades, approvedGradesLoading } = UseGetApprovedGrades(currentLang.value);
  const { approvedlocations, approvedlocationsLoading } = useGetApprovedLocations(
    currentLang.value
  );
  const { persons, personsLoading } = UseGetPersons(currentLang.value);
  const { approvedorganizations, approvedorganizationsLoading } = UseGetApprovedOrganizations(
    currentLang.value
  );
  const { countries, countriesLoading } = useGetCountries(currentLang.value);
  const { payrolls, payrollsLoading } = useGetAllPayrolls(currentLang.value);
  const { lookups: GENDERTypes, lookupsLoading: GENDERTypesLoading } = useGetAllLookups(
    'GENDER',
    currentLang.value
  );
  const { lookups: RELIGIONTypes, lookupsLoading: RELIGIONTypesLoading } = useGetAllLookups(
    'RELIGION',
    currentLang.value
  );
  const { lookups: MARITAL_STATUSTypes, lookupsLoading: MARITAL_STATUSTypesLoading } =
    useGetAllLookups('MARITAL_STATUS', currentLang.value);
  const { lookups: TIME_UNITS_Types, lookupsLoading: TIME_UNITSLoading } = useGetAllLookups(
    'TIME_UNITS',
    currentLang.value
  );
  const { lookups: RELATIONSHIP_TYPE, lookupsLoading: RELATIONSHIP_TYPELoading } = useGetAllLookups(
    'RELATIONSHIP_TYPES',
    currentLang.value
  );
  const { lookups: EDUCATION_LEVEL, lookupsLoading: EDUCATION_LEVELLoading } = useGetAllLookups(
    'EDUCATION_LEVEL',
    currentLang.value
  );
  const { lookups: EMPLOYMENT_ACTIONS, lookupsLoading: EMPLOYMENT_ACTIONSLoading } =
    useGetAllLookups('EMPLOYMENT_ACTIONS', currentLang.value);
  const { lookups: EMPLOYMENT_TYPE, lookupsLoading: EMPLOYMENT_TYPELoading } = useGetAllLookups(
    'EMPLOYMENT_TYPE',
    currentLang.value
  );
  const { lookups: END_CONTRACT_REASONS, lookupsLoading: END_CONTRACT_REASONSLoading } =
    useGetAllLookups('END_CONTRACT_REASONS', currentLang.value);
 
  const [currentTab, setCurrentTab] = useState('personal');
  const personalInfoForm = useRef<PersonalNewEditFormHandle>(null);
  const contractInfoForm = useRef<ContractNewEditFormHandle>(null);
  const employmentInfoForm = useRef<EmploymentNewEditFormHandle>(null);
  const familyInfoForm = useRef<FamilyNewEditFormHandle>(null);

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;
      if (currentTab === 'personal' && personalInfoForm.current) {
        isValid = await personalInfoForm.current.validate();
        formData = personalInfoForm.current.formData();
        formData.registeredDisabled = formData.registeredDisabled ? 1 : 0;
        setcurrentPersonalInfo(formData);
      }
      if (currentTab === 'contract' && contractInfoForm.current) {
        isValid = await contractInfoForm.current.validate();
        formData = contractInfoForm.current.formData();
        formData.registeredDisabled = formData.registeredDisabled ? 1 : 0;
        setcurrentcontractInfo(formData);
      }
      if (currentTab === 'employment' && employmentInfoForm.current) {
        isValid = await employmentInfoForm.current.validate();
        formData = employmentInfoForm.current.formData();
        formData.registeredDisabled = formData.registeredDisabled ? 1 : 0;
        setcurrentEmploymentInfo(formData);
      }

      if (currentTab === 'family' && familyInfoForm.current) {
        isValid = await familyInfoForm.current.validate();
        formData = familyInfoForm.current.formData();
        formData.registeredDisabled = formData.registeredDisabled ? 1 : 0;
        setcurrentFamilyInfo(formData);
      }

      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, personalInfoForm, contractInfoForm, employmentInfoForm, familyInfoForm]
  );
  const mapPersonInfo = (currentPersonal: any): any => {
    const emplContractDTOS =
      currentPersonal?.emplContractDTOS?.map((currentContract: any) => ({
        startDate: currentContract?.startDate ? new Date(currentContract.startDate) : null,
        endDate: currentContract?.endDate ? new Date(currentContract.endDate) : null,
        employmentType: Math.floor(Math.random() * 1000000),
        approvalStatus: currentContract?.approvalStatus || 'DRAFT',
        probationLength: currentContract?.probationLength || '',
        probationUnits: currentContract?.probationUnits || '',
        probationEndDate: currentContract?.probationEndDate
          ? new Date(currentContract.probationEndDate)
          : null,
        employeeNoticeLength: currentContract?.employeeNoticeLength || '',
        employeeNoticeUnits: currentContract?.employeeNoticeUnits || '',
        employerNoticeLength: currentContract?.employerNoticeLength || '',
        employerNoticeUnits: currentContract?.employerNoticeUnits || '',
        // finalProcessDate: currentContract?.finalProcessDate
        //   ? new Date(currentContract.finalProcessDate)
        //   : null,
        // reason: '',
        // notes: currentContract?.notes || '',
        legalEntityId: 1,
        // contractKey: Math.floor(Math.random() * 1000000),
        // uniqueId:  Math.floor(Math.random() * 1000000),
        // contractId: currentContract?.contractId  || Math.floor(Math.random() * 1000000),
      })) || [];
    const emplContractHistoryDTOS =
      currentPersonal?.emplContractHistoryDTOS?.map((currentEmployment: any) => ({
        startDate: currentEmployment?.startDate ? new Date(currentEmployment.startDate) : null,
        endDate: currentEmployment?.endDate ? new Date(currentEmployment.endDate) : null,
        actionCode: 1,
        approvalStatus: currentEmployment?.approvalStatus || 'DRAFT',
        positionId: currentEmployment?.positionId || '',
        organizationId: currentEmployment?.organizationId || '',
        jobId: currentEmployment?.jobId || '',
        gradeId: currentEmployment?.gradeId || '',
        locationId: currentEmployment?.locationId || '',
        payrollId: currentEmployment?.payrollId || '',
        managerId: currentEmployment?.managerId || '',
        // uniqueId: Math.floor(Math.random() * 1000000),
        // contractId: currentEmployment?.contractId  || Math.floor(Math.random() * 1000000),
      })) || [];
    return {
      employeeNumber: currentPersonal?.employeeNumber ?? '',
      approvalStatus: currentPersonal?.approvalStatus ?? 'DRAFT',
      firstName: currentPersonal?.firstName ?? '',
      secondName: currentPersonal?.secondName ?? '',
      thirdName: currentPersonal?.thirdName ?? '',
      lastName: currentPersonal?.lastName ?? '',
      alternativeFirstName: currentPersonal?.alternativeFirstName ?? '',
      alternativeSecondName: currentPersonal?.alternativeSecondName ?? '',
      alternativeThirdName: currentPersonal?.alternativeThirdName ?? '',
      alternativeLastName: currentPersonal?.alternativeLastName ?? '',
      dateOfBirth: currentPersonal?.dateOfBirth ? new Date(currentPersonal.dateOfBirth) : null,
      gender: currentPersonal?.gender ?? '',
      religion: currentPersonal?.religion ?? '',
      nationalityCode: currentPersonal?.nationalityCode ?? '',
      maritalStatus: currentPersonal?.maritalStatus ?? '',
      registeredDisabled: currentPersonal?.registeredDisabled ?? 0,
      highestEducationLevel: currentPersonal?.highestEducationLevel ?? '',
      workEmail: currentPersonal?.workEmail ?? '',
      personalEmail: currentPersonal?.personalEmail ?? '',
      passportNumber: currentPersonal?.passportNumber ?? '',
      workMobile: currentPersonal?.workMobile ?? '',
      personalMobile: currentPersonal?.personalMobile ?? '',
      nationalId: currentPersonal?.nationalId ?? '',
      // uniqueId:  Math.floor(Math.random() * 1000000),
      saveOrSubmit: currentPersonal?.saveOrSubmit ?? 'SUBMITTED',
      emplContractDTOS,
      emplContractHistoryDTOS,
    };
  };
  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (personalInfoForm.current) {
      formValid = await personalInfoForm.current.validate();
      currentData = personalInfoForm.current.formData();
      currentData.registeredDisabled = currentData.registeredDisabled ? 1 : 0;

      data = {
        ...currentData,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }],
      };
    }
    if (contractInfoForm.current) {
      formValid = await contractInfoForm.current.validate();
      currentData = contractInfoForm.current.formData();
      data = {
        ...currentPersonalInfo,
        emplContractDTOS: [{ ...currentData }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }],
      };
    }
    if (employmentInfoForm.current) {
      formValid = await employmentInfoForm.current.validate();
      currentData = employmentInfoForm.current.formData();
      data = {
        ...currentPersonalInfo,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentData }],
      };
    }
    if (familyInfoForm.current) {
      // formValid = await familyInfoForm.current.validate();
      // currentData = familyInfoForm.current.formData();
      data = {
        ...currentPersonalInfo,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }],
      };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });

    data.registeredDisabled = data.registeredDisabled ? 1 : 0;
    // data.dateOfBirth = formatDateTimeToISOString(data.dateOfBirth);
    // data.emplContractHistoryDTOS[0].startDate = formatDateTimeToISOString(data.emplContractHistoryDTOS[0].startDate);
    // data.emplContractHistoryDTOS[0].endDate = formatDateTimeToISOString(data.emplContractHistoryDTOS[0].endDate);
    // data.emplContractDTOS[0].startDate = formatDateTimeToISOString(data.emplContractDTOS[0].startDate);
    // data.emplContractDTOS[0].finalProcessDate = formatDateTimeToISOString(data.emplContractDTOS[0].finalProcessDate);
    // data.emplContractDTOS[0].probationEndDate = formatDateTimeToISOString(data.emplContractDTOS[0].probationEndDate);
    // data.emplContractDTOS[0].endDate = formatDateTimeToISOString(data.emplContractDTOS[0].endDate);

    const mappedPersonInfo = mapPersonInfo(data);

    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const res = await UseAddPerson(mappedPersonInfo);
      if (res.status === 200 || res.status === 201) {
        toast.success(t('Created successfully!'));
        router.push(paths.hr.personManagement.management);
      }
      setSubmitLoading(false);
    } catch (error:any) {
      setSubmitLoading(false);
      toast.error(error.message);
    }
  };

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Hire Person')}
        links={[
          { name: t('Human Resources'), href: paths.dashboard.root },
          { name: t('Persons'), href: paths.hr.personManagement.root },
          { name: t('Hire Person') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        // action={
        //   <div>
        //     <BackButton label={t('Cancel')} />
        //     <LoadingButton
        //       color="inherit"
        //       onClick={handleSubmit}
        //       variant="contained"
        //       loading={submitLoading}
        //       sx={{ mt: 5 }}
        //     >
        //       {t('Submit')}
        //     </LoadingButton>
        //   </div>
        // }
      />

      <Card
        sx={{
          mb: 1,
          height: 290,
        }}
      >
        <ProfileCover
          avatarUrl={user?.photoURL}
          coverUrl={_userAbout.coverUrl}
          // role={_userAbout.role}
          // name={`${currentPersonalInfo?.firstName} ${currentPersonalInfo?.lastName}`}
        />

        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab key={tab.value} value={tab.value} icon={tab.icon} label={tab.label} />
          ))}
        </Tabs>
      </Card>

      {currentTab === 'personal' &&
        (MARITAL_STATUSTypesLoading ||
        GENDERTypesLoading ||
        RELIGIONTypesLoading ||
        countriesLoading ||
        EDUCATION_LEVELLoading ||
        !MARITAL_STATUSTypes ||
        !GENDERTypes ||
        !RELIGIONTypes ||
        !EDUCATION_LEVEL ||
        !countries ? (
          <>
            <ButtonSkeleton buttons={1} />

            <FormSkeleton fields={14} />
          </>
        ) : (
          <PersonalNewEditForm
            ref={personalInfoForm}
            operation="create"
            currentPersonal={currentPersonalInfo || undefined}
            MARITAL_STATUSTypesLoading={MARITAL_STATUSTypesLoading}
            GENDERTypesLoading={GENDERTypesLoading}
            RELIGIONTypesLoading={RELIGIONTypesLoading}
            countriesLoading={countriesLoading}
            EDUCATION_LEVELLoading={EDUCATION_LEVELLoading}
            MARITAL_STATUSTypes={MARITAL_STATUSTypes}
            GENDERTypes={GENDERTypes}
            RELIGIONTypes={RELIGIONTypes}
            countries={countries}
            EDUCATION_LEVEL={EDUCATION_LEVEL}
            submit={handleSubmit}
          />
        ))}
      {currentTab === 'contract' &&
        (TIME_UNITSLoading ||
        !TIME_UNITS_Types ||
        EMPLOYMENT_TYPELoading ||
        !EMPLOYMENT_TYPE ||
        END_CONTRACT_REASONSLoading ||
        !END_CONTRACT_REASONS ? (
          <>
            <ButtonSkeleton buttons={6} />

            <FormSkeleton fields={10} />
          </>
        ) : (
          <ContractNewEditForm
            ref={contractInfoForm}
            operation="create"
            currentContract={currentcontractInfo || undefined}
            TIME_UNITSLoading={TIME_UNITSLoading}
            TIME_UNITS_Types={TIME_UNITS_Types}
            END_CONTRACT_REASONS={END_CONTRACT_REASONS}
            END_CONTRACT_REASONSLoading={END_CONTRACT_REASONSLoading}
            EMPLOYMENT_TYPE={EMPLOYMENT_TYPE}
            EMPLOYMENT_TYPELoading={EMPLOYMENT_TYPELoading}
            submit={handleSubmit}
          />
        ))}
      {currentTab === 'employment' &&
        (approvedlocationsLoading ||
        approvedjobsLoading ||
        approvedlocationsLoading ||
        approvedGradesLoading ||
        approvedpositionsLoading ||
        personsLoading ||
        approvedorganizationsLoading ||
        payrollsLoading ||
        EMPLOYMENT_ACTIONSLoading ||
        !EMPLOYMENT_ACTIONS ||
        !approvedjobs ||
        !approvedlocations ||
        !approvedpositions ||
        !persons ||
        !approvedorganizations ||
        !payrolls ||
        !approvedGrades ? (
          <>
            <ButtonSkeleton buttons={5} />

            <FormSkeleton fields={9} />
          </>
        ) : (
          <EmploymentNewEditForm
            ref={employmentInfoForm}
            operation="create"
            currentEmployment={currentEmploymentInfo || undefined}
            locationsLoading={approvedlocationsLoading}
            jobsLoading={approvedjobsLoading}
            GradesLoading={approvedGradesLoading}
            positionsLoading={approvedpositionsLoading}
            personsLoading={personsLoading}
            organizationsLoading={approvedorganizationsLoading}
            payrollsLoading={payrollsLoading}
            EMPLOYMENT_ACTIONSLoading={EMPLOYMENT_ACTIONSLoading}
            EMPLOYMENT_ACTIONS={EMPLOYMENT_ACTIONS}
            locations={approvedlocations}
            jobs={approvedjobs}
            Grades={approvedGrades}
            positions={approvedpositions}
            persons={persons}
            organizations={approvedorganizations}
            payrolls={payrolls}
            submit={handleSubmit}
          />
        ))}
      {currentTab === 'family' &&
        (MARITAL_STATUSTypesLoading ||
        GENDERTypesLoading ||
        RELIGIONTypesLoading ||
        countriesLoading ||
        RELATIONSHIP_TYPELoading ||
        EDUCATION_LEVELLoading ||
        !MARITAL_STATUSTypes ||
        !GENDERTypes ||
        !RELIGIONTypes ||
        !RELATIONSHIP_TYPE ||
        !EDUCATION_LEVEL ||
        !countries ? (
          <FormSkeleton fields={6} />
        ) : (
          <FamilyNewEditForm
            ref={familyInfoForm}
            operation="create"
            currentFamily={currentFamilyInfo || undefined}
            MARITAL_STATUSTypesLoading={MARITAL_STATUSTypesLoading}
            GENDERTypesLoading={GENDERTypesLoading}
            RELIGIONTypesLoading={RELIGIONTypesLoading}
            RELATIONSHIP_TYPELoading={RELATIONSHIP_TYPELoading}
            countriesLoading={countriesLoading}
            EDUCATION_LEVELLoading={EDUCATION_LEVELLoading}
            MARITAL_STATUSTypes={MARITAL_STATUSTypes}
            GENDERTypes={GENDERTypes}
            RELIGIONTypes={RELIGIONTypes}
            countries={countries}
            RELATIONSHIP_TYPE={RELATIONSHIP_TYPE}
            EDUCATION_LEVEL={EDUCATION_LEVEL}
            submit={handleSubmit}
          />
        ))}
    </Container>
  );
}
