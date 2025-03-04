import type { IPasswordPolicy } from 'src/types/password_policy';

import { useRef, useState, useEffect, useCallback } from 'react';

import Container from '@mui/material/Container';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';
import { DashboardContent } from 'src/layouts/dashboard';

import { toast } from 'src/components/snackbar';
import BackButton from 'src/components/buttons/back-button';
import FormSkeleton from 'src/components/Form/form-skelton';
import { useSettingsContext } from 'src/components/settings';
import hasFormChanges from 'src/components/Form/form-data-changes';
import { CustomBreadcrumbs } from 'src/components/custom-breadcrumbs';

import PasswordPolicyEditForm from '../passwordPolicyEditForm';
import {
  useGetPasswordPolicy,
  useUpdatePasswordPolicy,
} from '../../../actions/security/passwordPolicy';

import type { PasswordEditFormHandle } from '../passwordPolicyEditForm';

const useFetchPolicyData = (id: any) => {
  const [policyData, setPolicyData] = useState<IPasswordPolicy>();
  const [loading, setLoading] = useState<any>(true);
  const { policy, policyLoading, refetch: refetchPolicy } = useGetPasswordPolicy(id);

  const refetch = useCallback(() => {
    refetchPolicy();
  }, [refetchPolicy]);
  useEffect(() => {
    if (!policyLoading) {
      setPolicyData(policy);
      setLoading(false);
    }
  }, [policyLoading, policy]);

  return { policyData, loading, refetch };
};

export default function PasswordPolicyManagementView() {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const { policyData, loading, refetch } = useFetchPolicyData('1');
  const [submitLoading, setSubmitLoading] = useState(false);
  const PasswordPolicyRef = useRef<PasswordEditFormHandle>(null);
  // const isValid = true;
  const handleSubmit = async () => {
    const policy = PasswordPolicyRef.current?.formData();
    const isValid = await PasswordPolicyRef.current?.validate();
    policy.acceptRepeatCharacters = policy.acceptRepeatCharacters ? 1 : 0;
    policy.policyId = 1;
    if (!isValid) return;
    const hasChanges = hasFormChanges([policyData], [policy]);
    if (!hasChanges) {
      toast.info(t('No changes to save.'));
    } else {
      try {
        setSubmitLoading(true);
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const res = await useUpdatePasswordPolicy(policy);
        if (res.status === 200) {
          setSubmitLoading(false);
          toast.success('Updated successfully!');
          refetch();
        }
      } catch (e) {
        setSubmitLoading(false);
        toast.error((e as Error).message || 'An error occurred');
      }
    }
  };
  return (
    <DashboardContent>
      <Container>
        <CustomBreadcrumbs
          heading={t('Edit Password Policy')}
          links={[
            {
              name: t('Security'),
              href: paths.security.root,
            },
            {
              name: t('Password Policy'),
              href: paths.security.passwordPolicy.management,
            },
          ]}
          sx={{
            mb: { xs: 3, md: 5 },
          }}
          action={
            <div>
              <BackButton label={t('Cancel')} />
              <LoadingButton
                onClick={handleSubmit}
                loading={submitLoading}
                type="submit"
                variant="contained"
                sx={{ mt: 5 }}
              >
                {t('Submit')}
              </LoadingButton>
            </div>
          }
        />
        {loading ? (
          <FormSkeleton fields={8} />
        ) : (
          <PasswordPolicyEditForm ref={PasswordPolicyRef} policyData={policyData} />
        )}
      </Container>
    </DashboardContent>
  );
}
