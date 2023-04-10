import { Helmet } from 'react-helmet-async';
// sections
import Login from '../../features/auth/Login';
import Register from '../../features/auth/Register';
// import Login from '../../sections/auth/LoginAuth0';

// ----------------------------------------------------------------------

export default function RegisterPage() {
  return (
    <>
      <Helmet>
        <title> Login | Foodie</title>
      </Helmet>

      <Register />
    </>
  );
}
