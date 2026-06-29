import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { id } from 'date-fns/locale';

const timeZone = 'Asia/Jakarta';

export const formatDate = (date: Date) =>
    format(toZonedTime(date, timeZone), 'dd MMMM yyyy', { locale: id });

export const formatTime = (date: Date) =>
    format(toZonedTime(date, timeZone), 'HH:mm', { locale: id });

export const formatDateTime = (date: Date) =>
    format(toZonedTime(date, timeZone), 'dd MMMM yyyy HH:mm', { locale: id });
