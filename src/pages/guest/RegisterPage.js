import { Helmet } from 'react-helmet-async';
// sections
import Login from '../../sections/auth/Login';
import Register from '../../sections/auth/Register';
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
