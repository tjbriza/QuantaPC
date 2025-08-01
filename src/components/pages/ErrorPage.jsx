import { useNavigate, useRouteError } from 'react-router-dom';
import Background from '../ui/Background';
export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  const navigate = useNavigate();

  function handleGoBack() {
    navigate(-1);
  }
  function handleGoHome() {
    navigate('/');
  }

  return (
    <Background>
      <div className='max-w-6xl mx-auto px-8 h-screen flex flex-col items-center justify-center'>
        <h1 className='text-2xl font-semibold text-red-600 mb-4 flex justify-center'>
          Oops! Something went wrong.
        </h1>
        <p className='text-center'>
          The page you're looking for doesn't exist.
        </p>
        <a
          onClick={handleGoHome}
          className='cursor-pointer underline font-medium'
        >
          Return Home
        </a>
      </div>
    </Background>
  );
}
