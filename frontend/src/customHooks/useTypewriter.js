import { useEffect, useState } from "react";

export const useTypewriter = (text, speed = 30, trigger = true) => {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        if (trigger && text) {
            setDisplayedText("");
            let i = 0;
            const interval = setInterval(() => {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
                if (i >= text.length) {
                    clearInterval(interval);
                }
            }, speed);

            return () => clearInterval(interval);
        }
    }, [text, speed, trigger]);

    return displayedText;
};