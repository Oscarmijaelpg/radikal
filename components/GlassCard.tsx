import React from 'react';

interface Props {
  children: React.ReactNode;
  className?: string;
}

const GlassCard: React.FC<Props> = ({ children, className = '' }) => {
  return (
    <div className={`glass-card rounded-[32px] p-6 shadow-glass-lg border border-white/50 ${className}`}>
      {children}
    </div>
  );
};

export default GlassCard;
