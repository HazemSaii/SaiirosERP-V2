import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { UseAddGrades } from 'src/actions/Hr/grades';
import { useLocales, useTranslate } from 'src/locales';
import { useGetAllLookups } from 'src/actions/shared/shared';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import GradesNewEditForm from '../Grades-new-edit-form';

import type { GradesNewEditFormHandle } from '../Grades-new-edit-form';

export default function GradesCreateView() {
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
      value: 'Grades-info',
      label: t('Grade Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];

  const settings = useSettingsContext();

  const [currentGradesInfo, setcurrentGradesInfo] = useState<any>();

  const [currentTab, setCurrentTab] = useState('Grades-info');

  const [submitLoading, setSubmitLoading] = useState(false);

  const GradesInfoForm = useRef<GradesNewEditFormHandle>(null);

  // hna ha7ot el api bta3 el grades
  const mapGradesInfo = (currentGrades: any): any => {
    const gradeTlDTOS = [];

    if (currentGrades?.gradeName?.AR?.trim()) {
      gradeTlDTOS.push({
        langCode: 'AR',
        gradeName: currentGrades.gradeName.AR,
      });
    }

    if (currentGrades?.gradeName?.EN?.trim()) {
      gradeTlDTOS.push({
        langCode: 'EN',
        gradeName: currentGrades.gradeName.EN,
      });
    }

    return {
      id: 0,
      approvalStatus: currentGrades?.approvalStatus ?? 'Draft',
      gradeName: currentGrades.gradeName.EN,
      active: currentGrades?.active || 0,
      gradeTlDTOS,
    };
  };

  // hna ha7ot el apiii
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
    const mappedGradesInfo = mapGradesInfo(data);

    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const res = await UseAddGrades(mappedGradesInfo);
      if (res.status === 200) {
        toast.success(t('Created successfully!'));
        router.push(paths.hr.grades.management);
      }
    } catch (error:any) {
      setSubmitLoading(false);
      toast.error(error.message);

    }
  };

  // hna ha7ot el apii

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;
      if (currentTab === 'Grades-info' && GradesInfoForm.current) {
        isValid = await GradesInfoForm.current.validate();
        formData = GradesInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;

        setcurrentGradesInfo(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, GradesInfoForm]
  );

  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Create New Grade')}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Grades'),
            href: paths.hr.grades.root,
          },
          { name: t('New Grade') },
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

      {/*  hn ah3ml call el api  */}
      {currentTab === 'Grades-info'&& (
          <GradesNewEditForm
            ref={GradesInfoForm}
            currentGrades={currentGradesInfo || undefined}
            operation="create"
            familySTATUSLoading={familySTATUSLoading}
            familySTATUS={familySTATUS}
          />
        )}
    </Container>
  );
}
