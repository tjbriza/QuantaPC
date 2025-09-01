import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TextField, Button, Box, Typography, Alert } from '@mui/material';
import { adminLogin } from '../../../schema/AuthSchema';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { adminSignIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(adminLogin),
    mode: 'onChange',
  });

  const onSubmit = async (data) => {
    try {
      const result = await adminSignIn(data.email, data.password);

      if (result.success) {
        navigate('/admin/dashboard');
      } else {
        setError('root', {
          type: 'manual',
          message:
            result.error?.message ||
            'Login failed. Please check your credentials.',
        });
      }
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Login failed. Please check your credentials.',
      });
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Box
          component='img'
          src='/favicon.png'
          alt='QuantaPC Logo'
          sx={{ width: 48, height: 48, objectFit: 'contain' }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <Typography variant='h4' fontWeight={800} component='h1'>
            quantapc
          </Typography>
          <Typography variant='h4'>admin console</Typography>
        </Box>
      </Box>
      <Box
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          maxWidth: 400,
          mt: 1,
        }}
      >
        {errors.root && (
          <Alert severity='error' sx={{ mb: 2 }}>
            {errors.root.message}
          </Alert>
        )}

        <TextField
          {...register('email')}
          margin='normal'
          required
          fullWidth
          id='email'
          label='Email Address'
          autoComplete='email'
          autoFocus
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />

        <TextField
          {...register('password')}
          margin='normal'
          required
          fullWidth
          id='password'
          label='Password'
          type='password'
          autoComplete='current-password'
          error={!!errors.password}
          helperText={errors.password?.message}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: 4,
            },
          }}
        />

        <Button
          type='submit'
          fullWidth
          variant='contained'
          disabled={isSubmitting}
          sx={{ py: 1.5, borderRadius: 4 }}
        >
          {isSubmitting ? 'Signing In...' : 'Sign In'}
        </Button>
      </Box>
    </Box>
  );
}
