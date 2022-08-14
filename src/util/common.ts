import { CSSProperties } from "react";

export const isUserAdmin = (roles: string[] | undefined) : boolean => {
    return !!roles && roles.filter((role: string) => {
        return role === "ADMIN"
    }).length > 0;
}

export const loaderOverride: CSSProperties = {
  display: "block",
  margin: "30vh 0 50px 0",
  textAlign: "center"
};