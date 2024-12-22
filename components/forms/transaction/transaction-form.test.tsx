import { render, screen } from '@testing-library/react-native';

import { TransactionForm } from './transaction-form';

describe('TransactionForm', () => {
  it('renders correctly', () => {
    render(<TransactionForm onSubmit={jest.fn()} />);
    // Add your test assertions
  });
});
