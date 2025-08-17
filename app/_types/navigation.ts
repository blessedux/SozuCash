export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export type NavigationState = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  currentVerticalPage: number;
  setCurrentVerticalPage: (page: number) => void;
  slideDirection: SlideDirection;
  setSlideDirection: (direction: SlideDirection) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  navigateHorizontal: (direction: 'left' | 'right') => void;
  navigateVertical: (direction: 'up' | 'down') => void;
};

export type NavigationProps = {
  children: React.ReactNode;
};

// Define navigation paths for each screen with proper hierarchy
export type ScreenNavigation = {
  id: number;
  name: string;
  description: string;
  component: string;
  level: 'top' | 'bottom'; // Top level or bottom level
  canGoUp: boolean;
  canGoDown: boolean;
  canGoLeft: boolean;
  canGoRight: boolean;
  upTarget?: number;
  downTarget?: number;
  leftTarget?: number;
  rightTarget?: number;
};

export const SCREEN_NAVIGATION: ScreenNavigation[] = [
  // TOP LEVEL SCREENS (Main navigation)
  {
    id: 0,
    name: 'Pay',
    description: 'Payment interface',
    component: 'pay',
    level: 'top',
    canGoUp: false,
    canGoDown: true,
    canGoLeft: true,
    canGoRight: true,
    downTarget: 1,  // Send (bottom level)
    leftTarget: 2,  // Deposit
    rightTarget: 3  // Wallet
  },
  {
    id: 1,
    name: 'Send',
    description: 'Send money to users',
    component: 'send',
    level: 'bottom',
    canGoUp: true,
    canGoDown: false,
    canGoLeft: false,
    canGoRight: false,
    upTarget: 0     // Pay (back to top level)
  },
  {
    id: 2,
    name: 'Deposit',
    description: 'Deposit funds',
    component: 'deposit',
    level: 'top',
    canGoUp: false,
    canGoDown: true,
    canGoLeft: true,
    canGoRight: true,
    downTarget: 4,  // Invest (bottom level)
    leftTarget: 3,  // Wallet
    rightTarget: 0  // Pay
  },
  {
    id: 3,
    name: 'Wallet',
    description: 'Main wallet interface',
    component: 'wallet',
    level: 'top',
    canGoUp: false,
    canGoDown: true,
    canGoLeft: true,
    canGoRight: true,
    downTarget: 5,  // Settings (bottom level)
    leftTarget: 0,  // Pay
    rightTarget: 2  // Deposit
  },
  {
    id: 4,
    name: 'Invest',
    description: 'Investment options',
    component: 'invest',
    level: 'bottom',
    canGoUp: true,
    canGoDown: false,
    canGoLeft: false,
    canGoRight: false,
    upTarget: 2     // Deposit (back to top level)
  },
  {
    id: 5,
    name: 'Settings',
    description: 'App settings',
    component: 'settings',
    level: 'bottom',
    canGoUp: true,
    canGoDown: false,
    canGoLeft: false,
    canGoRight: false,
    upTarget: 3     // Wallet (back to top level)
  }
];

// Legacy VERTICAL_SCREENS for backward compatibility
export const VERTICAL_SCREENS = SCREEN_NAVIGATION;
