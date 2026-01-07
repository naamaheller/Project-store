"use client";
import ErrorPage from './components/ui/ErrorPage'

export default function error() {
    return (
        <ErrorPage
            code={500}
            title="Server error"
            description="We’re having trouble processing your request right now."
        />
    )
}
