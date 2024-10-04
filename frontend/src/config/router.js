import { Outlet, createBrowserRouter } from 'react-router-dom';
import Home from '../pages/Landing/Home';
import Login from '../pages/Landing/Login';
// import Register from "../pages/Landing/Register";
import Report from '../pages/Landing/Report';
import UploadData from '../pages/Dashboard/UploadData';
import FormatedData from '../pages/Dashboard/FormatedData';
import GenerateReport from '../pages/Dashboard/GenerateReport';
import TrackPeople from '../pages/Dashboard/TrackPeople';
import CashFlow from '../pages/Dashboard/CashFlow';
import MapData from '../pages/Dashboard/MapData';
import Dashboard from '../pages/Dashboard/Dashboard';
import Sidebar from '../components/Dashboard/Navbar/Navbar';
import Navbar from '../components/Landing/Navbar/Navbar';
import Complaints from '../pages/Dashboard/Complaints';
import Settings from '../pages/Dashboard/Settings';
// import Account from "../pages/Dashboard/Account";
import DetectFraud from '../pages/Dashboard/DetectFraud';
import ProtectedRoute from '../components/ProtectedRoute';
import NotFound from '../pages/NotFound/NotFound';
import Magic from '../pages/Landing/Magic';
import SuspectedAccounts from '../pages/Dashboard/SuspectedAccount';
import EdgeAnalysis from '../pages/Dashboard/EdgeAnalysis';
import ViewHistory from '../pages/Dashboard/ViewHistory';
// import UserReport from "../pages/Dashboard/UserReport";

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div style={{ backgroundColor: '#F2F7FF', minHeight: '100vh' }}>
        <Navbar />
        <Outlet />
      </div>
    ),
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: 'report-fraud',
        element: <Report />,
      },
      // Protect this custom route
      {
        path: 'set-password/:token',
        element: (
          <>
            <Magic />
          </>
        ),
      },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <Sidebar>
          <Outlet />
        </Sidebar>
      </ProtectedRoute>
    ),
    children: [
      {
        path: '',
        element: <Dashboard />,
      },
      {
        path: 'upload-data',
        element: <UploadData />,
      },
      {
        path: 'formatted-data',
        element: <FormatedData />,
      },
      {
        path: 'generate-report',
        element: <GenerateReport />,
      },
      // {
      //   path: "user-report",
      //   element: <UserReport />,
      // },
      {
        path: 'track-people',
        element: <TrackPeople />,
      },
      {
        path: 'cash-flow',
        element: <CashFlow />,
      },
      {
        path: 'detect-fraud',
        element: <DetectFraud />,
      },
      {
        path: 'edge-analysis',
        element: <EdgeAnalysis />,
      },
      {
        path: 'map-data',
        element: <MapData />,
      },
      {
        path: 'settings',
        element: <Settings />,
      },
      // {
      //   path: "account",
      //   element: <Account />,
      // },
      {
        path: 'complaints',
        element: <Complaints />,
      },
      {
        path: 'view-history',
        element: <ViewHistory />,
      },
      {
        path: 'supected-accounts',
        element: <SuspectedAccounts />,
      },
    ],
  },
  {
    path: 'login',
    element: <Login />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default router;
