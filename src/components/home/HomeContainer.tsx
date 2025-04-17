
import React, { ReactNode } from 'react';
import { useIsMobile } from "@/hooks/use-mobile";

interface HomeContainerProps {
  children: ReactNode;
}

const HomeContainer: React.FC<HomeContainerProps> = ({ children }) => {
  const isMobile = useIsMobile();
  
  return (
    <div className={`container mx-auto py-4 md:py-6 ${isMobile ? 'px-3' : 'max-w-4xl'}`}>
      {children}
    </div>
  );
};

export default HomeContainer;
