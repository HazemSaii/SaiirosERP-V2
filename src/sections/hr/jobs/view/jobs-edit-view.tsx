import { toast } from 'sonner';
import { useRef, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { UseGetApprovedJobFamilies, } from 'src/actions/Hr/jobFamily';
import { UseGetJob, UseEditJobs, UseGetApprovedJobs } from 'src/actions/Hr/jobs';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import hasFormChanges from 'src/components/Form/form-data-changes';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import JobsNewEditForm from '../jobs-new-edit-form';

import type { JobsNewEditFormHandle } from '../jobs-new-edit-form';

type Props = {
  id: string;
};

const useFetchFamilyData = (id: any) => {
  const [familyData, setfamilyData] = useState<any | null>(null);
  const [loading, setLoading] = useState<any>(true);
  const { currentLang } = useLocales();
  console.log('id', id);

  const { jobs, jobsValidating, refetch: refetchjob } = UseGetJob(id);

  const refetch = useCallback(() => {
    refetchjob();
  }, [refetchjob]);
  useEffect(() => {
    if (!jobsValidating) {
      setfamilyData(jobs);
      setLoading(false);
    }
  }, [jobsValidating, jobs]);

  return { familyData, loading, refetch };
};

export default function JobsEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  const router = useRouter();
  const { familyData, loading, refetch } = useFetchFamilyData(id);

  const { approvedjobFamilies, approvedjobFamiliesLoading } = UseGetApprovedJobFamilies(currentLanguage);

  const { approvedjobs, approvedjobsLoading } = UseGetApprovedJobs(currentLanguage);
  const { lookups: familySTATUS, lookupsLoading: familySTATUSLoading } = useGetAllLookups(
    'APPROVAL_STATUS',
    currentLanguage
  );


  const TABS = [
    {
      value: 'Job-Info',
      label: t('Job Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];

  const [currentJobInfo, setcurrentJobInfo] = useState<any | null>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('Job-Info');
  const JobInfoForm = useRef<JobsNewEditFormHandle>(null);

  const mapJobInfo = (currentJob: any): any => {
    const jobTlDTO = [];

    if (currentJob?.jobName?.AR?.trim()) {
      jobTlDTO.push({
        jobId: Number(id),
        jobName: currentJob.jobName.AR,
        langCode: 'AR',
      });
    }

    if (currentJob?.jobName?.EN?.trim()) {
      jobTlDTO.push({
        jobId: Number(id),
        jobName: currentJob.jobName.EN,
        langCode: 'EN',
      });
    }

    return {
      jobId: Number(id),
      approvalStatus: currentJob?.approvalStatus ?? '',
      progressingJobId: currentJob?.progressingJobId,
      active: currentJob?.active || 0,
      jobFamily: currentJob?.jobFamily,
      uniqueId:currentJob?.uniqueId|| Math.floor(Math.random() * 1000000),
      jobTlDTO,
    };
  };

  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (JobInfoForm.current) {
      formValid = await JobInfoForm.current.validate();
      currentData = JobInfoForm.current.formData();
      data = { ...currentData };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });

    data.id = id;
    const mappedJobInfo = mapJobInfo(data);

    if (!formValid) return;
    const hasChanges = hasFormChanges([familyData], [mapJobInfo(data)]);

    if (!hasChanges) {
      toast.info(t('No changes to save.'));
      router.push(paths.hr.jobs.management);
    } else {
      try {
        setSubmitLoading(true);
        const res = await UseEditJobs(mappedJobInfo);
        if (res.status === 200) {
          refetch();
          toast.success(t('Edited successfully!'));
          router.push(paths.hr.jobs.management);
          setcurrentJobInfo(null);
        }
      } catch (error:any) {
        setSubmitLoading(false);
        toast.error(error.message);

      }
    }
  };
  useEffect(() => {
    if (!loading) {
      console.log(familyData);

      setcurrentJobInfo(familyData);
    }
    return () => {
      setcurrentJobInfo(null);
    };
  }, [loading, familyData]);

  //--------------
 
  const jobName =
    familyData?.jobTlDTO?.find((org: any) => org.langCode === currentLang.value.toUpperCase())?.jobName || '';

  return (
    <Container >
      <CustomBreadcrumbs
        heading={`${t('Edit Job')} ${jobName}`}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Jobs'),
            href: paths.hr.jobs.root,
          },
          { name: t('Edit Job') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <div>
            {loading || !currentJobInfo ? (
              <ButtonSkeleton buttons={2} />
            ) : (
              <>
                <BackButton label={t('Cancel')} />
                {currentJobInfo?.approvalStatus !== 'PENDING' && (
                  <LoadingButton
                    color="inherit"
                    onClick={handleSubmit}
                    variant="contained"
                    loading={submitLoading}
                    sx={{ mt: 5 }}
                  >
                    {t('Submit')}
                  </LoadingButton>
                )}
              </>
            )}
          </div>
        }
      />

      <Tabs
        value={currentTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>

      {currentTab === 'Job-Info' &&
        (!loading &&
        currentJobInfo ? (
          <JobsNewEditForm
            ref={JobInfoForm}
            currentjobName={currentJobInfo || undefined}
            operation="edit"
            familySTATUSLoading={familySTATUSLoading}
            familySTATUS={familySTATUS}
            jobFamilies={approvedjobFamilies}
            jobFamiliesLoading={approvedjobFamiliesLoading}
            jobs={approvedjobs}
            jobsLoading={approvedjobsLoading}
          />
        ) : (
          
          <FormSkeleton fields={5} />

        ))}
    </Container>
  );
}
