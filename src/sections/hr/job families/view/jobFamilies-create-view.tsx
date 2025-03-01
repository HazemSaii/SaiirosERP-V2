import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { UseAddJobFamilies } from 'src/actions/Hr/jobFamily';
import { useGetAllLookups } from 'src/actions/shared/shared';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import JobFamiliesNewEditForm from '../jobFamilies-new-edit-form';

import type { JobFamiliesNewEditFormHandle } from '../jobFamilies-new-edit-form';

//------------------------------------------------------
export default function JobFamiliesCreateView() {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;

  const { lookups: familySTATUS, lookupsLoading: familySTATUSLoading } = useGetAllLookups(
    'APPROVAL_STATUS',
    currentLanguage
  );

  const TABS = [
    {
      value: 'Jobfamily-info',
      label: t('Job Family Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];
  const settings = useSettingsContext();
  const [currentJobfamilyInfo, setcurrentJobfamilyInfo] = useState<any>();

  const [currentTab, setCurrentTab] = useState('Jobfamily-info');

  const [submitLoading, setSubmitLoading] = useState(false);

  const jobfamilyInfoForm = useRef<JobFamiliesNewEditFormHandle>(null);

  const mapJobfamiliesInfo = (currentJobfamily: any): any => {
    const jobFamiliesTlDTO = ['AR', 'EN']
      .map((lang) => ({
        langCode: lang,
        jobFamilyName: currentJobfamily.jobFamilyName?.[lang] || '',
      }))
      .filter((org) => org.jobFamilyName.trim());
    return {
      id: 0,
      approvalStatus: currentJobfamily?.approvalStatus ?? 'Draft',
      familyName: currentJobfamily.jobFamilyName.EN,
      active: currentJobfamily?.active || 0,
      jobFamiliesTlDTO,
    };
  };

  const handleSubmit = async () => {
    
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (jobfamilyInfoForm.current) {
      formValid = await jobfamilyInfoForm.current.validate();
      currentData = jobfamilyInfoForm.current.formData();
      data = { ...currentData };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    const mappedJobFamilyInfo = mapJobfamiliesInfo(data);

    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const res = await UseAddJobFamilies(mappedJobFamilyInfo);
      if (res.status === 200) {
        toast.success(t('Created successfully!'));
        router.push(paths.hr.jobFamilies.management);
      }
    } catch (error:any) {
      setSubmitLoading(false);
      toast.error(error.message);
    }
  };

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;
      if (currentTab === 'Jobfamily-info' && jobfamilyInfoForm.current) {
        isValid = await jobfamilyInfoForm.current.validate();
        formData = jobfamilyInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;

        setcurrentJobfamilyInfo(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, jobfamilyInfoForm]
  );
  //--------------
  return (
    <Container maxWidth='lg'>
      <CustomBreadcrumbs
        heading={t('Create New Job Family')}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Job Families'),
            href: paths.hr.jobFamilies.root,
          },
          { name: t('New Job Family') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <div>
            <BackButton label={t('Cancel')} />
            <LoadingButton
              color="inherit"
              onClick={handleSubmit}
              variant="contained"
              loading={submitLoading}
              sx={{ mt: 5 }}
            >
              {t('Submit')}
            </LoadingButton>
          </div>
        }
      />
      <Tabs
        value={currentTab}
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'Jobfamily-info'  ? 
          <JobFamiliesNewEditForm
            ref={jobfamilyInfoForm}
            currentjobfamily={currentJobfamilyInfo || undefined}
            operation="create"
            familySTATUSLoading={familySTATUSLoading}
            familySTATUS={familySTATUS}
          />
       : (
          <FormSkeleton fields={3} />

        )}
    </Container>
  );
}
