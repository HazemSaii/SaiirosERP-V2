import type { ILocationsInfo } from 'src/types/locations';
import type {
  LocationNewEditFormHandle,
} from 'src/sections/hr/locations/locations-new-edit-form';

import { toast } from 'sonner';
import { useRef, useState, useCallback } from 'react';

import { Container } from '@mui/system';
import { LoadingButton } from '@mui/lab';
import { Tab, Tabs } from '@mui/material';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { useLocales, useTranslate } from 'src/locales';
import { useGetAllCountries } from 'src/actions/shared/shared';
import { UseAddLocation, UseValidateLocation } from 'src/actions/Hr/locations';

import {Iconify} from 'src/components/iconify';
import BackButton from 'src/components/buttons';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import {CustomBreadcrumbs} from 'src/components/custom-breadcrumbs';

import LocationNewEditForm from 'src/sections/hr/locations/locations-new-edit-form';

//------------------------------------------------------
export default function LocationsCreateView() {
  const { t } = useTranslate();
  const router = useRouter();
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  const { countries, countriesLoading } = useGetAllCountries(currentLanguage);

  const TABS = [
    {
      value: 'location-info',
      label: t('Location Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];
  const settings = useSettingsContext();
  const [currentLocationInfo, setcurrentLocationInfo] = useState<ILocationsInfo>();

  const [currentTab, setCurrentTab] = useState('location-info');
  const [submitLoading, setSubmitLoading] = useState(false);
  const locationInfoForm = useRef<LocationNewEditFormHandle>(null);
  const mapLocationInfo = (currentLocation: any): any => {
    const locationTlDTOS = ['AR', 'EN']
      .map((lang) => ({
        langCode: lang,
        locationName: currentLocation.locationName?.[lang] || '',
      }))
      .filter((loc) => loc.locationName.trim());

    return {
      locationTlDTOS,
      //  locationKey: currentLocation?.locationKey || Math.floor(Math.random() * 1000000),
      //  uniqueId: currentLocation?.uniqueId || Math.floor(Math.random() * 1000000),
      approvalStatus: currentLocation?.approvalStatus ?? 'DRAFT',
      countryCode: currentLocation?.countryCode ?? '',
      city: currentLocation?.city ?? '',
      addressLine1: currentLocation?.addressLine1 ?? '',
      addressLine2: currentLocation?.addressLine2 ?? '',
      poBox: currentLocation?.poBox ?? '',
      active: currentLocation?.active || 0,
      saveOrSubmit: currentLocation?.saveOrSubmit ?? 'SUBMITTED',
    };
  };

  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (locationInfoForm.current) {
      formValid = await locationInfoForm.current.validate();
      currentData = locationInfoForm.current.formData();
      data = { ...currentData };
    }

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });
    const mappedLocationInfo = mapLocationInfo(data);

    if (!formValid) return;
    try {
      setSubmitLoading(true);
      const apiValid = await UseValidateLocation(mappedLocationInfo, 1);
      const res = await UseAddLocation(mappedLocationInfo);
      if (res.status === 200 && apiValid.status === 200) {
        toast.success(t('Created successfully!'));
        router.push(paths.hr.locations.management);
      }
    } catch (error: any) {
        setSubmitLoading(false);
        toast.error(error?.response?.data?.message || error?.message || t('An error occurred'));
      }
  };

  const handleChangeTab = useCallback(
    async (event: React.SyntheticEvent, tabValue: string) => {
      let formData = null;
      let isValid = true;
      if (currentTab === 'location-info' && locationInfoForm.current) {
        isValid = await locationInfoForm.current.validate();
        formData = locationInfoForm.current.formData();
        formData.active = formData.active ? 1 : 0;

        setcurrentLocationInfo(formData);
      }
      if (isValid) {
        setCurrentTab(tabValue);
      }
    },
    [currentTab, locationInfoForm]
  );
  //--------------
  return (
    <Container maxWidth='lg'> 
        <CustomBreadcrumbs
        heading={t('Create New Location')}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Locations'),
            href: paths.hr.locations.root,
          },
          { name: t('New Location') },
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
      {currentTab === 'location-info' &&
        (countriesLoading || !countries ? (
          <FormSkeleton fields={10} />
        ) : (
          <LocationNewEditForm
            ref={locationInfoForm}
            currentLocation={currentLocationInfo || undefined}
            operation="create"
            countries={countries}
            countriesLoading={countriesLoading}
          />
        ))}
    </Container>
  );
}
