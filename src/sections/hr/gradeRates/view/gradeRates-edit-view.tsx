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
import { UseGetGradeRate, UseEditGradeRate } from 'src/actions/Hr/gradeRates';
import { useGetAllLookups, UseGetAllCurrencies } from 'src/actions/shared/shared';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import hasFormChanges from 'src/components/Form/form-data-changes';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import GradeRatesNewEditForm from '../gradeRates-new-edit-form';
import OganizationClassificationForm from '../classification-new-edit-form';

import type {
  GradeRatesGradeRatesNewEditFormHandle,
} from '../gradeRates-new-edit-form';
import type {
  OganizationClassificationFormHandle,
} from '../classification-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  id: string;
};
const useFetchGradeRatesData = (id: any) => {
  const [gradeRatesData, setGradeRatesData] = useState<any | null>(null);
  const [loading, setLoading] = useState<any>(true);
  const { gradeRate, gradeRateValidating, refetch: refetchGradeRates } = UseGetGradeRate(id);
  const refetch = useCallback(() => {
    refetchGradeRates();
  }, [refetchGradeRates]);
  useEffect(() => {
    if (!gradeRateValidating) {
      setGradeRatesData(gradeRate);
      setLoading(false);
    }
  }, [gradeRateValidating, gradeRate]);

  return { gradeRatesData, loading, refetch };
};
export default function GradeRatesEditView({ id }: Props) {
  const { currentLang } = useLocales();
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const router = useRouter();

  const { Currencies, CurrenciesLoading, CurrenciesValidating } = UseGetAllCurrencies();
  const TABS = [
    {
      value: 'gradeRates-info',
      label: t('Grade Rate Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
    {
      value: 'details-info',
      label: t('Details'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];

  const { gradeRatesData, loading, refetch } = useFetchGradeRatesData(id);
  const [currentGradeRatesInfo, setcurrentGradeRatesInfo] = useState<any>();
  const [currentDetailsInfo, setcurrentDetailsInfo] = useState<any>();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('gradeRates-info');
  const {
    lookups: GRADE_RATE_UNIT,
    lookupsLoading: GRADE_RATE_UNITLoading,
    lookupsValidating: GRADE_RATE_UNITValidation,
  } = useGetAllLookups('GRADE_RATE_UNIT', currentLang.value);
  const {
    lookups: GRADE_RATE_TYPE,
    lookupsLoading: GRADE_RATE_TYPELoading,
    lookupsValidating: GRADE_RATE_TYPEValidation,
  } = useGetAllLookups('GRADE_RATE_TYPE', currentLang.value);
  const gradeRatesInfoForm = useRef<GradeRatesGradeRatesNewEditFormHandle>(null);
  const detailsInfoForm = useRef<OganizationClassificationFormHandle>(null);
  const mapGradeRatesInfo = (currentGrades: any): any => {
    const gradeRatesTlsDTOS = ['AR', 'EN']
      .map((lang) => ({
        gradeName: currentGrades.gradeName?.[lang] || '',
        langCode: lang,
      }))
      .filter((org) => org.gradeName.trim());
    const gradeRatesDetailsDTOS =
      currentGrades?.gradeRatesDetailsDTOS?.map((details: any) => ({
        grade: 2,
        detailId: details.detailId || 0,
        startDate: details.startDate || '',
        endDate: details.endDate || '',
        gradeRateValue: details.gradeRateValue || '',
        currencyCode: details.currencyCode || '',
        gradeRateFrom: details.gradeRateFrom || '',
        gradeRateTo: details.gradeRateTo || '',
        midValue: details.midValue || '',
        uniqueId:currentGrades.uniqueId|| Math.floor(Math.random() * 1000000),
        active: details.active ? 1 : 0,
      })) || [];

    return {
      gradeRateId: Number(id),
      gradeRateUnit: currentGrades?.gradeRateUnit ?? '',
      gradeRateType: currentGrades?.gradeRateType ?? '',
      approvalStatus: currentGrades?.approvalStatus ?? 'DRAFT',
      active: currentGrades?.active || 0,
      gradeRatesTlsDTOS,
      gradeRatesDetailsDTOS,
      saveOrSubmit: currentGrades?.saveOrSubmit ?? 'SUBMITTED',
      currencyCode: gradeRatesDetailsDTOS[0]?.currencyCode || 'HTG',
      uniqueId: currentGrades?.uniqueId||Math.floor(Math.random() * 1000000),

    };
  };
  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;

    if (gradeRatesInfoForm.current) {
      formValid = await gradeRatesInfoForm.current.validate();
      currentData = gradeRatesInfoForm.current.formData();
      data = {
        ...currentData,
        gradeRatesDetailsDTOS: currentDetailsInfo.gradeRatesDetailsDTOS,
      };
    }
    if (detailsInfoForm.current) {
      formValid = await detailsInfoForm.current.validate();
      currentData = detailsInfoForm.current.formData();
      data = { ...currentData, ...currentGradeRatesInfo };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    data.active = data.active ? 1 : 0;

    data.id = id;
    const mappedGradeRatesInfo = mapGradeRatesInfo(data);

    if (!formValid) return;
    const hasChanges = hasFormChanges([gradeRatesData], [mapGradeRatesInfo(data)]);
    if (!hasChanges) {
      toast.info(t('No changes to save.'));
      router.push(paths.hr.gradeRates.management);
    } else {
      try {
        setSubmitLoading(true);
        const res = await UseEditGradeRate(mappedGradeRatesInfo);
        if (res.status === 200) {
          refetch();
          toast.success(t('Edited successfully!'));
          router.push(paths.hr.gradeRates.management);
          setcurrentGradeRatesInfo(null);
        }
      } catch (error:any) {
        setSubmitLoading(false);
        toast.error(error.message);

      }
    }
  };

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;
      if (currentTab === 'gradeRates-info' && gradeRatesInfoForm.current) {
        isValid = await gradeRatesInfoForm.current.validate();
        formData = gradeRatesInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;

        setcurrentGradeRatesInfo(formData);
      }
      if (currentTab === 'details-info' && detailsInfoForm.current) {
        isValid = await detailsInfoForm.current.validate();
        formData = detailsInfoForm.current.formData();

        setcurrentDetailsInfo(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, gradeRatesInfoForm, detailsInfoForm]
  );

  useEffect(() => {
    if (!loading) {
      setcurrentGradeRatesInfo(gradeRatesData);
      setcurrentDetailsInfo(gradeRatesData);
    }

    return () => {
      setcurrentGradeRatesInfo(null);
      setcurrentDetailsInfo(null);
    };
  }, [loading, gradeRatesData]);
  //--------------
  
  const gradeName =
    gradeRatesData?.gradeRatesTlsDTOS?.find((g: any) => g.langCode === currentLang.value.toUpperCase())?.gradeName || '';
  return (
    <Container >
      <CustomBreadcrumbs
        heading={`${t('Edit Grade Rate')} ${gradeName}`}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Grade Rate'),
            href: paths.hr.gradeRates.root,
          },
          { name: t('Edit Grade Rate') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <div>
            {loading || !currentGradeRatesInfo ? (
              <ButtonSkeleton buttons={2} />
            ) : (
              <>
                <BackButton label={t('Cancel')} />
                {currentGradeRatesInfo?.approvalStatus !== 'PENDING' && (
                  <LoadingButton
                    color="inherit"
                    onClick={handleSubmit}
                    variant="contained"
                    loading={submitLoading}
                    sx={{ mt: 5 }}
                    disabled={currentGradeRatesInfo?.approvalStatus === 'PENDING'}
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
        onChange={handleChangeTab}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        {TABS.map((tab) => (
          <Tab key={tab.value} label={tab.label} icon={tab.icon} value={tab.value} />
        ))}
      </Tabs>
      {currentTab === 'gradeRates-info' &&
        (!loading &&
        currentGradeRatesInfo  ? (
          <GradeRatesNewEditForm
            ref={gradeRatesInfoForm}
            currentGradeRates={currentGradeRatesInfo}
            GRADE_RATE_UNIT={GRADE_RATE_UNIT}
            GRADE_RATE_TYPE={GRADE_RATE_TYPE}
            GRADE_RATE_TYPELoading={GRADE_RATE_TYPELoading}
            GRADE_RATE_UNITLoading={GRADE_RATE_UNITLoading}
            operation="edit"
          />
        ) : (
          <FormSkeleton fields={5} />
        ))}

      {currentTab === 'details-info' &&
        (!loading && currentDetailsInfo  ? (
          <OganizationClassificationForm
            operation="edit"
            ref={detailsInfoForm}
            organizations={Currencies}
            organizationsValidating={CurrenciesValidating}
            currentOganizationClassification={currentDetailsInfo?.gradeRatesDetailsDTOS}
            current={currentDetailsInfo}
            currentGradeRates={currentGradeRatesInfo || undefined}
          />
        ) : (
          <FormSkeleton fields={2} />
        ))}
    </Container>
  );
}
