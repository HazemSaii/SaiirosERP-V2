import type { IFamilyInfo, IPersonInfo } from 'src/types/persons';

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
import { useLocales, useTranslate } from 'src/locales';
import { UseGetApprovedJobs } from 'src/actions/Hr/jobs';
import { UseGetApprovedGrades } from 'src/actions/Hr/grades';
import { useGetCountries } from 'src/actions/settings/countries';
import { useGetApprovedLocations } from 'src/actions/Hr/locations';
import { UseGetApprovedPositions } from 'src/actions/Hr/positions';
import { UseGetApprovedOrganizations } from 'src/actions/Hr/organizations';
import { UseGetpersonfamily, UseEditpersonfamily } from 'src/actions/Hr/family';
import { useGetAllLookups, useGetAllPayrolls } from 'src/actions/shared/shared';
import { UseGetPerson, UseGetPersons, UseCorrectPerson } from 'src/actions/Hr/person';
import {
  UseupdateContract,
  UsecorrectContract,
  useGetContractsByPersonId,
} from 'src/actions/Hr/contract';
import {
  UseupdateemplHistory,
  UsecorrectemplHistory,
  UseGetContractHistoriesByPersonId,
} from 'src/actions/Hr/emplHistory';

import { Iconify } from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import hasFormChanges from 'src/components/Form/form-data-changes';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import {ProfileCover} from 'src/sections/user/profile-cover';

import FamilyList from '../family-list';
import PersonalNewEditForm from '../personal-new-edit-form';
import ContractNewEditForm from '../contract-new-edit-form';
import EmploymentNewEditForm from '../employment-new-edit-form';

import type { FamilyListNewEditFormHandle } from '../family-list';
import type { PersonalNewEditFormHandle } from '../personal-new-edit-form';
import type { ContractNewEditFormHandle } from '../contract-new-edit-form';
import type { EmploymentNewEditFormHandle } from '../employment-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  id: string;
};
const useFetchPersonData = (id: any) => {
  const [personData, setpersonData] = useState<IPersonInfo | null>(null);
  const [personcontactHistoy, setpersoncontactHistoy] = useState<any | null>(null);
  const [personempHistoy, setpersonempHistoy] = useState<any | null>(null);
  const [personfamilyData, setpersonfamily] = useState<any | null>(null);
  const [loading, setLoading] = useState<any>(true);
  const { person, personValidating, refetch: refetchPerson } = UseGetPerson(id);
  const {
    personContracts,
    personContractsValidating,
    refetch: refetchpersoncontactHistoy,
  } = useGetContractsByPersonId(id);
  const {
    personEmploy,
    personEmployValidating,
    refetch: refetchpersonempHistoy,
  } = UseGetContractHistoriesByPersonId(id);
  const {
    personfamily,
    personfamilyValidating,
    personfamilyLoading,
    refetch: refetchpersonfamily,
  } = UseGetpersonfamily(id);
  const refetch = useCallback(() => {
    refetchPerson();
    refetchpersonfamily();
    refetchpersoncontactHistoy();
    refetchpersonempHistoy();
  }, [refetchPerson, refetchpersonfamily, refetchpersoncontactHistoy, refetchpersonempHistoy]);
  useEffect(() => {
    if (
      !personValidating &&
      !personfamilyValidating &&
      !personContractsValidating &&
      !personEmployValidating
    ) {
      setpersonData(person);
      setpersoncontactHistoy(personContracts);
      setpersonempHistoy(personEmploy);
      setpersonfamily(personfamily);
      setLoading(false);
    }
  }, [
    personValidating,
    person,
    personfamily,
    personfamilyValidating,
    personContracts,
    personContractsValidating,
    personEmployValidating,
    personEmploy,
  ]);

  return {
    personData,
    personempHistoy,
    personcontactHistoy,
    personfamilyData,
    loading,
    refetch,
    personfamilyLoading,
  };
};

