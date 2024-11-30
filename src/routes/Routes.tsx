import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from '../pages/welcome/Welcome';
import HorizontalStepper from '../pages/horizontalstepper/HorizontalStepper';
import ConfirmData from '../pages/confirmdata/ConfirmData';
import Finish from '../pages/finish/Finish';
import Teste from '../test/Teste';

const AppRoutes: React.FC = () => {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/form" element={<HorizontalStepper />} />
        <Route path="/confirm" element={<ConfirmData />} />
        <Route path="/finish" element={<Finish />} />
        <Route path="/teste" element={<Teste />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;