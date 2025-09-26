import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnimatedCard } from '@/components/ui/animated-card'

export default function SimpleTestPage() {
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold mb-8">Simple Test Page</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Regular Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is a regular card to verify components are working.</p>
            <Button className="mt-4">Regular Button</Button>
          </CardContent>
        </Card>
        
        <AnimatedCard>
          <CardHeader>
            <CardTitle>Animated Card</CardTitle>
          </CardHeader>
          <CardContent>
            <p>This is an animated card to verify components are working.</p>
            <Button className="mt-4">Animated Button</Button>
          </CardContent>
        </AnimatedCard>
      </div>
    </div>
  )
}