import {
  FaCloudUploadAlt,
  FaFileAlt,
  FaSearch,
  FaRupeeSign,
  FaMap,
  FaCommentAlt,
} from 'react-icons/fa';
import { TbReportAnalytics } from 'react-icons/tb';
import { FaGear, FaIdBadge } from 'react-icons/fa6';
import { PiListMagnifyingGlassFill } from 'react-icons/pi';
import { BiLogoGraphql } from 'react-icons/bi';
import { FaUserSecret } from 'react-icons/fa6';
import roles from '../utils/userRoles';
import EdgeAnalysis from '../pages/Dashboard/EdgeAnalysis';

export const menuList = [
  {
    text: 'Upload Data',
    icon: <FaCloudUploadAlt />,
    onClickNavigateTo: 'upload-data',
    allowedRoles: [...roles.ALL],
    route: '/dashboard/upload-data',
  },
  {
    text: 'Formatted Data',
    icon: <FaFileAlt />,
    allowedRoles: [...roles.ALL],
    onClickNavigateTo: 'formatted-data',
    route: '/dashboard/formatted-data',
  },
  {
    text: 'Analysis Report',
    icon: <TbReportAnalytics />,
    allowedRoles: [...roles.ALL],
    onClickNavigateTo: 'generate-report',
    route: '/dashboard/generate-report',
  },
  // {
  //   text: "User Report",
  //   icon: <TbReportAnalytics />,
  //   allowedRoles: [...roles.ALL],
  //   onClickNavigateTo: "user-report",
  //   route: "/dashboard/user-report",
  // },
  {
    text: 'Track People',
    icon: <FaSearch />,
    allowedRoles: [...roles.ALL],
    onClickNavigateTo: 'track-people',
    route: '/dashboard/track-people',
  },
  // {
  //   text: 'View Cash Flow',
  //   icon: <FaRupeeSign />,
  //   allowedRoles: [...roles.ALL],
  //   onClickNavigateTo: 'cash-flow',
  //   route: '/dashboard/cash-flow',
  // },
  // {
  //   text: 'Detect Fraud',
  //   allowedRoles: [...roles.ALL],
  //   icon: <PiListMagnifyingGlassFill />,
  //   onClickNavigateTo: 'detect-fraud',
  //   route: '/dashboard/detect-fraud',
  // },
  {
    text: 'Cash Analysis',
    icon: <BiLogoGraphql />,
    allowedRoles: [...roles.ALL],
    onClickNavigateTo: 'edge-analysis',
    route: '/dashboard/edge-analysis',
  },
  // {
  //   text: 'View Map Data',
  //   icon: <FaMap />,
  //   allowedRoles: [...roles.ALL],
  //   onClickNavigateTo: 'map-data',
  //   route: '/dashboard/map-data',
  // },
  // {
  //   text: 'Suspicious',
  //   icon: <FaUserSecret />,
  //   allowedRoles: [...roles.ALL],
  //   onClickNavigateTo: 'supected-accounts',
  //   route: '/dashboard/supected-accounts',
  // },
  {
    text: 'Settings',
    icon: <FaGear />,
    allowedRoles: [...roles.ALL],
    onClickNavigateTo: 'settings',
    route: '/dashboard/settings',
  },
  // {
  //   text: 'Complaints',
  //   icon: <FaCommentAlt />,
  //   allowedRoles: [...roles.ALL],
  //   onClickNavigateTo: 'complaints',
  //   route: '/dashboard/complaints',
  // },
  // {
  //   text: 'Account',
  //   icon: <FaIdBadge />,
  //   allowedRoles: [...roles.ALL],
  //   onClickNavigateTo: 'account',
  //   route: '/dashboard/account',
  // },
  // {
  //   text: 'Dashboard',
  //   allowedRoles: [...roles.ALL],
  //   route: '/dashboard',
  // },
  // {
  //   text: 'View History',
  //   allowedRoles: [...roles.ALL],
  //   route: '/dashboard/view-history',
  // },
];
