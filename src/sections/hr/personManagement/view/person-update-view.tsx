import type { IFamilyInfo, IPesonalInfo, IContractInfo, IEmploymentInfo } from 'src/types/persons';

import { toast } from 'sonner';
import { useRef, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import { Card } from '@mui/material';
// ----------------------------------------------------------------------
import Container from '@mui/material/Container';
import Tabs, { tabsClasses } from '@mui/material/Tabs';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useMockedUser } from 'src/hooks/use-mocked-user';

import { formatDateTimeToISOString } from 'src/utils/general-utils';

import { _userAbout } from 'src/_mock';
import { UseGetJobs } from 'src/actions/Hr/jobs';
import { UseGetGrades } from 'src/actions/Hr/grades';
import { useLocales, useTranslate } from 'src/locales';
import { UseGetPositions } from 'src/actions/Hr/positions';
import { useGetCountries } from 'src/actions/settings/countries';
import { UseGetOrganizations } from 'src/actions/Hr/organizations';
import { UseGetpersonfamily, UseEditpersonfamily } from 'src/actions/Hr/family';
import { UseGetPerson, UseGetPersons, UseUpdatePerson } from 'src/actions/Hr/person';
import { useGetAllLookups, useGetAllPayrolls, useGetAllLocations } from 'src/actions/shared/shared';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import hasFormChanges from 'src/components/Form/form-data-changes';
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
type Props = {
    id: string;
};
const useFetchPersonData = (id: any) => {
  
  const [personData, setpersonData] = useState<any | null>(null);
  const [personfamilyData, setpersonfamily] = useState<any | null>(null);
  const [loading, setLoading] = useState<any>(true);
  const {
    person,
    personValidating,
    refetch: refetchPerson,
  } = UseGetPerson(id);
  const {
    personfamily,
    personfamilyValidating,
    refetch: refetchpersonfamily,
  } = UseGetpersonfamily(id);
  const refetch = useCallback(() => {
    refetchPerson();
    refetchpersonfamily();
  }, [refetchPerson,refetchpersonfamily]);
  useEffect(() => {
    if (!personValidating&&!personfamilyValidating) {
      setpersonData(person);
      setpersonfamily(personfamily);
      setLoading(false);
    }
    
  }, [personValidating, person, personfamily, personfamilyValidating]);

  return { personData,personfamilyData, loading, refetch };
};

