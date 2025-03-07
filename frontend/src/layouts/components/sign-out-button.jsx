import { useCallback } from 'react';
import { useDispatch } from 'react-redux';

import Button from '@mui/material/Button';

import { useRouter } from 'src/routes/hooks';

import { logout } from 'src/redux/slice/userSlice';

import { useAuthContext } from 'src/auth/hooks';


// ----------------------------------------------------------------------

export function SignOutButton({ onClose, ...other }) {
  const dispatch = useDispatch();
  const router = useRouter();

  const { checkUserSession } = useAuthContext();

  const handleLogout = useCallback(async () => {
    try {
      // await signOut();
      // await checkUserSession?.();
      dispatch(logout());
      // onClose?.();
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, router]);

  return (
    <Button fullWidth variant="soft" size="large" color="primary" onClick={handleLogout} {...other}>
      Logout
    </Button>
  );
}
