export type AuthFormProps = {
    initialMode?: "login" | "signup";
};

export interface signUpRespnse {
    success: boolean;
    email?: string;
    uid?: string;
    token?: string;
    error?: string;
}

export interface signInRespnse {
    success: boolean;
    email?: string;
    uid?: string;
    token?: string;
    error?: string;
    createdAt?: string;
}

export type userData  = {
    uid:string;
    score:number;
    email:string;
    createdAt:number;
}