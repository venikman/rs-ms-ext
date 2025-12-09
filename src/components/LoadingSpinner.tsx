import { Spinner, SpinnerOrientation, SpinnerSize } from 'azure-devops-ui/Spinner';
import { Surface } from 'azure-devops-ui/Surface';

export function LoadingSpinner() {
  return (
    <Surface
      className="flex-column"
      style={{ minHeight: '60vh', alignItems: 'center', justifyContent: 'center' }}
    >
      <Spinner
        ariaLabel="Loading data"
        label="Loading data"
        size={SpinnerSize.large}
        orientation={SpinnerOrientation.column}
      />
    </Surface>
  );
}
