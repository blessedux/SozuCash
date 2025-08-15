export type SlideDirection = 'left' | 'right' | 'up' | 'down';

export type Page = {
  id: string;
  title: string;
  subtitle: string;
  action: string;
};

export type NavigationState = {
  currentPage: number;
  setCurrentPage: (page: number) => void;
  slideDirection: SlideDirection;
  setSlideDirection: (direction: SlideDirection) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
};

export type NavigationProps = {
  children: React.ReactNode;
};
