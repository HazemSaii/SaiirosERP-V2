import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { UseGetApprovedJobFamilies } from 'src/actions/Hr/jobFamily';
import { UseAddJobs, UseGetApprovedJobs  } from 'src/actions/Hr/jobs';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import JobsNewEditForm from '../jobs-new-edit-form';

import type { JobsNewEditFormHandle } from '../jobs-new-edit-form';

export default function JobsCreateView() {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;

  // el goz2 da btz3 api el approval
  const { lookups: familySTATUS, lookupsLoading: familySTATUSLoading } = useGetAllLookups(
    'APPROVAL_STATUS',
    currentLanguage
  );
  // api el jobfamily
  // const { jobFamilies, jobFamiliesLoading } = useGetJobFamilies(currentLanguage);
  const { approvedjobFamilies, approvedjobFamiliesLoading } = UseGetApprovedJobFamilies(currentLanguage);

  const { approvedjobs, approvedjobsLoading } = UseGetApprovedJobs(currentLanguage);

  const TABS = [
    {
      value: 'Job-info',
      label: t('Job Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];
  const settings = useSettingsContext();
  const [currentJobInfo, setcurrentJobInfo] = useState<any>();

  const [currentTab, setCurrentTab] = useState('Job-info');

  const [submitLoading, setSubmitLoading] = useState(false);

  const jobInfoForm = useRef<JobsNewEditFormHandle>(null);

  const mapJobInfo = (currentJob: any): any => {
    const jobTlDTO = [];

    if (currentJob?.jobName?.AR?.trim()) {
      jobTlDTO.push({
        langCode: 'AR',
        jobName: currentJob.jobName.AR,
      });
    }

    if (currentJob?.jobName?.EN?.trim()) {
      jobTlDTO.push({
        langCode: 'EN',
        jobName: currentJob.jobName.EN,
      });
    }

    return {
      id: 0,
      jobFamily: currentJob?.jobFamily ?? '',
      approvalStatus: currentJob?.approvalStatus ?? '',
      progressingJobId: currentJob?.progressingJobId ?? '',

      active: currentJob?.active || 0,
      jobTlDTO,
    };
  };

  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (jobInfoForm.current) {
      formValid = await jobInfoForm.current.validate();
      currentData = jobInfoForm.current.formData();
      data = { ...currentData };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    const mappedJobInfo = mapJobInfo(data);

    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const res = await UseAddJobs(mappedJobInfo);
      if (res.status === 201) {
        toast.success(t('Created successfully!'));
        router.push(paths.hr.jobs.management);
      }
    } catch (error:any) {
      setSubmitLoading(false);
      toast.error(error.message)
    }
  };

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;
      if (currentTab === 'Job-info' && jobInfoForm.current) {
        isValid = await jobInfoForm.current.validate();
        formData = jobInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;

        setcurrentJobInfo(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, jobInfoForm]
  );
  //--------------

  return (
    <Container >
      <CustomBreadcrumbs
        heading={t('Create New Job')}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Jobs'),
            href: paths.hr.jobs.root,
          },
          { name: t('New Job') },
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

      {currentTab === 'Job-info' &&
        (familySTATUSLoading ||
        !familySTATUS ||
        !approvedjobFamilies ||
        approvedjobFamiliesLoading ||
        !approvedjobs ||
        approvedjobsLoading ? (
          <FormSkeleton fields={5} />
        ) : (
          <JobsNewEditForm
            ref={jobInfoForm}
            currentjobName={currentJobInfo || undefined}
            operation="create"
            familySTATUSLoading={familySTATUSLoading}
            familySTATUS={familySTATUS}
            jobFamilies={approvedjobFamilies}
            jobFamiliesLoading={approvedjobFamiliesLoading}
            jobs={approvedjobs}
            jobsLoading={approvedjobsLoading}
          />
        ))}
    </Container>
  );
}
