import type { ILocationsInfo } from 'src/types/locations';
import type { LocationNewEditFormHandle } from 'src/sections/hr/locations/locations-new-edit-form';

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
import { useGetAllCountries } from 'src/actions/shared/shared';
import { useGetLocation, UseEditLocation, UseValidateLocation } from 'src/actions/Hr/locations';

import { Iconify } from 'src/components/iconify';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import hasFormChanges from 'src/components/Form/form-data-changes';
import ButtonSkeleton from 'src/components/buttons/button-skelton';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import LocationNewEditForm from 'src/sections/hr/locations/locations-new-edit-form';

// ----------------------------------------------------------------------
type Props = {
  locationId: string;
};

const useFetchLocationData = (locationId: any) => {
  const [locationData, setLocationData] = useState<ILocationsInfo>();
  const [loading, setLoading] = useState<any>(true);
  const { location, locationValidating, refetch: refetchLocation } = useGetLocation(locationId);
  const refetch = useCallback(() => {
    refetchLocation();
  }, [refetchLocation]);
  useEffect(() => {
    if (!locationValidating) {
      setLocationData(location);
      setLoading(false);
    }
  }, [locationValidating, location]);

  return { locationData, loading, refetch };
};
export default function LocationsEditView({ locationId }: Props) {
  const settings = useSettingsContext();
  const { t } = useTranslate();
  const { currentLang } = useLocales();
  const currentLanguage = currentLang.value;
  console.log('currentLanguage', currentLanguage);

  const router = useRouter();
  const { locationData, loading, refetch } = useFetchLocationData(locationId);
  const { countries, countriesLoading } = useGetAllCountries(currentLanguage);

  const TABS = [
    {
      value: 'location-info',
      label: t('Location Information'),
      icon: <Iconify icon="solar:user-id-linear" width={24} />,
    },
  ];

  const [currentLocationInfo, setcurrentLocationInfo] = useState<ILocationsInfo>();
  const [submitLoading, setSubmitLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState('location-info');

  const locationsInfoForm = useRef<LocationNewEditFormHandle>(null);

  const mapLocationInfo = (currentLocation: any): any => {
    const languages = ['AR', 'EN'];
    const locationTlDTOS = languages
      .map((lang) => ({
        location: null,
        langCode: lang,
        locationName: currentLocation.locationName?.[lang] || '',
      }))
      .filter((loc) => loc.locationName.trim());

    return {
      locationId: Number(locationId),
      locationTlDTOS,
      approvalStatus: currentLocation?.approvalStatus ?? 'DRAFT',
      countryCode: currentLocation?.countryCode ?? null,
      city: currentLocation?.city ?? null,
      addressLine1: currentLocation?.addressLine1 ?? null,
      addressLine2: currentLocation?.addressLine2 ?? null,
      poBox: currentLocation?.poBox ?? null,
      active: currentLocation?.active || 0,
      uniqueId: currentLocation?.uniqueId || Math.floor(Math.random() * 1000000),

      saveOrSubmit: currentLocation?.saveOrSubmit ?? 'SUBMITTED',
    };
  };

  const handleSubmit = async () => {
    let currentData = null;
    let formValid = false;
    let data: any = null;
    if (locationsInfoForm.current) {
      formValid = await locationsInfoForm.current.validate();
      currentData = locationsInfoForm.current.formData();
      data = { ...currentData };
    }
    console.log('data', data);

    Object.keys(data).forEach((key) => {
      if (typeof data[key] === 'boolean') {
        data[key] = data[key] ? 1 : 0;
      }
    });

    data.locationId = locationId;
    const mappedLocationInfo = mapLocationInfo(data);

    if (!formValid) return;
    const hasChanges = hasFormChanges([locationData], [mapLocationInfo(data)]);

    if (!hasChanges) {
      toast.success(t('No changes to save.'));
      router.push(paths.hr.locations.management);
    } else {
      try {
        setSubmitLoading(true);
        console.log('mappedLocationInfo', mappedLocationInfo);

        const apiValid = await UseValidateLocation(mappedLocationInfo, 2);
        const res = await UseEditLocation(mappedLocationInfo);
        if (res.status === 200 && apiValid) {
          refetch();
          toast.success(t('Edited successfully!'));
          router.push(paths.hr.locations.management);
          // setcurrentLocationInfo(null);
        }
      } catch (error: any) {
        setSubmitLoading(false);
        toast.error(error?.response?.data?.message || error?.message || t('An error occurred'));
      }
    }
  };
  useEffect(() => {
    if (!loading) {
      console.log(locationData);

      setcurrentLocationInfo(locationData);
    }
    return () => {
      // setcurrentLocationInfo(null);
    };
  }, [loading, locationData]);
  //--------------

  // let LocationName;
  // switch (currentLanguage) {
  //   case 'EN':
  //     LocationName = currentLocationInfo?.locationTlDTOS.find(loc => loc.langCode === 'EN')?.locationName || '';
  //     break;
  //   case 'ar':
  //     LocationName = currentLocationInfo?.locationTlDTOS.find(loc => loc.langCode === 'AR')?.locationName || '';
  //     break;
  //   default:
  //     LocationName = currentLocationInfo?.locationTlDTOS.find(loc => loc.langCode === 'EN')?.locationName || '';
  // }

  //--------------

  // Get the organization name based on the determined langCode
  const LocationName =
    locationData?.locationTlDTOS?.find((org) => org.langCode === currentLang.value.toUpperCase())
      ?.locationName || '';
  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading={t(' Edit Location  ') + (LocationName ?? '')}
        links={[
          {
            name: t('Human Resources'),
            href: paths.hr.root,
          },
          {
            name: t('Locations'),
            href: paths.hr.locations.root,
          },
          { name: t('Edit Location') },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
        action={
          <div>
            {loading || !currentLocationInfo || countriesLoading || !countries ? (
              <ButtonSkeleton buttons={2} />
            ) : (
              <>
                <BackButton label={t('Cancel')} />
                {currentLocationInfo?.approvalStatus !== 'PENDING' && (
                  <LoadingButton
                    color="inherit"
                    onClick={handleSubmit}
                    variant="contained"
                    loading={submitLoading}
                    sx={{ mt: 5 }}
                    disabled={currentLocationInfo?.approvalStatus === 'PENDING'}
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
      {currentTab === 'location-info' &&
        (!loading && currentLocationInfo ? (
          <LocationNewEditForm
            ref={locationsInfoForm}
            currentLocation={currentLocationInfo}
            operation="edit"
            countries={countries}
            countriesLoading={countriesLoading}
          />
        ) : (
          <FormSkeleton fields={10} />
        ))}
    </Container>
  );
}