export default function PersonEditView({ id }: Props) {
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
  const {
    personData,
    personempHistoy,
    personfamilyData,
    personcontactHistoy,
    personfamilyLoading,
    loading,
    refetch,
  } = useFetchPersonData(id);

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

  const [currentPersonalInfo, setcurrentPersonalInfo] = useState<IPersonInfo | null>();
  const [currentcontractInfo, setcurrentcontractInfo] = useState<any | null>(null);
  const [currentEmploymentInfo, setcurrentEmploymentInfo] = useState<any | null>(null);
  const [currentFamilyInfo, setcurrentFamilyInfo] = useState<IFamilyInfo[] | null>();
  const [currenthistoy, setcurrenthistoy] = useState<any[]>();
  const [currentEmphistoy, setcurrentEmphistoy] = useState<any[]>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('personal');
  const personalInfoForm = useRef<PersonalNewEditFormHandle>(null);
  const contractInfoForm = useRef<ContractNewEditFormHandle>(null);
  const employmentInfoForm = useRef<EmploymentNewEditFormHandle>(null);
  const familyInfoForm = useRef<FamilyListNewEditFormHandle>(null);
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
    [currentTab, personalInfoForm, contractInfoForm, employmentInfoForm, familyInfoForm]
  );
  const mapPersonInfo = (currentPersonal: any): any => {
    const emplContractDTOS =
      currentPersonal?.emplContractDTOS?.map((currentContract: any) => ({
        startDate: currentContract?.startDate
          ? formatDateTimeToISOString(currentContract.startDate)
          : null,
        endDate: currentContract?.endDate
          ? formatDateTimeToISOString(currentContract.endDate)
          : null,
        employmentType: currentContract?.employmentType || '',
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
        reason: currentContract?.reason || '',
        notes: currentContract?.notes || '',
        legalEntityId: 1,
        contractKey: Math.floor(Math.random() * 1000000),
        uniqueId: Math.floor(Math.random() * 1000000),
        contractId: currentContract?.contractId || Math.floor(Math.random() * 1000000),
      })) || [];

    const emplContractHistoryDTOS =
      currentPersonal?.emplContractHistoryDTOS?.map((currentEmployment: any) => ({
        startDate: currentEmployment?.startDate
          ? formatDateTimeToISOString(currentEmployment.startDate)
          : null,
        endDate: currentEmployment?.endDate
          ? formatDateTimeToISOString(currentEmployment.endDate)
          : null,
        actionCode: currentEmployment?.actionCode || '',
        approvalStatus: currentEmployment?.approvalStatus || 'DRAFT',
        positionId: currentEmployment?.positionId || '',
        organizationId: currentEmployment?.organizationId || '',
        jobId: currentEmployment?.jobId || '',
        gradeId: currentEmployment?.gradeId || '',
        locationId: currentEmployment?.locationId || '',
        payrollId: currentEmployment?.payrollId || '',
        managerId: currentEmployment?.managerId || '',
        uniqueId: Math.floor(Math.random() * 1000000),
        contractId: currentEmployment?.contractId || Math.floor(Math.random() * 1000000),
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
      dateOfBirth: currentPersonal?.dateOfBirth
        ? formatDateTimeToISOString(currentPersonal.dateOfBirth)
        : null,
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
      uniqueId: Math.floor(Math.random() * 1000000),
      saveOrSubmit: currentPersonal?.saveOrSubmit ?? 'SUBMITTED',
      emplContractDTOS,
      emplContractHistoryDTOS,
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
      data = {
        ...currentData,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }],
      };
      fdata = currentFamilyInfo;
    }
    if (contractInfoForm.current) {
      formValid = await contractInfoForm.current.validate();
      currentData = contractInfoForm.current.formData();
      data = {
        ...currentPersonalInfo,
        emplContractDTOS: [{ ...currentData }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }],
      };
      fdata = currentFamilyInfo;
    }
    if (employmentInfoForm.current) {
      formValid = await employmentInfoForm.current.validate();
      currentData = employmentInfoForm.current.formData();
      data = {
        ...currentPersonalInfo,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentData }],
      };
      fdata = currentFamilyInfo;
    }
    if (familyInfoForm.current) {
      formValid = await familyInfoForm.current.validate();
      currentData = familyInfoForm.current.formData();
      data = {
        ...currentPersonalInfo,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }],
      };
      fdata = currentData;
    }
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });

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
        const res = await UseCorrectPerson(mappedPersonInfo);
        if (res.status === 200 || res.status === 201) {
          if (mappedPersonFamilyInfo.length > 0) {
            for (const familyInfo of mappedPersonFamilyInfo) {
              try {
                // if(
                //   familyInfo.approvalStatus!=='PENDING'
                // ){

                const res2 = await UseEditpersonfamily(familyInfo);
                if (res2.status === 200 || res2.status === 201) {
                  refetch();

                  toast.success(t('Corrected successfully!'));
                  router.push(paths.hr.personManagement.management);
                  setcurrentPersonalInfo(null);
                  setcurrentcontractInfo(null);
                  setcurrentEmploymentInfo(null);
                  setcurrentFamilyInfo(null);
                }
                // }
              } catch (error: any) {
                setSubmitLoading(false);
                toast.error(`Family: ${error.message}`);
              }
            }
          } else {
            toast.success(t('Corrected successfully!'));

            refetch();
            router.push(paths.hr.personManagement.management);
            setcurrentPersonalInfo(null);
            setcurrentcontractInfo(null);
            setcurrentEmploymentInfo(null);
            setcurrentFamilyInfo(null);
          }
        }
      } catch (error: any) {
        setSubmitLoading(false);
        toast.error(error.message);
      }
    }
  };
  const handleCorrectContract = async () => {
    let currentData = null;
    let formValid = false;
    let contractData: any = null;

    // Validate and gather data from the contract form
    if (contractInfoForm.current) {
      formValid = await contractInfoForm.current.validate();
      currentData = contractInfoForm.current.formData();

      // Map contract data
      contractData = {
        personId: Number(id),
        ...currentData,
        uniqueId: Math.floor(Math.random() * 1000000), // Replace with generateUniqueId if available
        contractId: currentData?.contractId || Math.floor(Math.random() * 1000000),
        startDate: currentData?.startDate ? formatDateTimeToISOString(currentData.startDate) : null,
        endDate: currentData?.endDate ? formatDateTimeToISOString(currentData.endDate) : null,
      };
    }

    // If form is invalid, stop further execution
    if (!formValid) {
      // enqueueSnackbar('Please correct the errors in the form.', { variant: 'error' });
      return;
    }

    // Convert boolean values to integers if needed
    Object.keys(contractData).forEach((key) => {
      if (typeof contractData[key] === 'boolean') {
        contractData[key] = contractData[key] ? 1 : 0;
      }
    });

    // Submit or update contract data based on actionType
    try {
      setSubmitLoading(true);

      const res = await UsecorrectContract(contractData);

      if (res.status === 200 || res.status === 201) {
        toast.success(t('Contract Corrected successfully!'));

        // Reset contract info state
        setcurrentcontractInfo(null);

        // Optionally, redirect or refresh data
        refetch();
        router.push(paths.hr.personManagement.management);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleUpdateContract = async () => {
    let currentData = null;
    let formValid = false;
    let contractData: any = null;

    // Validate and gather data from the contract form
    if (contractInfoForm.current) {
      formValid = await contractInfoForm.current.validate();
      currentData = contractInfoForm.current.formData();

      // Map contract data
      contractData = {
        personId: Number(id),
        ...currentData,
        uniqueId: Math.floor(Math.random() * 1000000), // Replace with generateUniqueId if available
        contractId: currentData?.contractId || Math.floor(Math.random() * 1000000),
        startDate: currentData?.startDate ? formatDateTimeToISOString(currentData.startDate) : null,
        endDate: currentData?.endDate ? formatDateTimeToISOString(currentData.endDate) : null,
      };
    }

    // If form is invalid, stop further execution
    if (!formValid) {
      // enqueueSnackbar('Please correct the errors in the form.', { variant: 'error' });
      return;
    }

    // Convert boolean values to integers if needed
    Object.keys(contractData).forEach((key) => {
      if (typeof contractData[key] === 'boolean') {
        contractData[key] = contractData[key] ? 1 : 0;
      }
    });

    // Submit or update contract data based on actionType
    try {
      setSubmitLoading(true);

      const res = await UseupdateContract(contractData);

      if (res.status === 200 || res.status === 201) {
        toast.success(t('Contract Updated successfully!'));

        // Reset contract info state
        setcurrentcontractInfo(null);

        // Optionally, redirect or refresh data
        refetch();
        router.push(paths.hr.personManagement.management);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleCorrectemplHistory = async () => {
    let currentData = null;
    let formValid = false;
    let contractData: any = null;

    // Validate and gather data from the contract form
    if (employmentInfoForm.current) {
      formValid = await employmentInfoForm.current.validate();
      currentData = employmentInfoForm.current.formData();

      // Map employmentInfoForm data
      contractData = {
        personId: Number(id),
        ...currentData,
        uniqueId: Math.floor(Math.random() * 1000000), // Replace with generateUniqueId if available
        contractId: currentData?.contractId || Math.floor(Math.random() * 1000000),
        startDate: currentData?.startDate ? formatDateTimeToISOString(currentData.startDate) : null,
        endDate: currentData?.endDate ? formatDateTimeToISOString(currentData.endDate) : null,
      };
    }

    // If form is invalid, stop further execution
    if (!formValid) {
      // enqueueSnackbar('Please correct the errors in the form.', { variant: 'error' });
      return;
    }

    // Convert boolean values to integers if needed
    Object.keys(contractData).forEach((key) => {
      if (typeof contractData[key] === 'boolean') {
        contractData[key] = contractData[key] ? 1 : 0;
      }
    });

    // Submit or update contract data based on actionType
    try {
      setSubmitLoading(true);

      const res = await UsecorrectemplHistory(contractData);

      if (res.status === 200 || res.status === 201) {
        toast.success(t('Employment Corrected successfully!'));

        // Reset contract info state
        setcurrentcontractInfo(null);

        // Optionally, redirect or refresh data
        refetch();
        router.push(paths.hr.personManagement.management);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };
  const handleUpdateemplHistory = async () => {
    let currentData = null;
    let formValid = false;
    let contractData: any = null;

    // Validate and gather data from the contract form
    if (employmentInfoForm.current) {
      formValid = await employmentInfoForm.current.validate();
      currentData = employmentInfoForm.current.formData();

      // Map employmentInfoForm data
      contractData = {
        personId: Number(id),
        ...currentData,
        uniqueId: Math.floor(Math.random() * 1000000), // Replace with generateUniqueId if available
        contractId: currentData?.contractId || Math.floor(Math.random() * 1000000),
        startDate: currentData?.startDate ? formatDateTimeToISOString(currentData.startDate) : null,
        endDate: currentData?.endDate ? formatDateTimeToISOString(currentData.endDate) : null,
      };
    }

    // If form is invalid, stop further execution
    if (!formValid) {
      // enqueueSnackbar('Please correct the errors in the form.', { variant: 'error' });
      return;
    }

    // Convert boolean values to integers if needed
    Object.keys(contractData).forEach((key) => {
      if (typeof contractData[key] === 'boolean') {
        contractData[key] = contractData[key] ? 1 : 0;
      }
    });

    // Submit or update contract data based on actionType
    try {
      setSubmitLoading(true);

      const res = await UseupdateemplHistory(contractData);

      if (res.status === 200 || res.status === 201) {
        toast.success(t('Employment Updated successfully!'));

        // Reset contract info state
        setcurrentcontractInfo(null);

        // Optionally, redirect or refresh data
        refetch();
        router.push(paths.hr.personManagement.management);
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitLoading(false);
    }
  };
  useEffect(() => {
    if (!loading) {
      setcurrentPersonalInfo(personData);
      const contractindex = (personData?.emplContractDTOS?.length ?? 0) - 1;

      setcurrentcontractInfo(
        personData?.emplContractDTOS ? personData?.emplContractDTOS[contractindex] : null
      );
      const Employmentindex = (personData?.emplContractHistoryDTOS?.length ?? 0) - 1;
      setcurrentEmploymentInfo(
        personData?.emplContractHistoryDTOS
          ? personData?.emplContractHistoryDTOS[Employmentindex]
          : null
      );
      setcurrentFamilyInfo(personfamilyData);
      // setcurrenthistoy(personData?.emplContractDTOS);
      setcurrenthistoy(personcontactHistoy);
      setcurrentEmphistoy(personempHistoy);
    }

    return () => {
      setcurrentPersonalInfo(null);
      setcurrentcontractInfo(null);
      setcurrentEmploymentInfo(null);
      setcurrentFamilyInfo(null);
    };
  }, [loading, personData, personcontactHistoy, personempHistoy, personfamilyData]);

  //--------------
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Person Details')}
        links={[
          { name: t('Human Resources'), href: paths.dashboard.root },
          { name: t('Persons'), href: paths.hr.personManagement.root },
          { name: t('Person Details') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={<BackButton label={t('Back')} />}
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
        (loading ||
        MARITAL_STATUSTypesLoading ||
        GENDERTypesLoading ||
        RELIGIONTypesLoading ||
        countriesLoading ||
        // EDUCATION_LEVELLoading ||
        !currentPersonalInfo ||
        !MARITAL_STATUSTypes ||
        !GENDERTypes ||
        !RELIGIONTypes ||
        // !EDUCATION_LEVEL ||
        !countries ? (
          <>
            <ButtonSkeleton buttons={1} />

            <FormSkeleton fields={14} />
          </>
        ) : (
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
            isNotChanged={currentPersonalInfo?.changeable === false}
          />
        ))}
      {currentTab === 'contract' &&
        (loading ||
        !currentPersonalInfo ||
        TIME_UNITSLoading ||
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
            operation="edit"
            currentContract={currentcontractInfo || undefined}
            ActiveContractid={
              personData?.emplContractDTOS
                ? personData?.emplContractDTOS[(personData?.emplContractDTOS?.length ?? 0) - 1]
                    ?.contractId
                : undefined
            }
            TIME_UNITSLoading={TIME_UNITSLoading}
            TIME_UNITS_Types={TIME_UNITS_Types}
            END_CONTRACT_REASONS={END_CONTRACT_REASONS}
            END_CONTRACT_REASONSLoading={END_CONTRACT_REASONSLoading}
            EMPLOYMENT_TYPE={EMPLOYMENT_TYPE}
            EMPLOYMENT_TYPELoading={EMPLOYMENT_TYPELoading}
            submit={handleSubmit}
            handleUpdateContract={handleUpdateContract}
            handleCorrectContract={handleCorrectContract}
            currenthistoy={currenthistoy}
            isNotChanged={currentPersonalInfo?.changeable === false}
          />
        ))}
      {currentTab === 'employment' &&
        (loading ||
        !currentPersonalInfo ||
        approvedlocationsLoading ||
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
            operation="edit"
            currentEmployment={currentEmploymentInfo || undefined}
            ActiveEmploymentid={
              personData?.emplContractHistoryDTOS
                ? personData?.emplContractHistoryDTOS[
                    (personData?.emplContractHistoryDTOS?.length ?? 0) - 1
                  ]?.historyId
                : undefined
            }
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
            currentcontacthistoy={currentEmphistoy}
            handleCorrectemplHistory={handleCorrectemplHistory}
            handleUpdateemplHistory={handleUpdateemplHistory}
            isNotChanged={currentPersonalInfo?.changeable === false}
          />
        ))}
      {currentTab === 'family' &&
        (loading ||
        MARITAL_STATUSTypesLoading ||
        GENDERTypesLoading ||
        RELIGIONTypesLoading ||
        countriesLoading ||
        RELATIONSHIP_TYPELoading ||
        EDUCATION_LEVELLoading ||
        // !currentFamilyInfo ||
        !MARITAL_STATUSTypes ||
        !GENDERTypes ||
        !RELIGIONTypes ||
        !RELATIONSHIP_TYPE ||
        !EDUCATION_LEVEL ||
        !countries ? (
          <FormSkeleton fields={6} />
        ) : (
          <FamilyList
            ref={familyInfoForm}
            operation="edit"
            parentPersonId={Number(id)}
            personfamilyLoading={personfamilyLoading}
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
            isNotChanged={currentPersonalInfo?.changeable === false}
          />
        ))}
    </Container>
  );
}
