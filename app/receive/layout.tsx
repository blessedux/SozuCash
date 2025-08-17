import { BalanceProvider } from '../_context/BalanceContext';

export default function ReceiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <BalanceProvider>
      {children}
    </BalanceProvider>
  );
}
