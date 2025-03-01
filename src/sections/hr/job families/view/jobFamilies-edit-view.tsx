import { toast } from 'sonner';
import { useRef, useState, useEffect, useCallback } from 'react';

import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
// ----------------------------------------------------------------------
import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { UseGetJobFamilie, UseEditJobFamilies } from 'src/actions/Hr/jobFamily';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import hasFormChanges from 'src/components/Form/form-data-changes';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import JobFamiliesNewEditForm, { JobFamiliesNewEditFormHandle } from '../jobFamilies-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  id: string;
};

const useFetchFamilyData = (id: any) => {
  const [familyData, setfamilyData] = useState<any | null>(null);
  const [loading, setLoading] = useState<any>(true);
  const { currentLang } = useLocales();
  console.log('id', id);

  const { jobFamilies, jobFamiliesValidating, refetch: refetchjobfamily } = UseGetJobFamilie(id);

  const refetch = useCallback(() => {
    refetchjobfamily();
  }, [refetchjobfamily]);

  useEffect(() => {
    if (!jobFamiliesValidating) {
      setfamilyData(jobFamilies);
      setLoading(false);
    }
  }, [jobFamiliesValidating, jobFamilies]);

  return { familyData, loading, refetch };
};

export default function JobesFamiliesEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  const router = useRouter();
  const { familyData, loading, refetch } = useFetchFamilyData(id);

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

  const [currentJobFamilyInfo, setcurrentJobFamilyInfo] = useState<any | null>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('Jobfamily-info');
  const JobFamilyInfoForm = useRef<JobFamiliesNewEditFormHandle>(null);

  const mapJobfamiliesInfo = (currentJobfamily: any): any => {
    const jobFamiliesTlDTO = ['AR', 'EN']
      .map((lang) => ({
        jobFamilyName: currentJobfamily.jobFamilyName?.[lang] || '',
        langCode: lang,
      }))
      .filter((org) => org.jobFamilyName.trim());

    return {
      id: Number(id),
      approvalStatus: currentJobfamily?.approvalStatus ?? '',
      familyName: currentJobfamily.jobFamilyName.AR,
      uniqueId:currentJobfamily?.uniqueId?? Math.floor(Math.random() * 1000000),
      active: currentJobfamily?.active || 0,
      jobFamiliesTlDTO,
    };
  };

  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (JobFamilyInfoForm.current) {
      formValid = await JobFamilyInfoForm.current.validate();
      currentData = JobFamilyInfoForm.current.formData();
      data = { ...currentData };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });

    data.id = id;
    const mappedJobfamiliesInfo = mapJobfamiliesInfo(data);

    if (!formValid) return;
    const hasChanges = hasFormChanges([familyData], [mapJobfamiliesInfo(data)]);

    if (!hasChanges) {
      toast.success(t('No changes to save.'));
      router.push(paths.hr.jobFamilies.management);
    } else {
      try {
        setSubmitLoading(true);
        const res = await UseEditJobFamilies(mappedJobfamiliesInfo);
        if (res.status === 200) {
          refetch();
          toast.success(t('Edited successfully!'));
          router.push(paths.hr.jobFamilies.management);
          setcurrentJobFamilyInfo(null);
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

      setcurrentJobFamilyInfo(familyData);
    }
    return () => {
      setcurrentJobFamilyInfo(null);
    };
  }, [loading, familyData]);
  //--------------
 
  const jobFamilyName =
    familyData?.jobFamiliesTlDTO?.find((org: any) => org.langCode === (currentLang.value).toUpperCase())?.jobFamilyName ||
    '';

  //--------------
  return (
    <Container maxWidth='lg'>
      <CustomBreadcrumbs
        heading={`${t('Edit Job Family')} ${jobFamilyName}`}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Job Families'),
            href: paths.hr.jobFamilies.root,
          },
          { name: t('Edit Job Family') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <div>
            {loading || !currentJobFamilyInfo || familySTATUSLoading || !familySTATUS ? (
              <ButtonSkeleton buttons={2} />
            ) : (
              <>
                <BackButton label={t('Cancel')} />
                {currentJobFamilyInfo?.approvalStatus !== 'PENDING' && (
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

      {currentTab === 'Jobfamily-info' &&
        (!loading && currentJobFamilyInfo  ? (
          <JobFamiliesNewEditForm
          ref={JobFamilyInfoForm}
          currentjobfamily={currentJobFamilyInfo}
          operation="edit"
          familySTATUSLoading={familySTATUSLoading}
          familySTATUS={familySTATUS}
        />
        ) : (
          <FormSkeleton fields={3} />

        ))}
    </Container>
  );
}
