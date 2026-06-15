"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ChallengesPage() {
  const [challenges, setChallenges] = useState<any[]>([]);
  const [activeChallenges, setActiveChallenges] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
    fetchActiveChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges`);
      const data = await response.json();
      if (data.success) {
        setChallenges(data.data.challenges);
      }
    } catch (err) {
      console.error("Failed to fetch challenges:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveChallenges = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/challenges/active`);
      const data = await response.json();
      if (data.success) {
        setActiveChallenges(data.data.challenges);
      }
    } catch (err) {
      console.error("Failed to fetch active challenges:", err);
    }
  };

  const handleEnroll = async (challengeId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/challenges/${challengeId}/enroll`,
        { method: 'POST' }
      );
      const data = await response.json();
      if (data.success) {
        fetchActiveChallenges();
      }
    } catch (err) {
      console.error("Failed to enroll in challenge:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-green-600">🌍 Carbon Tracker</h1>
            <nav className="flex gap-4">
              <Link href="/dashboard">
                <Button variant="ghost">Dashboard</Button>
              </Link>
              <Link href="/tracking">
                <Button variant="ghost">Track</Button>
              </Link>
              <Link href="/challenges">
                <Button variant="ghost">Challenges</Button>
              </Link>
              <Link href="/community">
                <Button variant="ghost">Community</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Challenges</h2>

        {/* Active Challenges */}
        {activeChallenges.length > 0 && (
          <div className="mb-8">
            <h3 className="text-2xl font-semibold mb-4">Your Active Challenges</h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {activeChallenges.map((userChallenge) => (
                <Card key={userChallenge.id} className="border-green-500">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-3xl">{userChallenge.challenge.badgeIcon}</span>
                        <span>{userChallenge.challenge.title}</span>
                      </CardTitle>
                    </div>
                    <CardDescription>{userChallenge.challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progress</span>
                          <span className="font-semibold">{userChallenge.progress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full transition-all"
                            style={{ width: `${userChallenge.progress}%` }}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-600">Saved</div>
                          <div className="font-semibold">{userChallenge.emissionsSaved} kg CO₂</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Days Left</div>
                          <div className="font-semibold">{userChallenge.daysRemaining}</div>
                        </div>
                      </div>
                      {userChallenge.currentStreak && (
                        <div className="text-sm">
                          <span className="text-gray-600">Current Streak: </span>
                          <span className="font-semibold">{userChallenge.currentStreak} days 🔥</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Available Challenges */}
        <div>
          <h3 className="text-2xl font-semibold mb-4">Available Challenges</h3>
          {loading ? (
            <div className="text-center py-8">Loading challenges...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <Card key={challenge.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-3xl">{challenge.badgeIcon}</span>
                        <span>{challenge.title}</span>
                      </CardTitle>
                    </div>
                    <CardDescription>{challenge.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <div className="text-gray-600">Duration</div>
                          <div className="font-semibold">{challenge.durationDays} days</div>
                        </div>
                        <div>
                          <div className="text-gray-600">Target</div>
                          <div className="font-semibold">{challenge.targetReductionKg} kg CO₂</div>
                        </div>
                      </div>
                      <div className="text-sm text-gray-600">
                        {challenge.enrollmentCount} people enrolled
                      </div>
                      <Button
                        onClick={() => handleEnroll(challenge.id)}
                        className="w-full bg-green-600 hover:bg-green-700"
                      >
                        Join Challenge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Made with Bob
