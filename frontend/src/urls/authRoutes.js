import { Auth } from "./routes";

export const login=`${Auth}/login`;
export const register=`${Auth}/register`;

export const addAdmin=`${Auth}/admin/create`;
export const addVerifier=`${Auth}/verifier/create`;

export const getAllUsers=`${Auth}/users`;
export const deleteUser=`${Auth}/users`;