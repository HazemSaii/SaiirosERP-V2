import type { IPesonalInfo, IContractInfo, IEmploymentInfo } from 'src/types/persons';

import { t } from 'i18next';
import { toast } from 'sonner';
import React, { useRef, useState, useCallback } from 'react';

import { LoadingButton } from '@mui/lab';
import {
  Box,
  Step,
  Avatar,
  Button,
  Stepper,
  StepLabel,
  Container,
  IconButton,
  
  Typography,
} from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { formatDateTimeToISOString } from 'src/utils/general-utils';

import { useLocales } from 'src/locales';
import { UseGetApprovedJobs } from 'src/actions/Hr/jobs';
import { UseGetApprovedGrades } from 'src/actions/Hr/grades';
import { useGetCountries } from 'src/actions/settings/countries';
import { useGetApprovedLocations } from 'src/actions/Hr/locations';
import { UseGetApprovedPositions } from 'src/actions/Hr/positions';
import { UseGetApprovedOrganizations } from 'src/actions/Hr/organizations';
import { UseAddPerson, UseGetApprovedPersons } from 'src/actions/Hr/person';
import { useGetAllLookups, useGetAllPayrolls } from 'src/actions/shared/shared';

import BackButton from 'src/components/buttons';
import { useSettingsContext } from 'src/components/settings';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import ContractNewEditForm from '../contract-new-edit-form';
import PersonalNewEditForm from '../personal-new-edit-form';
import EmploymentNewEditForm from '../employment-new-edit-form';

import type { FamilyNewEditFormHandle } from '../family-new-edit-form';
import type { ContractNewEditFormHandle } from '../contract-new-edit-form';
import type { PersonalNewEditFormHandle } from '../personal-new-edit-form';
import type { EmploymentNewEditFormHandle } from '../employment-new-edit-form';







