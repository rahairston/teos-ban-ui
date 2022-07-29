export const isUserAdmin = (roles: string[] | undefined) : boolean => {
    return !!roles && roles.filter((role: string) => {
        return role === "ADMIN"
    }).length > 0;
}