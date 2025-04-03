"use client"

import { auth } from "@/firebase/client"
import { removeToken, setToken } from "@/context/actions"
import {
    signInWithPopup,
    User,
    GoogleAuthProvider,
    ParsedToken,
} from "firebase/auth"
import { createContext, useState, useEffect, useContext } from "react"

// Context에서 관리할 데이터의 구조를 정의
type AuthContextType = {
    currentUser: User | null; //현재 로그인한 사용자의 정보를 저장하며, 로그인하지 않았다면 null
    logout: () => Promise<void>;
    loginWithGoogle: () => Promise<void>;
    customClaims: ParsedToken | null;
}

//인증 관련 데이터를 저장할 Context
// 초기값은 null로 설정되어 있으며, AuthContext.Provider를 사용해 데이터를 전달
const AuthContext = createContext<AuthContextType | null>(null)
// currentUser: null,
// logout: async () => { },
// loginWithGoogle: async () => { },
// customClaims: null,

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null)
    const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null)

    // Firebase 인증 상태 변화를 감지하고, currentUser를 업데이트
    useEffect(() => {
        const unsuscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user ?? null)
            if (user) {
                const tokenResult = await user.getIdTokenResult()
                const token = tokenResult.token;
                const refreshToken = user.refreshToken;
                const claims = tokenResult.claims;
                setCustomClaims(claims ?? null)
                if (token && refreshToken) {
                    await setToken({
                        token,
                        refreshToken
                    });
                }
            } else {
                await removeToken()
            }
        })
        return () => unsuscribe()
    }, [])
    const logout = async () => {
        await auth.signOut();
    }
    const loginWithGoogle = async () => {
        const provider = new GoogleAuthProvider()
        await signInWithPopup(auth, provider)
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                logout,
                loginWithGoogle,
                customClaims,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used with au AuthProvider')
    }
    return context;
}