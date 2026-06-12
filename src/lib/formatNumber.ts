export const formatNumber = (value: string | number | undefined | null): string => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (num === undefined || num === null || isNaN(num)) return '0';
    return num.toLocaleString('fr-FR');
};