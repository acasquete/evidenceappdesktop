import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Stepper from './components/Stepper';
import Onboarding from './pages/Onboarding';
import Repos from './pages/Repos';
import Developers from './pages/Developers';
import Mapping from './pages/Mapping';
import Periods from './pages/Periods';
import Upload from './pages/Upload';
import Result from './pages/Result';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Stepper />
        <Routes>
          <Route path="/" element={<Navigate to="/onboarding" />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/repos" element={<Repos />} />
          <Route path="/developers" element={<Developers />} />
          <Route path="/mapping" element={<Mapping />} />
          <Route path="/periods" element={<Periods />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
