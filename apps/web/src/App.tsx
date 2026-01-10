import { useEffect, useState } from 'react'
import { HealthCheckResponse } from '@repo/shared'
import { Button } from '@/components/ui/button'

function App() {
    const [data, setData] = useState<HealthCheckResponse | null>(null)

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3001'}/health`)
            .then(res => res.json())
            .then(setData)
            .catch(console.error)
    }, [])

    return (
        <div className="p-10 flex flex-col items-start gap-4">
            <h1 className="text-4xl font-bold">ExamDex Web App</h1>
            <p className="text-muted-foreground">Monorepo Setup Complete</p>

            <div className="flex gap-2 items-center border p-4 rounded bg-card text-card-foreground shadow-sm">
                <span className="font-semibold">Backend Status:</span>
                {data ? (
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded text-sm">
                        {data.status} at {new Date(data.timestamp).toLocaleTimeString()}
                    </span>
                ) : (
                    <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded text-sm animate-pulse">
                        Connecting...
                    </span>
                )}
            </div>

            <Button onClick={() => alert('Shadcn UI is working!')}>
                Test Shadcn Button
            </Button>
        </div>
    )
}
export default App
