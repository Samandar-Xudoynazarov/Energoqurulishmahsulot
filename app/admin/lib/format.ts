export const fmtSum = (n?: number) => (n && n > 0 ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : '');