const PersonNewView = () => {
  const steps = [
    { label:t("Demographic Information"), icon: '1' },
    { label: t('Contract'), icon: '2' },
    { label: t('Employment'), icon: '3' },
  ];

  const [image, setImage] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const settings = useSettingsContext();
  const { currentLang } = useLocales();
  const router = useRouter();

  const [currentPersonalInfo, setcurrentPersonalInfo] = useState<IPesonalInfo>();
  const [currentcontractInfo, setcurrentcontractInfo] = useState<IContractInfo>();
  const [currentEmploymentInfo, setcurrentEmploymentInfo] = useState<IEmploymentInfo>();
  const [submitLoading, setSubmitLoading] = useState(false);

  const { approvedpositions, approvedpositionsLoading } = UseGetApprovedPositions(
      currentLang.value
    );
    const { approvedjobs, approvedjobsLoading } =     UseGetApprovedJobs(currentLang.value);
    const { approvedGrades, approvedGradesLoading } = UseGetApprovedGrades(currentLang.value);
    const { approvedlocations, approvedlocationsLoading } = useGetApprovedLocations(
      currentLang.value
    );
    const { approvedpersons, approvedpersonsLoading } = UseGetApprovedPersons(currentLang.value);
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


  const personalInfoForm = useRef<PersonalNewEditFormHandle>(null);
  const contractInfoForm = useRef<ContractNewEditFormHandle>(null);
  const employmentInfoForm = useRef<EmploymentNewEditFormHandle>(null);
  const familyInfoForm = useRef<FamilyNewEditFormHandle>(null);
  const [activeStep, setActiveStep] = useState(0);

  

  const handleNavigation = useCallback(
    async (direction:any) => {
      let formData = null;
      let isValid = true;
  
      if (activeStep === 0 && personalInfoForm.current) {
        isValid = await personalInfoForm.current.validate();
        formData = personalInfoForm.current.formData();
        formData.registeredDisabled = formData.registeredDisabled ? 1 : 0;
        console.log('Step 1', formData);
        setcurrentPersonalInfo(formData);
      }
      if (activeStep === 1 && contractInfoForm.current) {
        isValid = await contractInfoForm.current.validate();
        formData = contractInfoForm.current.formData();
        formData.registeredDisabled = formData.registeredDisabled ? 1 : 0;
        console.log('Step 2', formData);
        setcurrentcontractInfo(formData);
      }
      if (activeStep === 2 && employmentInfoForm.current) {
        isValid = await employmentInfoForm.current.validate();
        formData = employmentInfoForm.current.formData();
        formData.registeredDisabled = formData.registeredDisabled ? 1 : 0;
        console.log('Step 3', formData);
        setcurrentEmploymentInfo(formData);
      }
  
      if (isValid) {
        setActiveStep((prevStep) => prevStep + direction);
      }
    },
    [activeStep]
  );
  
  const mapPersonInfo = (currentPersonal: any): any => {
    
    const emplContractDTOS =
    currentPersonal?.emplContractDTOS?.map((currentContract: any) => ({
      startDate: currentContract?.startDate ?formatDateTimeToISOString(currentContract.startDate) : null,
      endDate: currentContract?.endDate ?formatDateTimeToISOString(currentContract.endDate) : null,
      // endDate: currentContract?.startDate ? new Date(new Date(currentContract.startDate).setDate(new Date(currentContract.startDate).getDate() + 1)) : null,
      employmentType:currentContract?.employmentType  || '',
      approvalStatus: currentContract?.approvalStatus || 'DRAFT',
        probationLength: currentContract?.probationLength || '',
        probationUnits: currentContract?.probationUnits || '',
        probationEndDate: currentContract?.probationEndDate
          ?formatDateTimeToISOString(currentContract.probationEndDate)
          : null,
        employeeNoticeLength: currentContract?.employeeNoticeLength || '',
        employeeNoticeUnits: currentContract?.employeeNoticeUnits || '',
        employerNoticeLength: currentContract?.employerNoticeLength || '',
        employerNoticeUnits: currentContract?.employerNoticeUnits || '',
        finalProcessDate: currentContract?.finalProcessDate
          ? formatDateTimeToISOString(currentContract.finalProcessDate)
          : null,
          reason: currentContract?.reason  || '',
          notes: currentContract?.notes || '',
        legalEntityId:  1,
        contractKey: Math.floor(Math.random() * 1000000),
        uniqueId:  Math.floor(Math.random() * 1000000),
        // contractId: currentContract?.contractId  || Math.floor(Math.random() * 1000000),

      })) || [];
    const emplContractHistoryDTOS =
    currentPersonal?.emplContractHistoryDTOS?.map((currentEmployment: any) => ({
      startDate: currentEmployment?.startDate ? formatDateTimeToISOString(currentEmployment.startDate) : null,
      endDate: currentEmployment?.startDate ? new Date(new Date(currentEmployment.startDate).setDate(new Date(currentEmployment.startDate).getDate() + 1)) : null,
      actionCode: currentEmployment?.actionCode  || '',
   approvalStatus: 'DRAFT',
  positionId: currentEmployment?.positionId  || '',
  organizationId: currentEmployment?.organizationId  || '',
  jobId: currentEmployment?.jobId  || '',
  gradeId: currentEmployment?.gradeId  || '',
  locationId: currentEmployment?.locationId  || '',
  payrollId: currentEmployment?.payrollId  || '',
  managerId: currentEmployment?.managerId  || '',
  uniqueId: Math.floor(Math.random() * 1000000),
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
      dateOfBirth:currentPersonal?.dateOfBirth ? formatDateTimeToISOString(currentPersonal.dateOfBirth) : null,
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
      uniqueId:  Math.floor(Math.random() * 1000000),
     saveOrSubmit: currentPersonal?.saveOrSubmit ?? 'SUBMITTED',
     emplContractDTOS,
     emplContractHistoryDTOS

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

      data = {   ...currentData ,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }] };
    }
    if (contractInfoForm.current) {
      formValid = await contractInfoForm.current.validate();
      currentData = contractInfoForm.current.formData();
      data = {   ...currentPersonalInfo ,
        emplContractDTOS: [{ ...currentData }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo }] };

    }
    if (employmentInfoForm.current) {
      formValid = await employmentInfoForm.current.validate();
      currentData = employmentInfoForm.current.formData();
      data = {   ...currentPersonalInfo ,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS:[ { ...currentData } ]};
    }
    if (familyInfoForm.current) {
     // formValid = await familyInfoForm.current.validate();
     // currentData = familyInfoForm.current.formData();
      data = {   ...currentPersonalInfo ,
        emplContractDTOS: [{ ...currentcontractInfo }],
        emplContractHistoryDTOS: [{ ...currentEmploymentInfo } ]};
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

     console.log('mappedPersonInfo', mappedPersonInfo);

    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const res = await UseAddPerson(mappedPersonInfo);
      if (res.status === 200||res.status === 201) {
        toast.success(t('Created successfully!'));
        router.push(paths.hr.personManagement.management);
      }
        setSubmitLoading(false);

      }
     catch (error:any) {
      setSubmitLoading(false);
      toast.error(error.message);
    }
  };


  


  return (
    <Container>
      
    <CustomBreadcrumbs
    
      heading={t("Hire Person")}
      links={[
        { name: t('Human Resources'), href: paths.dashboard.root },
        { name: t('Persons'), href: paths.hr.personManagement.root },
        { name: t('Hire Person') },
      ]}
      sx={{
        mb: { xs: 3, md: 5 },
      }}/>

    <Box >
    <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1, gap: 0 }}>
    <Box
      sx={{
        position: "relative",
        width: 150,
        height: 150,
        borderRadius: "50%",
        overflow: "hidden",
        cursor: "pointer",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Display the uploaded photo */}
      <Avatar
        src={image || ""}
        alt="Uploaded Photo"
        sx={{
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          backgroundColor: "#f5f5f5",
        }}
      />

      {/* Hover overlay to change photo */}
      {isHovered && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "#fff",
            fontSize: "14px",
          }}
        >
          <IconButton
            component="label"
            sx={{
              color: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* SVG icon for upload */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              width="32"
              height="32"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Upload Photo
            </Typography>
            <input
              type="file"
              accept="image/jpeg, image/png, image/gif"
              hidden
              onChange={handleImageChange}
            />
          </IconButton>
        </Box>
      )}

     
    </Box>
    

  {/* Stepper Container */}
  <Box sx={{ display: 'flex', flex: 1, alignItems: 'flex-start' , mt:4 }}>
    <Stepper alternativeLabel activeStep={activeStep} sx={{ flex: 1 }}>
      {steps.map((step, index) => (
        <Step key={step.label}>
          <StepLabel
            icon={
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  bgcolor: activeStep === index ? 'primary.main' : 'grey.300',
                  color: activeStep === index ? 'white' : 'grey.700',
                }}
              >
                <Typography variant="body2">{step.icon}</Typography>
              </Box>
            }
          >
            <Typography
              variant="caption"
              sx={{
                fontWeight: activeStep === index ? 'bold' : 'normal',
              }}
            >
              {step.label}
            </Typography>
          </StepLabel>
        </Step>
      ))}
    </Stepper>
    </Box>

