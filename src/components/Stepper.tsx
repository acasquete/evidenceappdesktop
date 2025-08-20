import { useLocation } from 'react-router-dom';

const steps = ['User', 'Repos', 'Developers', 'Mapping', 'Periods', 'Upload', 'Result'];

export default function Stepper() {
  const location = useLocation();
  return (
    <nav className="stepper">
      <ol>
        {steps.map(step => (
          <li
            key={step}
            className={location.pathname.includes(step.toLowerCase()) ? 'active' : ''}
          >
            {step}
          </li>
        ))}
      </ol>
    </nav>
  );
}
