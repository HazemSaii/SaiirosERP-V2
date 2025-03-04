import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { UseGetApprovedJobs } from 'src/actions/Hr/jobs';
import { UseAddPosition } from 'src/actions/Hr/positions';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { UseGetApprovedGrades } from 'src/actions/Hr/grades';
import { useGetApprovedLocations } from 'src/actions/Hr/locations';
import { UseGetApprovedOrganizations } from 'src/actions/Hr/organizations';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import PositionsNewEditForm from '../positions-new-edit-form';

import type { PositionsNewEditFormHandle } from '../positions-new-edit-form';

//------------------------------------------------------
export default function PositionCreateView() {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  const { lookups: Positions_STATUS_OPTIONS, lookupsLoading: PositionsSTATUSLoading } =
    useGetAllLookups('APPROVAL_STATUS', currentLanguage);

  const TABS = [
    {
      value: 'Position-info',
      label: t('Position Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];
  const settings = useSettingsContext();
  const [currentPositionInfo, setcurrentPositionInfo] = useState<any>();
  const { approvedlocations, approvedlocationsLoading } = useGetApprovedLocations(currentLang.value);
  const { approvedorganizations, approvedorganizationsLoading } = UseGetApprovedOrganizations(currentLang.value);

  const { approvedjobs, approvedjobsLoading } = UseGetApprovedJobs(currentLang.value);
  const { approvedGrades, approvedGradesLoading } = UseGetApprovedGrades(currentLang.value);
  const [currentTab, setCurrentTab] = useState('Position-info');
  const [submitLoading, setSubmitLoading] = useState(false);
  const positionInfoForm = useRef<PositionsNewEditFormHandle>(null);

  const mapPositionsInfo = (currentPosition: any): any => {
    const hrPositionsTlDTOS = [];
    if (currentPosition?.positionName?.AR?.trim()) {
      hrPositionsTlDTOS.push({
        langCode: 'AR',
        positionName: currentPosition.positionName.AR,
      });
    }
    if (currentPosition?.positionName?.EN?.trim()) {
      hrPositionsTlDTOS.push({
        langCode: 'EN',
        positionName: currentPosition.positionName.EN,
      });
    }
    const hrPositionGradeDTOS = currentPosition.aplicableGrades.map((grade: any) => ({
      positionId: 0,
      gradeId: grade,
      active: currentPosition?.active || 0,
    }));
    return {
      approvalStatus: currentPosition?.approvalStatus ?? 'Draft',
      positionName: currentPosition.positionName.EN,
      jobId: currentPosition.jobId,
      locationId: currentPosition.locationId,
      organizationsId: currentPosition.organizationsId,
      headcounts: currentPosition.headcounts,
      active: currentPosition?.active || 0,
      hrPositionsTlDTOS,
      hrPositionGradeDTOS,
    };
  };

  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (positionInfoForm.current) {
      formValid = await positionInfoForm.current.validate();
      currentData = positionInfoForm.current.formData();
      data = { ...currentData };
    }
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    const mappedPositionInfo = mapPositionsInfo(data);
    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const res = await UseAddPosition(mappedPositionInfo);
      if (res.status === 200) {
        toast.success(t('Created successfully!'));
        router.push(paths.hr.positions.management);
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
      if (currentTab === 'Position-info' && positionInfoForm.current) {
        isValid = await positionInfoForm.current.validate();
        formData = positionInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;
        setcurrentPositionInfo(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, positionInfoForm]
  );
  //--------------
  return (
    <Container >
      <CustomBreadcrumbs
        heading={t('Create New Position')}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Positions'),
            href: paths.hr.positions.root,
          },
          { name: t('New Position') },
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
      {currentTab === 'Position-info' &&
        (
          <PositionsNewEditForm
            ref={positionInfoForm}
            currentPosition={currentPositionInfo || undefined}
            operation="create"
            positionSTATUSLoading={Positions_STATUS_OPTIONS}
            positionSTATUS={Positions_STATUS_OPTIONS}
            jobs={approvedjobs}
            grades={approvedGrades}
            gradesLoading={approvedGradesLoading}
            locations={approvedlocations}
            jobsLoading={approvedjobsLoading}
            organizations={approvedorganizations}
            organizationsValidating={approvedorganizationsLoading}
            locationsLoading={approvedlocationsLoading}
          />
        )}
    </Container>
  );
}
