// src/hooks/useTatamiSize.ts
import { useState, useEffect } from 'react';

interface TatamiSize {
    width: string;
    height: string;
}

export function useTatamiSize(): TatamiSize {
    const [size, setSize] = useState<TatamiSize>({ width: '32em', height: '32em' });

    useEffect(() => {
        const updateSize = () => {
            const h = window.innerHeight;
            const w = window.innerWidth;

            // Hauteur > 1200px
            if (h > 1200) {
                setSize({ width: '32em', height: '32em' });
                return;
            }

            // Hauteur > 800px et <= 1200px
            if (h > 800) {
                if (w > 1200) {
                    setSize({ width: '32em', height: '32em' });
                } else if (w > 800) {
                    setSize({ width: '28em', height: '28em' });
                } else if (w > 600) {
                    setSize({ width: '24em', height: '32em' });
                } else if (w > 400) {
                    setSize({ width: '24em', height: '45em' });
                } else {
                    setSize({ width: '22em', height: '45em' });
                }
                return;
            }

            // Hauteur > 600px et <= 800px
            if (h > 600) {
                if (w > 1200) {
                    setSize({ width: '45em', height: '22em' });
                } else if (w > 800) {
                    setSize({ width: '39em', height: '22em' });
                } else if (w > 600) {
                    setSize({ width: '28em', height: '22em' });
                } else if (w > 400) {
                    setSize({ width: '22em', height: '32em' });
                } else {
                    setSize({ width: '18em', height: '32em' });
                }
                return;
            }

            // Hauteur > 400px et <= 600px
            if (h > 400) {
                if (w > 1200) {
                    setSize({ width: '39em', height: '13em' });
                } else if (w > 800) {
                    setSize({ width: '34em', height: '12em' });
                } else if (w > 600) {
                    setSize({ width: '28em', height: '14em' });
                } else if (w > 400) {
                    setSize({ width: '28em', height: '16em' });
                } else {
                    setSize({ width: '17em', height: '20em' });
                }
                return;
            }

            // Hauteur <= 400px
            if (w > 1200) {
                setSize({ width: '39em', height: '13em' });
            } else if (w > 800) {
                setSize({ width: '36em', height: '12em' });
            } else if (w > 600) {
                setSize({ width: '33em', height: '11em' });
            } else if (w > 400) {
                setSize({ width: '28em', height: '16em' });
            } else {
                setSize({ width: '17em', height: '16em' });
            }
        };

        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, []);

    return size;
}