export default function PersonUpdateView({ id }: Props) {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentLang } = useLocales();
  const { user } = useMockedUser();

  
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
  const { personData,personfamilyData, loading, refetch } = useFetchPersonData(id);

  const { positions, positionsLoading } = UseGetPositions(currentLang.value);
  const { jobs, jobsLoading } = UseGetJobs(currentLang.value);
  const { Grades, GradesLoading } = UseGetGrades(currentLang.value);
  const { locations, locationsLoading } = useGetAllLocations(currentLang.value);
  const { persons, personsLoading } = UseGetPersons(currentLang.value);
  const { organizations, organizationsLoading } = UseGetOrganizations(currentLang.value);
  const { countries, countriesLoading } = useGetCountries(currentLang.value);
  const { payrolls, payrollsLoading } = useGetAllPayrolls(currentLang.value);
  const { lookups: GENDERTypes, lookupsLoading: GENDERTypesLoading , } = useGetAllLookups(
    'GENDER',
    currentLang.value
  );
  const { lookups: RELIGIONTypes, lookupsLoading: RELIGIONTypesLoading } = useGetAllLookups(
    'RELIGION',
    currentLang.value
  );
  const { lookups: MARITAL_STATUSTypes, lookupsLoading: MARITAL_STATUSTypesLoading } = useGetAllLookups(
    'MARITAL_STATUS',
    currentLang.value
  );
  const { lookups:TIME_UNITS_Types, lookupsLoading: TIME_UNITSLoading } = useGetAllLookups(
    'TIME_UNITS',
    currentLang.value
  );
  const { lookups:RELATIONSHIP_TYPE, lookupsLoading: RELATIONSHIP_TYPELoading } = useGetAllLookups(
    'RELATIONSHIP_TYPES',
    currentLang.value
  );
  const { lookups:EDUCATION_LEVEL, lookupsLoading: EDUCATION_LEVELLoading } = useGetAllLookups(
    'EDUCATION_LEVEL',
    currentLang.value
  );
  const { lookups:EMPLOYMENT_ACTIONS, lookupsLoading: EMPLOYMENT_ACTIONSLoading } = useGetAllLookups(
    'EMPLOYMENT_ACTIONS',
    currentLang.value
  );
  const { lookups:EMPLOYMENT_TYPE, lookupsLoading: EMPLOYMENT_TYPELoading } = useGetAllLookups(
    'EMPLOYMENT_TYPE',
    currentLang.value
  );
  const { lookups:END_CONTRACT_REASONS, lookupsLoading: END_CONTRACT_REASONSLoading } = useGetAllLookups(
    'END_CONTRACT_REASONS',
    currentLang.value
  );
  const [currentPersonalInfo, setcurrentPersonalInfo] = useState<IPesonalInfo|null>();
  const [currentcontractInfo, setcurrentcontractInfo] = useState<IContractInfo|null>();
  const [currentEmploymentInfo, setcurrentEmploymentInfo] = useState<IEmploymentInfo|null>();
  const [currentFamilyInfo, setcurrentFamilyInfo] = useState<IFamilyInfo|null>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('personal');
  const personalInfoForm = useRef<PersonalNewEditFormHandle>(null);
  const contractInfoForm = useRef<ContractNewEditFormHandle>(null);
  const employmentInfoForm = useRef<EmploymentNewEditFormHandle>(null);
  const familyInfoForm = useRef<FamilyNewEditFormHandle>(null);
  const settings = useSettingsContext();

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
    [currentTab, personalInfoForm,contractInfoForm,employmentInfoForm,familyInfoForm]
  );
  const mapPersonInfo = (currentPersonal: any): any => {
    
    const emplContractDTOS =
    currentPersonal?.emplContractDTOS?.map((currentContract: any) => ({
      startDate: currentContract?.startDate ?formatDateTimeToISOString(currentContract.startDate) : null,
      endDate: currentContract?.endDate ? formatDateTimeToISOString(currentContract.endDate) : null,
      employmentType:currentContract?.employmentType  || '',
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
        finalProcessDate: currentContract?.finalProcessDate
          ? new Date(currentContract.finalProcessDate)
          : null,
          reason: currentContract?.reason  || '',
          notes: currentContract?.notes || '',
        legalEntityId:  1,
        contractKey: Math.floor(Math.random() * 1000000),
        uniqueId:  Math.floor(Math.random() * 1000000),
        contractId: null,

      })) || [];
   
    const emplContractHistoryDTOS =
    currentPersonal?.emplContractHistoryDTOS?.map((currentEmployment: any) => ({
      startDate: currentEmployment?.startDate ?formatDateTimeToISOString(currentEmployment.startDate) : null,
      endDate: currentEmployment?.endDate ? formatDateTimeToISOString(currentEmployment.endDate) : null,
      actionCode: currentEmployment?.actionCode  || '',
  approvalStatus: currentEmployment?.approvalStatus  || 'DRAFT',
  positionId: currentEmployment?.positionId  || '',
  organizationId: currentEmployment?.organizationId  || '',
  jobId: currentEmployment?.jobId  || '',
  gradeId: currentEmployment?.gradeId  || '',
  locationId: currentEmployment?.locationId  || '',
  payrollId: currentEmployment?.payrollId  || '',
  managerId: currentEmployment?.managerId  || '',
  uniqueId: Math.floor(Math.random() * 1000000),
  contractId: null,
})) || [];
    return {
      personId: Number(id),
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
      dateOfBirth:currentPersonal?.dateOfBirth ? formatDateTimeToISOString(currentPersonal.dateOfBirth) : null,
      gender: currentPersonal?.gender ?? '',
      religion: currentPersonal?.religion ?? '',
      nationalityCode: currentPersonal?.nationalityCode ?? '',
      maritalStatus: currentPersonal?.maritalStatus ?? '',
      registeredDisabled: currentPersonal?.registeredDisabled ? 1 : 0,
      highestEducationLevel: currentPersonal?.highestEducationLevel ?? '',
      workEmail: currentPersonal?.workEmail ?? '',
      personalEmail: currentPersonal?.personalEmail ?? '',
      passportNumber: currentPersonal?.passportNumber ?? '',
      workMobile: currentPersonal?.workMobile ?? '',
      personalMobile: currentPersonal?.personalMobile ?? '',
      nationalId: currentPersonal?.nationalId ?? '',    
      uniqueId:  Math.floor(Math.random() * 1000000),
     saveOrSubmit: currentPersonal?.saveOrSubmit ?? 'SUBMITTED',
     emplContractDTOS,
     emplContractHistoryDTOS

    };
  };
  const mapPersonFamilyInfo = (currentFamily: any): any => 
    currentFamily?.map((familyMember: any) => ({
      parentPersonId: Number(id),
      personId: familyMember?.personId || '',
      relationshipType: familyMember?.relationshipType || '',
      approvalStatus: familyMember?.approvalStatus || 'DRAFT',
      firstName: familyMember?.firstName || '',
      secondName: familyMember?.secondName || '',
      thirdName: familyMember?.thirdName || '',
      lastName: familyMember?.lastName || '',
      alternativeFirstName: familyMember?.alternativeFirstName || '',
      alternativeSecondName: familyMember?.alternativeSecondName || '',
      alternativeThirdName: familyMember?.alternativeThirdName || '',
      alternativeLastName: familyMember?.alternativeLastName || '',
      dateOfBirth: familyMember?.dateOfBirth || null,
      age: familyMember?.age || null,
      maritalStatus: familyMember?.maritalStatus || '',
      gender: familyMember?.gender || '',
      religion: familyMember?.religion || '',
      nationalityCode: familyMember?.nationalityCode || '',
      registeredDisabled: familyMember.registeredDisabled ? 1 : 0,
      highestEducationLevel: familyMember?.highestEducationLevel || '',
      passportNumber: familyMember?.passportNumber || '',
      nationalId: familyMember?.nationalId || '',
      personalEmail: familyMember?.personalEmail || '',
      personalMobile: familyMember?.personalMobile || '',
    }));
  

  const handleSubmit = async () => {

    let currentData = null;
    let formValid = false;
    let data: any = null;
    let fdata: any = null;
    if (personalInfoForm.current) {
      formValid = await personalInfoForm.current.validate();
      currentData = personalInfoForm.current.formData();
      data = {   ...currentData ,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }]
       };
       fdata=currentFamilyInfo
      }
    if (contractInfoForm.current) {
      formValid = await contractInfoForm.current.validate();
      currentData = contractInfoForm.current.formData();
      data = {   ...currentPersonalInfo ,
        emplContractDTOS: [{ ...currentData }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }], 
            };
            fdata=currentFamilyInfo


    }
    if (employmentInfoForm.current) {
      formValid = await employmentInfoForm.current.validate();
      currentData = employmentInfoForm.current.formData();
      data = {   ...currentPersonalInfo ,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS:[ { ...currentData } ]

      };
      fdata=currentFamilyInfo

    }
    if (familyInfoForm.current) {
      formValid = await familyInfoForm.current.validate();
      currentData = familyInfoForm.current.formData();
      data = {   ...currentPersonalInfo ,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo } ]
      };
      fdata=currentData
    
    }
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    data.registeredDisabled = data.registeredDisabled ? 1 : 0;
    fdata.registeredDisabled = fdata.registeredDisabled ? 1 : 0;

    const mappedPersonInfo = mapPersonInfo(data);

    const mappedPersonFamilyInfo = mapPersonFamilyInfo(fdata);

    if (!formValid) return;
    const hasChanges = hasFormChanges([personData], [mappedPersonInfo]);

    if (!hasChanges) {
      toast.info(t('No changes to save.'));
      router.push(paths.hr.personManagement.management);
    } else {
      try {
        setSubmitLoading(true);
        const res = await UseUpdatePerson(mappedPersonInfo);
        if (res.status === 200||res.status === 201) {

          refetch();
          if(mappedPersonFamilyInfo.length>0)
            {
              
             
          for (const familyInfo of mappedPersonFamilyInfo) {
            try {
              // if(
              //   familyInfo.approvalStatus!=='PENDING'
              // ){
               
              const res2 = await UseEditpersonfamily(familyInfo);
              if (res2.status === 200||res2.status === 201) {
                refetch();
    
                toast.success(t('Updated successfully!'));
                router.push(paths.hr.personManagement.management);
                setcurrentPersonalInfo(null);
                setcurrentcontractInfo(null);
                setcurrentEmploymentInfo(null);
                setcurrentFamilyInfo(null);
              }
                     // }
                      } catch (error:any) {
                          setSubmitLoading(false);
toast.error(`Family: ${error.message}`);           }
          }
        }
        else
          {
            toast.success(t('Updated successfully!'));

            refetch();
            router.push(paths.hr.personManagement.management);
                  setcurrentPersonalInfo(null);
                  setcurrentcontractInfo(null);
                  setcurrentEmploymentInfo(null);
                  setcurrentFamilyInfo(null);
          }
         }
        
      } catch (error:any) {
        setSubmitLoading(false);
        toast.error(error.message);
      }
   }
    }
  
    useEffect(() => {
      if (!loading) {
     
         setcurrentPersonalInfo(personData);
        setcurrentcontractInfo(personData?.emplContractDTOS?.[0]);
          setcurrentEmploymentInfo(personData?.emplContractHistoryDTOS?.[0]);
           setcurrentFamilyInfo(personfamilyData);
     }
  
      return () => {
        setcurrentPersonalInfo(null);
        setcurrentcontractInfo(null);
          setcurrentEmploymentInfo(null);
          setcurrentFamilyInfo(null);
      };
    }, [loading, personData, personfamilyData]);


  //--------------
  return (
    <Container>
      <CustomBreadcrumbs
            heading={t('Update Person ')}

                  links={[
                    { name: t('Human Resources'), href: paths.dashboard.root },
                    { name: t('Persons'), href: paths.hr.personManagement.root },
                    { name: t('Update Person ') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
              <BackButton label={t('Cancel')} />
        }
      />

<Card
        sx={{
          mb: 1,
          height: 290,
        }}
      >
        <ProfileCover
          // role={_userAbout.role}
          // name={`${currentPersonalInfo?.firstName} ${currentPersonalInfo?.lastName}`}
          avatarUrl={user?.photoURL}
          coverUrl={_userAbout.coverUrl}
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
              pr: { md: 3},
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
      (loading||
        MARITAL_STATUSTypesLoading ||
        GENDERTypesLoading ||
        RELIGIONTypesLoading ||
        countriesLoading ||
        EDUCATION_LEVELLoading ||
        !currentPersonalInfo ||
        !MARITAL_STATUSTypes ||
        !GENDERTypes ||
        !RELIGIONTypes ||
        !EDUCATION_LEVEL ||
       ! countries  ? (
          <>

          <ButtonSkeleton buttons={1}  />
          
          <FormSkeleton fields={14}  />
          </>

        ) :(
      <PersonalNewEditForm
      ref={personalInfoForm}
      operation="edit"
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

       />))}
       {currentTab === 'contract' && 
      (loading||
        !currentcontractInfo ||
        TIME_UNITSLoading ||
        !TIME_UNITS_Types  ||
        EMPLOYMENT_TYPELoading||
        !EMPLOYMENT_TYPE||
        END_CONTRACT_REASONSLoading||
        !END_CONTRACT_REASONS? (
<>

<ButtonSkeleton buttons={6}  />

<FormSkeleton fields={10}  />
</>        ) : 
     (
       <ContractNewEditForm
       ref={contractInfoForm}
       operation="edit"
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
       (loading||
        locationsLoading ||
        jobsLoading ||
        locationsLoading ||
        GradesLoading ||
        positionsLoading ||
        personsLoading ||
        organizationsLoading ||
        payrollsLoading||
        EMPLOYMENT_ACTIONSLoading||
        !EMPLOYMENT_ACTIONS ||
        !currentEmploymentInfo||
        !jobs ||
        !locations ||
        !positions ||
        !persons ||
        !organizations ||
        !payrolls ||
        !Grades ? (
<>

<ButtonSkeleton buttons={5}  />

<FormSkeleton fields={9}  />
</>        ) : (
      
        <EmploymentNewEditForm
        ref={employmentInfoForm}
        operation="edit"
        currentEmployment  ={currentEmploymentInfo || undefined}
        locationsLoading={locationsLoading}
        jobsLoading={jobsLoading}
        GradesLoading={GradesLoading}
        positionsLoading={positionsLoading}
        personsLoading={personsLoading}
        organizationsLoading={organizationsLoading}
        payrollsLoading={payrollsLoading}
        EMPLOYMENT_ACTIONSLoading={EMPLOYMENT_ACTIONSLoading}
        EMPLOYMENT_ACTIONS={EMPLOYMENT_ACTIONS}
        locations={locations}
        jobs={jobs}
        Grades={Grades}
        positions={positions}
        persons={persons}
        organizations={organizations}
        payrolls={payrolls}
        submit={handleSubmit}

  
         />
        ))}
      {currentTab === 'family' && 
       (loading||
        MARITAL_STATUSTypesLoading ||
        GENDERTypesLoading ||
        RELIGIONTypesLoading ||
        countriesLoading ||
        RELATIONSHIP_TYPELoading ||
        EDUCATION_LEVELLoading||
        !currentFamilyInfo ||
        !MARITAL_STATUSTypes ||
        !GENDERTypes ||
        !RELIGIONTypes ||
        !RELATIONSHIP_TYPE ||
        !EDUCATION_LEVEL ||
        !countries  ? (
          <FormSkeleton fields={6} />
        ) : (
        <FamilyNewEditForm
        ref={familyInfoForm}
        operation="edit"
        currentFamily  ={currentFamilyInfo || undefined}
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