</Box>


<Box
  sx={{
    display: 'flex',
    justifyContent: 'flex-end',
    gap: 2,
    p: 1,
  }}
>
  {/* Cancel or Back Button */}
  {activeStep === 0 ? (
    <BackButton 
    sx={{ height: 40, minWidth: 100,}}
    size="large"
    variant="contained"
    label={t('Cancel')} />
  ) : (
    <Button
      onClick={() => handleNavigation(-1)}
      variant="outlined"
      aria-label="Go Back"
    >
      {t('Back')}
    </Button>
  )}

  {/* Next or Submit Button */}
  {activeStep === steps.length - 1 ? (
    <LoadingButton
      type="submit"
      variant="contained"
      onClick={handleSubmit}
      loading={submitLoading}
      aria-label="Submit"
    >
      {t('Submit')}
    </LoadingButton>
  ) : (
    <Button
      onClick={() => handleNavigation(1)}
      variant="contained"
      aria-label="Go to Next Step"
      
    >
      {t('Next')}
    </Button>
  )}
</Box>



  
      {/* Form Content */}
      <Box sx={{ mt: 4 }}>
        <form>
          {activeStep === 0 && (
      //    MARITAL_STATUSTypesLoading ||
      //   GENDERTypesLoading ||
      //    RELIGIONTypesLoading ||
      //    countriesLoading ||
      //  EDUCATION_LEVELLoading ||
      //   !MARITAL_STATUSTypes ||
      //   !GENDERTypes ||
      //    !RELIGIONTypes ||
      //  !EDUCATION_LEVEL ||
      //   ! countries 
      //  ? (
          

          
      //     <FormSkeleton fields={14}  />
          

      //   ) :(
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
          // )
          )}
  
          {activeStep === 1
           && (
//         TIME_UNITSLoading ||
//         !TIME_UNITS_Types ||
//         EMPLOYMENT_TYPELoading||
//         !EMPLOYMENT_TYPE||
//         END_CONTRACT_REASONSLoading||
//         !END_CONTRACT_REASONS? (



// <FormSkeleton fields={10}  />
//        ) : 
//      (
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
        //  )
         )
        }
  
          {activeStep === 2 && ( 
//         locationsLoading ||
//         jobsLoading ||
//         locationsLoading ||
//         GradesLoading ||
//         positionsLoading ||
//         personsLoading ||
//         organizationsLoading ||
//         payrollsLoading||
//         EMPLOYMENT_ACTIONSLoading||
//         !EMPLOYMENT_ACTIONS ||
//         !jobs ||
//         !locations ||
//         !positions ||
//         !persons ||
//         !organizations ||
//         !payrolls ||
//         !Grades ? (



// <FormSkeleton fields={9}  />
//       ) : (
            <EmploymentNewEditForm
              ref={employmentInfoForm}
              operation="create"
              currentEmployment={currentEmploymentInfo || undefined}
              locationsLoading={approvedlocationsLoading}
              jobsLoading={approvedjobsLoading}
              GradesLoading={approvedGradesLoading}
              positionsLoading={approvedpositionsLoading}
              personsLoading={approvedpersonsLoading}
              organizationsLoading={approvedorganizationsLoading}
              payrollsLoading={payrollsLoading}
              EMPLOYMENT_ACTIONSLoading={EMPLOYMENT_ACTIONSLoading}
        EMPLOYMENT_ACTIONS={EMPLOYMENT_ACTIONS}
              locations={approvedlocations}
              jobs={approvedjobs}
              Grades={approvedGrades}
              positions={approvedpositions}
              persons={approvedpersons}
              organizations={approvedorganizations}
              payrolls={payrolls}
              submit={handleSubmit}
            />
          // )
          )}
        </form>
      </Box>
    </Box>
    </Container>

  );
  
};

export default PersonNewView;