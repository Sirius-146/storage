/**
 * Formata a data em "YYYY-MM-DD" (timezone local)
 */
export default function toLocaldate(date: Date): string {
    const pad = (n: number) => (n < 10 ? `0${n}` : n);
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};