import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function TestPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Test Page</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Test Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a test card to verify components are working.</p>
            <Button className="mt-4">Test Button</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}