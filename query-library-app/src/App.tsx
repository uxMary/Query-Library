import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import QueryDetail from './pages/QueryDetail';
import QueryBuilder from './pages/QueryBuilder';
import Folders from './pages/Folders';
import SchedulesInbox from './pages/SchedulesInbox';
import Housekeeping from './pages/Housekeeping';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="/folders" element={<Folders />} />
        <Route path="/folders/:slug" element={<Folders />} />
        <Route path="/query/:id" element={<QueryDetail />} />
        <Route path="/builder" element={<QueryBuilder />} />
        <Route path="/builder/:id" element={<QueryBuilder />} />
        <Route path="/schedules" element={<SchedulesInbox />} />
        <Route path="/housekeeping" element={<Housekeeping />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
