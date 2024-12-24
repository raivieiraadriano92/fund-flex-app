import {
  HomeIcon,
  LayoutGridIcon,
  BarChart3Icon,
  TargetIcon,
  SettingsIcon,
  UserIcon,
  ChevronRightIcon,
  PlusIcon,
} from 'lucide-react-native';

import { AppleIcon } from './AppleIcon';
import { GoogleIcon } from './GoogleIcon';
import { iconWithClassName } from './iconWithClassName';

iconWithClassName(PlusIcon);
iconWithClassName(ChevronRightIcon);

// Tab icons
iconWithClassName(HomeIcon);
iconWithClassName(LayoutGridIcon);
iconWithClassName(BarChart3Icon);
iconWithClassName(TargetIcon);
iconWithClassName(SettingsIcon);

// Auth icons
iconWithClassName(AppleIcon);
iconWithClassName(GoogleIcon);
iconWithClassName(UserIcon);

export {
  PlusIcon,
  ChevronRightIcon,
  HomeIcon,
  LayoutGridIcon,
  BarChart3Icon,
  TargetIcon,
  SettingsIcon,
  AppleIcon,
  UserIcon,
  GoogleIcon,
};
