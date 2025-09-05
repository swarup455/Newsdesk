import React, { useState } from 'react'
import LoginUser from './LoginUser'
import RegisterUser from './RegisterUser'
import { useEffect } from 'react'

function LoginPopup({ isOpen, onClose }) {
    const [mode, setMode] = useState("login")
    useEffect(() => {
        if (!isOpen) {
            setMode("login");
        }
    }, [isOpen]);
    return (
        <div>
            {mode === "login" ?
                <LoginUser
                    isOpen={isOpen}
                    onClose={onClose}
                    switchToRegister={() => setMode("register")}
                />
                :
                <RegisterUser
                    isOpen={isOpen}
                    onClose={onClose}
                    switchToLogin={() => setMode("login")}
                />
            }
        </div>
    )
}

export default LoginPopup