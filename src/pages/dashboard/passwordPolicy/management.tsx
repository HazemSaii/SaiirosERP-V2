import { Helmet } from 'react-helmet-async';
import { PasswordPolicyManagementView } from 'src/sections/passwordPolicy/view';


// ----------------------------------------------------------------------

export default function PasswordPolicyManagementPage() {
  return (
    <>
    <Helmet>
        <title>Password Policy Management</title>
      </Helmet>
    <PasswordPolicyManagementView/>
    </>
  );
}
