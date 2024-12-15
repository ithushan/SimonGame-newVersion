import { createUserWithEmailAndPassword, onAuthStateChanged, sendEmailVerification, signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { signInRespnse, signUpRespnse, userData } from "../../types";
import { get, ref, set, update } from "firebase/database"

export const signUp = async (email: string, password: string): Promise<signUpRespnse> => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const token = await userCredential.user.getIdToken();
        const uid = userCredential.user.uid;
        console.log("token: " + token);
        console.log("uid: " + uid);

        // store user detail in database 
        const useRef = ref(db, `user/${userCredential.user.uid}`);
        await set(useRef, {
            email: userCredential.user.email,
            uid: userCredential.user.uid,
            createdAt: Date.now()
        });

        // Send email verification
        if (userCredential.user.email) {
            await sendEmailVerification(userCredential.user);
            console.log("Verification email sent to:", userCredential.user.email);
        }

        return {
            success: true,
            email: userCredential.user.email ?? undefined,
            uid: userCredential.user.uid,
            token
        };

    } catch (error: any) {
        console.log(error)
        return {
            success: false,
            error: error.message ?? "An unkown error occurred",
        };
    }
}

export const signIn = async (email: string, password: string): Promise<signInRespnse> => {
    try {
        const userCredentail = await signInWithEmailAndPassword(auth, email, password);
        const token = await userCredentail.user.getIdToken();
        const uid = userCredentail.user.uid;
        console.log("token: " + token);
        console.log("uid: " + uid);

        const useRef = ref(db, `user/${uid}`);
        const userSnap = await get(useRef);
        if (userSnap.exists()) {
            const userData = userSnap.val();
            return {
                success: true,
                email: userData.email,
                uid,
                token,
                createdAt: userData.createdAt
            }
        } else {
            return {
                success: false,
                error: "User not found in the database. Please contact support.",
            }
        }

    } catch (error: any) {
        console.log("Sign-in error:" + error);

        return {
            success: false,
            error: error.message ?? "An unknown error occurred",
        }
    }
}

export const authStateListener = (onChange: (user: {
    email: string | null;
    uid: string | null;
    token: string | null
} | null) => void) => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
            const token = await user.getIdToken();
            onChange({
                email: user.email ?? null,
                uid: user.uid ?? null,
                token: token ?? null,
            });
        } else {
            onChange(null);
        }
    });

    return unsubscribe;
};

export const isEmailVerified = () => {
    const user = auth.currentUser;
    return user && user.emailVerified;
}

export const storeScore = async (uid: string, score: number) => {
    try {
        const userRef = ref(db, `user/${uid}`)
        await update(userRef, {
            score: score
        })
        console.log("score stored successfully")
    } catch (error) {
        console.log("score stored faild:" + error)
    }
}

export const getScore = async (uid: string): Promise<number | null> => {
    try {
        const userRef = ref(db, `user/${uid}`);
        const usersnap = await get(userRef);

        if (usersnap.exists()) {
            const userData: userData = usersnap.val();
            return userData.score ?? null; 
        }

        return null; 
    } catch (error) {
        console.error("Error fetching user score:", error);
        return null; 
    }
};