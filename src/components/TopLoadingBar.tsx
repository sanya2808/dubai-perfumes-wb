import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const TopLoadingBar = () => {
  const location = useLocation();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    // Start loading
    setVisible(true);
    setProgress(0);

    // Quick jump to ~30%
    const t1 = setTimeout(() => setProgress(30), 50);
    // Ease to ~70%
    const t2 = setTimeout(() => setProgress(70), 200);
    // Complete
    const t3 = setTimeout(() => setProgress(100), 400);
    // Fade out
    const t4 = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [location.pathname]);

  if (!visible && progress === 0) return null;

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[200] pointer-events-none"
      style={{ height: 3 }}
    >
      <div
        style={{
          height: '100%',
          width: `${progress}%`,
          backgroundColor: '#C6A96B',
          boxShadow: '0 0 10px rgba(198,169,107,0.6), 0 0 4px rgba(198,169,107,0.4)',
          transition: progress === 0
            ? 'none'
            : progress === 100
              ? 'width 0.3s ease-out, opacity 0.3s ease-out'
              : 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: progress === 100 ? 0 : 1,
          borderRadius: '0 2px 2px 0',
        }}
      />
    </div>
  );
};

export default TopLoadingBar;
