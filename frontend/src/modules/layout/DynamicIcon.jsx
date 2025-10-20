import React from 'react';
import {
  ChartIcon,
  BuildingIcon,
  SettingsIcon,
  TrendingUpIcon,
  BoxIcon,
  CarIcon,
  MoneyIcon,
  LightningIcon,
  UsersIcon,
  UserIcon,
  ClipboardIcon,
  WarningIcon,
  RefreshIcon,
  RocketIcon,
  NotificationIcon,
  CheckIcon,
  WrenchIcon
} from '../../assets/icons';

const iconMap = {
  ChartIcon,
  BuildingIcon,
  SettingsIcon,
  TrendingUpIcon,
  BoxIcon,
  CarIcon,
  MoneyIcon,
  LightningIcon,
  UsersIcon,
  UserIcon,
  ClipboardIcon,
  WarningIcon,
  RefreshIcon,
  RocketIcon,
  NotificationIcon,
  CheckIcon,
  WrenchIcon
};

const DynamicIcon = ({ iconName, size = 20, color, className = "", ...props }) => {
  const IconComponent = iconMap[iconName];
  
  if (!IconComponent) {
    return <span>?</span>;
  }
  
  return <IconComponent width={size} height={size} className={className} {...props} />;
};

export default DynamicIcon;