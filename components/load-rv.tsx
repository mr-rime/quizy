"use client"

import Script from 'next/script'

export function LoadRV() {
    return (
        <Script src="https://code.responsivevoice.org/responsivevoice.js?key=8s8V4Fl8" onLoad={() => console.log("RV loaded")} strategy="lazyOnload" />
    )
}
