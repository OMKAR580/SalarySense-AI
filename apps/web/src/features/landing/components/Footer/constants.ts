import { FooterSection } from './types';

export const FOOTER_SECTIONS: FooterSection[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Salary Prediction', href: '/predict' },
      { label: 'Batch Prediction', href: '/predict/batch' },
      { label: 'CSV Upload', href: '/predict/csv' },
      { label: 'Resume Parser', href: '/predict/resume' },
    ]
  },
  {
    title: 'Analytics',
    links: [
      { label: 'Insights Dashboard', href: '/predict/analytics' },
      { label: 'Prediction History', href: '/predict/history' },
      { label: 'User Profile', href: '/predict/profile' },
      { label: 'System Settings', href: '/predict/settings' },
    ]
  },
  {
    title: 'Contact',
    links: [
      { label: 'Email Support', href: 'mailto:omkardubey165@gmail.com' },
      { label: 'Call Mobile', href: 'tel:9305240893' },
      { label: 'WhatsApp Chat', href: 'https://wa.me/919721132989' },
    ]
  },
  {
    title: 'Connect',
    links: [
      { label: 'GitHub Profile', href: 'https://github.com/OMKAR580' },
      { label: 'Portal Login', href: '/login' },
      { label: 'Back to Home', href: '/' },
    ]
  }
];
