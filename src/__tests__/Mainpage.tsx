import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store'; // Ajusta esta ruta según tu estructura
import MainPage from '@/app/page';

jest.mock('next/navigation', () => ({ 
  useRouter:() => ({
    push: jest.fn(),
  })
}));

const renderWithProvider = (component: React.ReactNode) => {
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

it('Renders Home Page', () => {
  renderWithProvider(<MainPage />);
  expect(screen.getByText('Task Flow')).toBeInTheDocument();
});