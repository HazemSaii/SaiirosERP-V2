import type { IOrganizationsInfo } from 'src/types/organization';

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
import { UseGetApprovedPersons } from 'src/actions/Hr/person';
import { useGetApprovedLocations } from 'src/actions/Hr/locations';
import {
  UseGetOrganization,
  UseEditOrganization,
  UseGetApprovedOrganizations,
} from 'src/actions/Hr/organizations';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import hasFormChanges from 'src/components/Form/form-data-changes';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import OrganizationNewEditForm from '../organizations-new-edit-form';
import OganizationClassificationForm from '../classification-new-edit-form';

import type {
  OrganizationNewEditFormHandle,
} from '../organizations-new-edit-form';
import type {
  OganizationClassificationFormHandle,
} from '../classification-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  id: string;
};
const useFetchOrganizationData = (id: any) => {
  const [organizationData, setOrganizationData] = useState<IOrganizationsInfo | null>(null);
  const [loading, setLoading] = useState<any>(true);
  const {
    organization,
    organizationValidating,
    refetch: refetchOrgranization,
  } = UseGetOrganization(id);
  const refetch = useCallback(() => {
    refetchOrgranization();
  }, [refetchOrgranization]);
  useEffect(() => {
    if (!organizationValidating) {
      setOrganizationData(organization);
      setLoading(false);
    }
  }, [organizationValidating, organization]);

  return { organizationData, loading, refetch };
};
export default function OrganizationsEditView({ id }: Props) {
  const { currentLang } = useLocales();
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const router = useRouter();
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

  const { organizationData, loading, refetch } = useFetchOrganizationData(id);
  const { approvedpersons, approvedpersonsLoading } = UseGetApprovedPersons();
 const { approvedlocations, approvedlocationsLoading } = useGetApprovedLocations(currentLang.value);
   const { approvedorganizations, approvedorganizationsLoading } = UseGetApprovedOrganizations(currentLang.value);
  const [currentOrganizationInfo, setcurrenOrganizationInfo] = useState<any>();
  const [currentClassificationInfo, setcurrenClassificationInfo] = useState<any>();

  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('organization-info');
  const {
    lookups: organizationClassifications,
    lookupsLoading: organizationClassificationsLoading,
    lookupsValidating: organizationClassificationsValidation,
  } = useGetAllLookups('ORGANIZATION_CLASSIFICATIONS', currentLang.value);
  const organizationInfoForm = useRef<OrganizationNewEditFormHandle>(null);
  const classificationInfoForm = useRef<OganizationClassificationFormHandle>(null);
  const mapOrganizationInfo = (currentOrganization: any): any => {
    const organizationsTlDTOS = ['AR', 'EN']
      .map((lang) => ({
        langCode: lang,
        organizationName: currentOrganization.organizationName?.[lang] || '',
        organizationId: currentOrganization?.organizationId ?? 0,
      }))
      .filter((org) => org.organizationName.trim());
    const orgnClassificationsDTOS =
      currentOrganization?.orgnClassificationsDTOS?.map((classification: any) => ({
        active: classification.active ? 1 : 0,
        organizationId: currentOrganization?.organizationId ?? 0,
        classificationCode: classification.classificationCode,
      })) || [];

    return {
      organizationId: Number(id),
      locationId: currentOrganization?.locationId ?? '',
      managerPersonId: currentOrganization?.managerPersonId ?? '',
      parentOrgId: currentOrganization?.parentOrgId ?? '',
      approvalStatus: currentOrganization?.approvalStatus ?? 'DRAFT',
      active: currentOrganization?.active || 0,
      organizationsTlDTOS,
      orgnClassificationsDTOS,
      organizationType: 'organizationType',
      uniqueId:currentOrganization?.uniqueId|| Math.floor(Math.random() * 1000000),
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
      data = {
        ...currentData,
        orgnClassificationsDTOS: currentClassificationInfo.orgnClassificationsDTOS,
      };
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
    console.log('data', data);
    data.active = data.active ? 1 : 0;

    data.id = id;
    const mappedOganizationInfo = mapOrganizationInfo(data);
    console.log('mappedOganizationInfo', mappedOganizationInfo);

    if (!formValid) return;
    const hasChanges = hasFormChanges([organizationData], [mapOrganizationInfo(data)]);
    if (!hasChanges) {
      toast.info(t('No changes to save.'));
      router.push(paths.hr.organizations.management);
    } else {
      try {
        setSubmitLoading(true);
        const res = await UseEditOrganization(mappedOganizationInfo);
        if (res.status === 200) {
          refetch();
          toast.success(t('Edited successfully!'));
          router.push(paths.hr.organizations.management);
          setcurrenOrganizationInfo(null);
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
       if (loading) return;
      if (currentTab === 'organization-info' && organizationInfoForm.current) {
        isValid = await organizationInfoForm.current.validate();
        formData = organizationInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;
        console.log('1', formData);

        setcurrenOrganizationInfo(formData);
      }
      if (currentTab === 'Classification-info' && classificationInfoForm.current) {
        isValid = await classificationInfoForm.current.validate();
        formData = classificationInfoForm.current.formData();
        // formData.active = formData.active ? 1 : 0;
        console.log('2', formData);

        setcurrenClassificationInfo(formData);
        console.log('formData?.orgnClassificationsDTOS', formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, organizationInfoForm, classificationInfoForm,loading]
  );

  useEffect(() => {
    if (!loading) {
      console.log('organizationData', organizationData);
      setcurrenOrganizationInfo(organizationData);
      setcurrenClassificationInfo(organizationData);
    }

    return () => {
      setcurrenOrganizationInfo(null);
      setcurrenClassificationInfo(null);
    };
  }, [loading, organizationData]);
  //--------------
 
  const organizationName =
    organizationData?.organizationsTlDTOS?.find((org) => org.langCode === currentLang.value.toUpperCase())
      ?.organizationName || '';
  return (
    <Container >
      <CustomBreadcrumbs
        heading={`${t('Edit Organization')} ${organizationName}`}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Organizations'),
            href: paths.hr.organizations.root,
          },
          { name: t('Edit Organization') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <div>
            {loading || !currentOrganizationInfo ? (
              <ButtonSkeleton buttons={2} />
            ) : (
              <>
                <BackButton label={t('Cancel')} />
                {currentOrganizationInfo?.approvalStatus !== 'PENDING' && (
                  <LoadingButton
                    color="inherit"
                    onClick={handleSubmit}
                    variant="contained"
                    loading={submitLoading}
                    sx={{ mt: 5 }}
                    disabled={currentOrganizationInfo?.approvalStatus === 'PENDING'}
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
      {currentTab === 'organization-info' &&
        (loading ||
        !currentOrganizationInfo ||
        approvedlocationsLoading ||
        approvedpersonsLoading ||
        approvedorganizationsLoading ||
        !approvedlocations ||
        !approvedpersons ||
        !approvedorganizations ? (
          <FormSkeleton fields={6} />
        ) : (
          <OrganizationNewEditForm
            ref={organizationInfoForm}
            currentOrganization={currentOrganizationInfo}
            locations={approvedlocations}
            persons={approvedpersons}
            organizations={approvedorganizations}
            locationsLoading={approvedlocationsLoading}
            personsLoading={approvedpersonsLoading}
            organizationsLoading={approvedorganizationsLoading}
            operation="edit"
          />
        ))}

      {currentTab === 'Classification-info' &&
        (loading ||
        !currentClassificationInfo ||
        organizationClassificationsLoading ||
        !organizationClassifications ? (
          <FormSkeleton fields={2} />
        ) : (
          <OganizationClassificationForm
            operation="edit"
            ref={classificationInfoForm}
            organizations={organizationClassifications}
            organizationsValidating={organizationClassificationsValidation}
            currentOganizationClassification={currentClassificationInfo?.orgnClassificationsDTOS}
            current={currentOrganizationInfo}
          />
        ))}
    </Container>
  );
}
