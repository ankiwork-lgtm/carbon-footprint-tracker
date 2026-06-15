"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = {
  transport: '#3b82f6',
  food: '#22c55e',
  energy: '#eab308',
  shopping: '#a855f7'
};

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated
    const user = localStorage.getItem("user");
    const token = localStorage.getItem("token");
    
    if (!user || !token) {
      // Redirect to signin if not authenticated
      window.location.href = "/auth/signin";
      return;
    }
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/summary`);
      const data = await response.json();
      if (data.success) {
        setDashboardData(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold mb-2">Loading...</div>
          <div className="text-gray-600">Fetching your carbon data</div>
        </div>
      </div>
    );
  }

  const breakdownData = dashboardData ? Object.entries(dashboardData.breakdown).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    color: COLORS[name as keyof typeof COLORS]
  })) : [];

  const trendData = [
    { date: 'Mon', emissions: 8.2, target: 8.0 },
    { date: 'Tue', emissions: 7.5, target: 8.0 },
    { date: 'Wed', emissions: 9.1, target: 8.0 },
    { date: 'Thu', emissions: 7.8, target: 8.0 },
    { date: 'Fri', emissions: 6.9, target: 8.0 },
    { date: 'Sat', emissions: 7.2, target: 8.0 },
    { date: 'Sun', emissions: 7.2, target: 8.0 },
  ];

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
        {/* Carbon Score Widget */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle className="text-sm">Carbon Score</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">
                {dashboardData?.carbonScore || 0}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {dashboardData?.scoreChange > 0 ? '↑' : '↓'} {Math.abs(dashboardData?.scoreChange || 0)} from last week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Today's Emissions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {dashboardData?.todayEmissions || 0} kg
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Target: {dashboardData?.todayTarget || 0} kg
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Weekly Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {dashboardData?.weeklyEmissions || 0} kg
              </div>
              <div className="text-sm text-gray-600 mt-1">
                CO₂ this week
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Goal Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {dashboardData?.goal?.currentProgress || 0}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                {dashboardData?.goal?.daysRemaining || 0} days remaining
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Trend</CardTitle>
              <CardDescription>Your emissions vs target</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="emissions" stroke="#22c55e" strokeWidth={2} />
                  <Line type="monotone" dataKey="target" stroke="#94a3b8" strokeDasharray="5 5" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Category Breakdown</CardTitle>
              <CardDescription>Emissions by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={breakdownData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {breakdownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Log Activity</CardTitle>
              <CardDescription>Track your daily activities</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/tracking">
                <Button className="w-full bg-green-600 hover:bg-green-700">
                  Add Activity
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Achievements</CardTitle>
              <CardDescription>Your latest badges</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                {dashboardData?.recentAchievements?.slice(0, 3).map((achievement: any) => (
                  <div key={achievement.badgeType} className="text-3xl" title={achievement.badgeName}>
                    {achievement.badgeIcon || '🏆'}
                  </div>
                ))}
                {(!dashboardData?.recentAchievements || dashboardData.recentAchievements.length === 0) && (
                  <div className="text-sm text-gray-500">No achievements yet</div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Active Challenges</CardTitle>
              <CardDescription>Your ongoing challenges</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/challenges">
                <Button variant="outline" className="w-full">
                  View Challenges
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
