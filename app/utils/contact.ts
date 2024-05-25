export function formatPhoneNumber(phone: number | string): string {
    const textNumber = String(phone);

    return Array.from({ length: 3 }, (_, i) => {
        return textNumber.slice(
            3 * i,
            i === 2 ? textNumber.length : 3 * i + 3
        )
    }).join(' ');
}


export function trimUrl(url: string): string {
    return url.replace(/https?:\/\//, '').replace('www.', '');
}
