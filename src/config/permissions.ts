export const ALLOWED_ADMIN_EMAILS = [
    'jonathan.silva@aec.com.br',
    'kelciane.lima@aec.com.br',
    'a.izaura.bezerra@aec.com.br',
    'mickael.bandeira@aec.com.br',
];

export const isUserAdmin = (email: string | undefined | null): boolean => {
    if (!email) return false;
    return ALLOWED_ADMIN_EMAILS.includes(email);
};
