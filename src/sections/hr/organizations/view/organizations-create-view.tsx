import type { IOrganizationsInfo } from 'src/types/organization';

import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { useGetAllLookups } from 'src/actions/shared/shared';
import { UseGetApprovedPersons } from 'src/actions/Hr/person';
import { useGetApprovedLocations } from 'src/actions/Hr/locations';
import { UseAddOrganization, UseGetApprovedOrganizations } from 'src/actions/Hr/organizations';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import OrganizationNewEditForm from '../organizations-new-edit-form';
import OganizationClassificationForm from '../classification-new-edit-form';

import type {
  OrganizationNewEditFormHandle,
} from '../organizations-new-edit-form';
import type {
  OganizationClassificationFormHandle,
} from '../classification-new-edit-form';

//------------------------------------------------------
export default function OrganizationsCreateView() {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentLang } = useLocales();
  const { approvedpersons, approvedpersonsLoading } = UseGetApprovedPersons();
  const { approvedlocations, approvedlocationsLoading } = useGetApprovedLocations(currentLang.value);
  const { approvedorganizations, approvedorganizationsLoading } = UseGetApprovedOrganizations(currentLang.value);

  const {
    lookups: organizationClassifications,
    lookupsLoading: organizationClassificationsLoading,
    lookupsValidating: organizationClassificationsValidation,
  } = useGetAllLookups('ORGANIZATION_CLASSIFICATIONS', currentLang.value);
  const TABS = [
    {
      value: 'organization-info',
      label: t('Organization Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
    {
      value: 'Classification-info',
      label: t('Classifications '),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];
  const settings = useSettingsContext();
  const [currentOrganizationInfo, setcurrenOrganizationInfo] = useState<IOrganizationsInfo>();
  const [currentClassificationInfo, setcurrenClassificationInfo] = useState<any>([]);

  const [currentTab, setCurrentTab] = useState('organization-info');
  const [submitLoading, setSubmitLoading] = useState(false);
  const organizationInfoForm = useRef<OrganizationNewEditFormHandle>(null);
  const classificationInfoForm = useRef<OganizationClassificationFormHandle>(null);
  const mapOrganizationInfo = (currentOrganization: any): any => {
    const organizationsTlDTOS = ['AR', 'EN']
      .map((lang) => ({
        langCode: lang,
        organizationName: currentOrganization.organizationName?.[lang] || '',
        organizationId: 0,
      }))
      .filter((org) => org.organizationName.trim());
    const orgnClassificationsDTOS =
      currentOrganization?.orgnClassificationsDTOS?.map((classification: any) => ({
        ...classification,
        active: classification.active ? 1 : 0,
        organizationId: 0,
      })) || [];
    return {
      organizationId: 0,
      locationId: currentOrganization?.locationId ?? '',
      managerPersonId: currentOrganization?.managerPersonId ?? '',
      parentOrgId: currentOrganization?.parentOrgId ?? '',
      approvalStatus: currentOrganization?.approvalStatus ?? 'DRAFT',
      active: currentOrganization?.active || 0,
      organizationsTlDTOS,
      orgnClassificationsDTOS,
      organizationType: 'O',
      saveOrSubmit: currentOrganization?.saveOrSubmit ?? 'SUBMITTED',
    };
  };
  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (organizationInfoForm.current) {
      formValid = await organizationInfoForm.current.validate();
      currentData = organizationInfoForm.current.formData();
      data = { ...currentData, ...currentClassificationInfo };
    }
    if (classificationInfoForm.current) {
      formValid = await classificationInfoForm.current.validate();
      currentData = classificationInfoForm.current.formData();
      data = { ...currentData, ...currentOrganizationInfo };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });

    data.active = data.active ? 1 : 0;
    console.log('data', data);
    const mappedOganizationInfo = mapOrganizationInfo(data);

    console.log('mappedOganizationInfo', mappedOganizationInfo);

    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const res = await UseAddOrganization(mappedOganizationInfo);
      if (res.status === 200) {
        toast.success(t('Created successfully!'));
        router.push(paths.hr.organizations.management);
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
      if (currentTab === 'organization-info' && organizationInfoForm.current) {
        isValid = await organizationInfoForm.current.validate();
        formData = organizationInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;
        console.log('organization', formData);

        setcurrenOrganizationInfo(formData);
      }
      if (currentTab === 'Classification-info' && classificationInfoForm.current) {
        isValid = await classificationInfoForm.current.validate();
        formData = classificationInfoForm.current.formData();
        // formData.active = formData.active ? 1 : 0;
        console.log('Classification', formData?.orgnClassificationsDTOS);

        setcurrenClassificationInfo(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, organizationInfoForm]
  );
  //--------------
  return (
    <Container>
      <CustomBreadcrumbs
        heading={t('Create New Organization')}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Organizations'),
            href: paths.hr.organizations.root,
          },
          { name: t('New Organization') },
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
      {currentTab === 'organization-info' &&
        (approvedlocationsLoading ||
          approvedpersonsLoading ||
        approvedorganizationsLoading ||
        !approvedlocations ||
        !approvedpersons ||
        !approvedorganizations ? (
          <FormSkeleton fields={6} />
        ) : (
          <OrganizationNewEditForm
            ref={organizationInfoForm}
            currentOrganization={currentOrganizationInfo || undefined}
            locations={approvedlocations}
            persons={approvedpersons}
            organizations={approvedorganizations}
            locationsLoading={approvedlocationsLoading}
            personsLoading={approvedpersonsLoading}
            organizationsLoading={approvedorganizationsLoading}
            operation="create"
          />
        ))}

      {currentTab === 'Classification-info' &&
        (organizationClassificationsLoading || !organizationClassifications ? (
          <FormSkeleton fields={2} />
        ) : (
          <OganizationClassificationForm
            operation="create"
            ref={classificationInfoForm}
            organizations={organizationClassifications}
            organizationsValidating={organizationClassificationsValidation}
            currentOganizationClassification={
              currentClassificationInfo?.orgnClassificationsDTOS || undefined
            }
          />
        ))}
    </Container>
  );
}
