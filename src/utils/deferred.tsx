import React, { useEffect, useState } from 'react';

/**
 * Defer a component's render
 * @param Component - The component to defer
 * @returns The deferred component
 */
export function deferred<T extends React.ComponentType<any>>(Component: T) {
  return (props: React.ComponentProps<T>) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setTimeout(() => setIsMounted(true), 1);
    }, [props]);

    return isMounted ? <Component {...props} /> : null;
  };
}
