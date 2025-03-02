import type { IGradesInfo } from 'src/types/grades';

import { toast } from 'sonner';
import { useRef, useState, useEffect, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { UseGetGrade, UseEditGrades } from 'src/actions/Hr/grades';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import hasFormChanges from 'src/components/Form/form-data-changes';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import GradesNewEditForm from '../Grades-new-edit-form';

import type { GradesNewEditFormHandle } from '../Grades-new-edit-form';

type Props = {
  id: string;
};

// hna ha7ot el api bta3 el grades

const useFetchFamilyData = (id: any) => {
  const [familyData, setfamilyData] = useState<any | null>(null);
  const [loading, setLoading] = useState<any>(true);
  const { currentLang } = useLocales();
  console.log('id', id);
  // hna ha7ot el apiii
  const { Grades, GradesValidating, refetch: refetchgrades } = UseGetGrade(id);

  const refetch = useCallback(() => {
    refetchgrades();
  }, [refetchgrades]);

  useEffect(() => {
    if (!GradesValidating) {
      setfamilyData(Grades);
      setLoading(false);
    }
  }, [GradesValidating, Grades]);

  return { familyData, loading, refetch };
};

export default function GradesEditView({ id }: Props) {
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
      value: 'Grades-info',
      label: t('Grade Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];

  // hna ha7ot el api bta3 el grades
  const [currentGradesInfo, setcurrentGradesInfo] = useState<IGradesInfo | null>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('Grades-info');

  const GradesInfoForm = useRef<GradesNewEditFormHandle>(null);

  // hna el api bta3 el grades
  const mapGradesInfo = (currentGrades: any): any => {
    const gradeTlDTOS = [];

    if (currentGrades?.gradeName?.AR?.trim()) {
      gradeTlDTOS.push({
        gradeName: currentGrades.gradeName.AR,
        langCode: 'AR',
      });
    }

    if (currentGrades?.gradeName?.EN?.trim()) {
      gradeTlDTOS.push({
        gradeName: currentGrades.gradeName.EN,
        langCode: 'EN',
      });
    }

    return {
      gradeId: Number(id),
      approvalStatus: currentGrades?.approvalStatus ?? '',
      gradeName: currentGrades.gradeName.EN,

      active: currentGrades?.active || 0,
      uniqueId:currentGrades?.uniqueId|| Math.floor(Math.random() * 1000000),

      gradeTlDTOS,
    };
  };

  // hna el api bta3 el grades
  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (GradesInfoForm.current) {
      formValid = await GradesInfoForm.current.validate();
      currentData = GradesInfoForm.current.formData();
      data = { ...currentData };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });

    data.id = id;
    const mappedGradesInfo = mapGradesInfo(data);

    if (!formValid) return;
    const hasChanges = hasFormChanges([familyData], [mapGradesInfo(data)]);

    if (!hasChanges) {
      toast.info(t('No changes to save.'));
      router.push(paths.hr.grades.management);
    } else {
      try {
        setSubmitLoading(true);
        const res = await UseEditGrades(mappedGradesInfo);
        if (res.status === 200) {
          refetch();
          toast.success(t('Edited successfully!'));
          router.push(paths.hr.grades.management);
          setcurrentGradesInfo(null);
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

      setcurrentGradesInfo(familyData);
    }
    return () => {
      setcurrentGradesInfo(null);
    };
  }, [loading, familyData]);

  const gradeName =
    familyData?.gradeTlDTOS?.find((org: any) => org.langCode === currentLang.value.toUpperCase())?.gradeName || '';

  return (
    <Container >
      <CustomBreadcrumbs
        heading={`${t('Edit Grade')} ${gradeName}`}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Grades'),
            href: paths.hr.grades.root,
          },
          { name: t('Edit Grade') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <div>
            {loading || !currentGradesInfo ? (
              <ButtonSkeleton buttons={2} />
            ) : (
              <>
                <BackButton label={t('Cancel')} />
                {currentGradesInfo?.approvalStatus !== 'PENDING' && (
                  <LoadingButton
                    color="inherit"
                    onClick={handleSubmit}
                    variant="contained"
                    loading={submitLoading}
                    sx={{ mt: 5 }}
                    disabled={currentGradesInfo?.approvalStatus === 'PENDING'}
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

      {currentTab === 'Grades-info' &&
        (loading || !currentGradesInfo || familySTATUSLoading || !familySTATUS ? (
          <FormSkeleton fields={3} />
        ) : (
          <GradesNewEditForm
            ref={GradesInfoForm}
            currentGrades={currentGradesInfo}
            operation="edit"
            familySTATUSLoading={familySTATUSLoading}
            familySTATUS={familySTATUS}
          />
        ))}
    </Container>
  );
}
