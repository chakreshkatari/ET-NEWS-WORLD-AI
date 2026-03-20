import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Briefings from './pages/Briefings';
import VideoStudio from './pages/VideoStudio';
import StoryArc from './pages/StoryArc';
import Vernacular from './pages/Vernacular';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="navigator" element={<Briefings />} />
          <Route path="studio" element={<VideoStudio />} />
          <Route path="story-arc" element={<StoryArc />} />
          <Route path="vernacular" element={<Vernacular />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

