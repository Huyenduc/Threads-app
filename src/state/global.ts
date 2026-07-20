import { atom } from "jotai";

export type AuthUser = {
  id: string;
  name: string | null;
  email: string;
  photo: string | null;
};

export const authUserAtom = atom<AuthUser | null>(null);
export const isLoginAtom = atom((get) => Boolean(get(authUserAtom)));
