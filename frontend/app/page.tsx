import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900">
            🌍 Carbon Footprint Tracker
          </h1>
          <p className="text-xl text-gray-600">
            Empower yourself to understand your environmental impact and take small, 
            consistent actions that collectively drive massive change.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/signup">
              <Button size="lg" className="bg-green-600 hover:bg-green-700">
                Get Started
              </Button>
            </Link>
            <Link href="/auth/signin">
              <Button size="lg" variant="outline">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📊 Track Daily Activities
              </CardTitle>
              <CardDescription>
                Log your transport, food, energy, and shopping activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Get real-time emissions calculations and see your impact visualized
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                💡 Personalized Insights
              </CardTitle>
              <CardDescription>
                AI-powered tips tailored to your lifestyle
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Receive actionable suggestions to reduce your carbon footprint
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🏆 Challenges & Badges
              </CardTitle>
              <CardDescription>
                Gamified challenges to keep you motivated
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Earn achievements and track your progress with streaks
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold mb-8">Making an Impact Together</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-4xl font-bold text-green-600">10K+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">500K kg</div>
              <div className="text-gray-600">CO₂ Saved</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600">25K</div>
              <div className="text-gray-600">Challenges Completed</div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center bg-green-600 text-white rounded-2xl p-12">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Make a Difference?
          </h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of people taking action for a sustainable future
          </p>
          <Link href="/auth/signup">
            <Button size="lg" variant="secondary">
              Start Your Journey
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-gray-600">
          <p>Built with 💚 for a sustainable future</p>
        </div>
      </footer>
    </div>
  );
}

// Made with Bob
