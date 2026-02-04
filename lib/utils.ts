import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export const formatCurrency = (amount: number, currency = 'Rp') => {
    if (typeof amount !== 'number') return `${currency}0`;

    return `${currency}${amount.toLocaleString('id-ID', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`;
};

export const formatDate = (date: Date | string | number | any, includeTime = true) => {
    if (!date) return '-';

    // Handle Firestore Timestamp
    let dateObj: Date;
    if (date?.toDate && typeof date.toDate === 'function') {
        dateObj = date.toDate();
    } else if (date?.seconds) {
        dateObj = new Date(date.seconds * 1000);
    } else {
        dateObj = new Date(date);
    }

    // Check if valid date
    if (isNaN(dateObj.getTime())) return '-';

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    if (includeTime) {
        options.hour = '2-digit',
            options.minute = '2-digit'
    }

    return dateObj.toLocaleDateString('id-ID', options);
};

export const generateUniqueId = (prefix: string, existingIds: string[] = []) => {
    const timestamp = Date.now();
    let newId = `${prefix}${String(timestamp).slice(-6).padStart(3, '0')}`;
    let counter = 1;

    while (existingIds.includes(newId)) {
        newId = `${prefix}${String(timestamp + counter).slice(-6).padStart(3, '0')}`;
        counter++;
    }

    return newId;
};

export const getInitials = (name: string) => {
    if (!name) return '?';

    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();

    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }

    return initials;
};

export const safeParseFloat = (value: any): number => {
    if (value === null || value === undefined || value === '') return 0;
    if (typeof value === 'number') return value;
    const parsed = parseFloat(value.toString().replace(/[^0-9.-]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
};

export const validatePrice = (price: string | number): boolean => {
    const val = typeof price === 'string' ? safeParseFloat(price) : price;
    return !isNaN(val) && val >= 0;
};
