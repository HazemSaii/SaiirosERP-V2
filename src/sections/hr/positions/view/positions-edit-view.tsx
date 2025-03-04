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
import { UseGetApprovedJobs } from 'src/actions/Hr/jobs';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { UseGetApprovedGrades } from 'src/actions/Hr/grades';
import { useGetApprovedLocations } from 'src/actions/Hr/locations';
import { UseGetPosition, UseEditPosition } from 'src/actions/Hr/positions';
import { UseGetApprovedOrganizations } from 'src/actions/Hr/organizations';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import hasFormChanges from 'src/components/Form/form-data-changes';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import PositionsNewEditForm from '../positions-new-edit-form';

import type { PositionsNewEditFormHandle } from '../positions-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  id: string;
};

const useFetchPositionsData = (id: any) => {
  const [positionsData, setpositionsData] = useState<any | null>(null);
  const [loading, setLoading] = useState<any>(true);
  const { currentLang } = useLocales();
  console.log('id', id);

  const { position, positionValidating, refetch: refetchpositions } = UseGetPosition(id);

  const refetch = useCallback(() => {
    refetchpositions();
  }, [refetchpositions]);

  useEffect(() => {
    if (!positionValidating) {
      setpositionsData(position);
      setLoading(false);
    }
  }, [positionValidating, position]);

  return { positionsData, loading, refetch };
};

export default function PositionsEditView({ id }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  const router = useRouter();
  const { positionsData, loading, refetch } = useFetchPositionsData(id);

  const { lookups: Positions_STATUS_OPTIONS, lookupsLoading: PositionsSTATUSLoading } =
    useGetAllLookups('APPROVAL_STATUS', currentLanguage);

  const TABS = [
    {
      value: 'positions-info',
      label: t('Position Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];

  const [currentPositionsInfo, setcurrentPositionsInfo] = useState<any | null>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('positions-info');
  const positionsInfoForm = useRef<PositionsNewEditFormHandle>(null);
  const { approvedlocations, approvedlocationsLoading } = useGetApprovedLocations(currentLang.value);
    const { approvedorganizations, approvedorganizationsLoading } = UseGetApprovedOrganizations(currentLang.value);
  
    const { approvedjobs, approvedjobsLoading } = UseGetApprovedJobs(currentLang.value);
    const { approvedGrades, approvedGradesLoading } = UseGetApprovedGrades(currentLang.value);
  const mapPositionsInfo = (currentPosition: any): any => {
    const hrPositionsTlDTOS = [];
    if (currentPosition?.positionName?.AR?.trim()) {
      hrPositionsTlDTOS.push({
        positionName: currentPosition.positionName.AR,
        langCode: 'AR',
      });
    }
    if (currentPosition?.positionName?.EN?.trim()) {
      hrPositionsTlDTOS.push({
        positionName: currentPosition.positionName.EN,
        langCode: 'EN',
      });
    }
    const hrPositionGradeDTOS = currentPosition.aplicableGrades.map((grade: any) => ({
      positionId: id,
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
      uniqueId: currentPosition?.uniqueId||Math.floor(Math.random() * 1000000),
      hrPositionsTlDTOS,
      positionId: id,
      hrPositionGradeDTOS,
    };
  };

  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (positionsInfoForm.current) {
      formValid = await positionsInfoForm.current.validate();
      currentData = positionsInfoForm.current.formData();
      data = { ...currentData };
    }
    console.log('data', data);
    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });

    data.id = id;
    const mappedfamiliesInfo = mapPositionsInfo(data);

    if (!formValid) return;
    const hasChanges = hasFormChanges([positionsData], [mapPositionsInfo(data)]);

    if (!hasChanges) {
      toast.info(t('No changes to save.'));
      router.push(paths.hr.positions.management);
    } else {
      try {
        setSubmitLoading(true);
        const res = await UseEditPosition(mappedfamiliesInfo);
        if (res.status === 200) {
          refetch();
          toast.success(t('Edited successfully!'));
          router.push(paths.hr.positions.management);
          setcurrentPositionsInfo(null);
        }
      } catch (error:any) {
        setSubmitLoading(false);
        toast.error(error.message);

      }
    }
  };

  useEffect(() => {
    if (!loading) {
      setcurrentPositionsInfo(positionsData);
    }
    return () => {
      setcurrentPositionsInfo(null);
    };
  }, [loading, positionsData]);
  //--------------

  
  const positionName =
    positionsData?.hrPositionsTlDTOS?.find((org: any) => org.langCode === currentLang.value.toUpperCase())?.positionName ||
    '';
  //--------------
  return (
    <Container >
      <CustomBreadcrumbs
        heading={t('Edit Position ') + (positionName ?? '')}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Positions'),
            href: paths.hr.positions.root,
          },
          { name: t('Edit Position ') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <div>
            {loading || !currentPositionsInfo ? (
              <ButtonSkeleton buttons={2} />
            ) : (
              <>
                <BackButton label={t('Cancel')} />
                {currentPositionsInfo?.approvalStatus !== 'PENDING' && (
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

      {currentTab === 'positions-info' &&
        (!loading &&
        currentPositionsInfo ? (
          <PositionsNewEditForm
            ref={positionsInfoForm}
            currentPosition={currentPositionsInfo || undefined}
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
        ) : (
          <FormSkeleton fields={9} />
        ))}
    </Container>
  );
}
