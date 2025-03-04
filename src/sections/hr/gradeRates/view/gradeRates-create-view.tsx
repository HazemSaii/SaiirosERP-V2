import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { UseAddGradeRates } from 'src/actions/Hr/gradeRates';
import { useGetAllLookups, UseGetAllCurrencies } from 'src/actions/shared/shared';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import GradeRatesNewEditForm from '../gradeRates-new-edit-form';
import OganizationClassificationForm from '../classification-new-edit-form';

import type {
  GradeRatesGradeRatesNewEditFormHandle,
} from '../gradeRates-new-edit-form';
import type {
  OganizationClassificationFormHandle,
} from '../classification-new-edit-form';

//------------------------------------------------------
export default function GradeRatesCreateView() {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentLang } = useLocales();

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
  const { lookups: GRADE_RATE_UNIT, lookupsLoading: GRADE_RATE_UNITLoading } = useGetAllLookups(
    'GRADE_RATE_UNIT',
    currentLang.value
  );
  const { lookups: GRADE_RATE_TYPE, lookupsLoading: GRADE_RATE_TYPELoading } = useGetAllLookups(
    'GRADE_RATE_TYPE',
    currentLang.value
  );

  const settings = useSettingsContext();
  const [currentGradeRatesInfo, setcurrentGradeRatesInfo] = useState<any>();
  const [currentDetailsInfo, setcurrentDetailsInfo] = useState<any>([]);
  const [currentTab, setCurrentTab] = useState('gradeRates-info');
  const [submitLoading, setSubmitLoading] = useState(false);
  const gradeRatesInfoForm = useRef<GradeRatesGradeRatesNewEditFormHandle>(null);
  const detailsInfoForm = useRef<OganizationClassificationFormHandle>(null);
  const mapGradeRatesInfo = (currentGrades: any): any => {
    const gradeRatesTlsDTOS = ['AR', 'EN']
      .map((lang) => ({
        langCode: lang,
        gradeName: currentGrades.gradeName?.[lang] || '',
      }))
      .filter((org) => org.gradeName.trim());
    const gradeRatesDetailsDTOS =
      currentGrades?.gradeRatesDetailsDTOS?.map((details: any) => ({
        ...details,
        grade: 2,
        detailId: details.detailId || 0,
        active: details.active ? 1 : 0,
      })) || [];
    return {
      gradeRateId: currentGrades?.gradeRateId ?? 0,
      gradeRateUnit: currentGrades?.gradeRateUnit ?? '',
      gradeRateType: currentGrades?.gradeRateType ?? '',
      approvalStatus: currentGrades?.approvalStatus ?? 'DRAFT',
      active: currentGrades?.active || 0,
      gradeRatesTlsDTOS,
      gradeRatesDetailsDTOS,
      saveOrSubmit: currentGrades?.saveOrSubmit ?? 'SUBMITTED',
      // Get currencyCode from the first item in gradeRatesDetailsDTOS if it exists
      currencyCode: gradeRatesDetailsDTOS[0]?.currencyCode || 'HTG',
    };
  };
  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (gradeRatesInfoForm.current) {
      formValid = await gradeRatesInfoForm.current.validate();
      currentData = gradeRatesInfoForm.current.formData();
      data = { ...currentData, ...currentDetailsInfo };
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
    const mappedGradeRatesInfo = mapGradeRatesInfo(data);


    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const res = await UseAddGradeRates(mappedGradeRatesInfo);
      if (res.status === 200 || res.status === 201) {
        toast.success(t('Created successfully!'));
        router.push(paths.hr.gradeRates.management);
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
      if (currentTab === 'gradeRates-info' && gradeRatesInfoForm.current) {
        isValid = await gradeRatesInfoForm.current.validate();
        formData = gradeRatesInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;

        setcurrentGradeRatesInfo(formData);
      }
      if (currentTab === 'details-info' && detailsInfoForm.current) {
        isValid = await detailsInfoForm.current.validate();
        formData = detailsInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;

        setcurrentDetailsInfo(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, gradeRatesInfoForm, detailsInfoForm]
  );
  //--------------
  return (
    <Container >
      <CustomBreadcrumbs
        heading={t('Create New Grade Rate')}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Grade Rates'),
            href: paths.hr.gradeRates.root,
          },
          { name: t('New Grade Rate') },
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
      {currentTab === 'gradeRates-info' &&
        (
          <GradeRatesNewEditForm
            ref={gradeRatesInfoForm}
            currentGradeRates={currentGradeRatesInfo || undefined}
            operation="create"
            GRADE_RATE_UNIT={GRADE_RATE_UNIT}
            GRADE_RATE_TYPE={GRADE_RATE_TYPE}
            GRADE_RATE_TYPELoading={GRADE_RATE_TYPELoading}
            GRADE_RATE_UNITLoading={GRADE_RATE_UNITLoading}
          />
        )}

      {currentTab === 'details-info' &&
        (
          <OganizationClassificationForm
            operation="create"
            ref={detailsInfoForm}
            currentGradeRates={currentGradeRatesInfo || undefined}
            organizations={Currencies}
            organizationsValidating={CurrenciesValidating}
            currentOganizationClassification={
              currentDetailsInfo?.gradeRatesDetailsDTOS || undefined
            }
          />
        )}
    </Container>
  );
}
