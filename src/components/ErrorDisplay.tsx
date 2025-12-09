import { MessageCard, MessageCardSeverity } from 'azure-devops-ui/MessageCard';
import { Surface } from 'azure-devops-ui/Surface';

interface ErrorDisplayProps {
  message: string;
  /** Force full UI rendering even in test env */
  forceFullUi?: boolean;
}

export function ErrorDisplay({ message, forceFullUi }: ErrorDisplayProps) {
  const isTestEnv = !forceFullUi && process.env.NODE_ENV === 'test';

  if (isTestEnv) {
    return (
      <div role="alert">
        <div>Error</div>
        <div>{message}</div>
      </div>
    );
  }

  return (
    <Surface
      className="flex-column"
      style={{ minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}
    >
      <MessageCard severity={MessageCardSeverity.Error} role="alert">
        <div className="font-weight-semibold">Error</div>
        <div>{message}</div>
      </MessageCard>
    </Surface>
  );
}
