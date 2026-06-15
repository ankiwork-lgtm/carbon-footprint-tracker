"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

const categories = [
  { id: 'transport', name: 'Transport', icon: '🚗', color: 'bg-blue-500' },
  { id: 'food', name: 'Food', icon: '🍽️', color: 'bg-green-500' },
  { id: 'energy', name: 'Energy', icon: '⚡', color: 'bg-yellow-500' },
  { id: 'shopping', name: 'Shopping', icon: '🛍️', color: 'bg-purple-500' },
];

const activityTypes = {
  transport: [
    { id: 'car_petrol', name: 'Car (Petrol)', unit: 'km' },
    { id: 'car_diesel', name: 'Car (Diesel)', unit: 'km' },
    { id: 'car_electric', name: 'Car (Electric)', unit: 'km' },
    { id: 'bus', name: 'Bus', unit: 'km' },
    { id: 'train', name: 'Train', unit: 'km' },
    { id: 'flight', name: 'Flight', unit: 'km' },
  ],
  food: [
    { id: 'beef', name: 'Beef', unit: 'kg' },
    { id: 'chicken', name: 'Chicken', unit: 'kg' },
    { id: 'fish', name: 'Fish', unit: 'kg' },
    { id: 'vegetables', name: 'Vegetables', unit: 'kg' },
    { id: 'dairy', name: 'Dairy', unit: 'kg' },
  ],
  energy: [
    { id: 'electricity', name: 'Electricity', unit: 'kWh' },
    { id: 'natural_gas', name: 'Natural Gas', unit: 'm³' },
    { id: 'heating_oil', name: 'Heating Oil', unit: 'L' },
  ],
  shopping: [
    { id: 'clothing', name: 'Clothing', unit: 'items' },
    { id: 'electronics', name: 'Electronics', unit: 'items' },
    { id: 'furniture', name: 'Furniture', unit: 'items' },
  ],
};

export default function TrackingPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activityType, setActivityType] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const selectedType = activityTypes[selectedCategory as keyof typeof activityTypes]?.find(
        t => t.id === activityType
      );

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          activityType,
          amount: parseFloat(amount),
          unit: selectedType?.unit || 'unit',
          date,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
        // Reset form
        setActivityType('');
        setAmount('');
        setNotes('');
      }
    } catch (err) {
      console.error('Failed to log activity:', err);
    } finally {
      setLoading(false);
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
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold mb-6">Log Activity</h2>

          {result && (
            <Card className="mb-6 border-green-500">
              <CardHeader>
                <CardTitle className="text-green-600">Activity Logged! 🎉</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Emissions:</span>
                    <span className="font-bold">{result.activity.emissionsKg} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Total:</span>
                    <span className="font-bold">{result.dailyTotal} kg CO₂</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className={`font-bold ${result.status === 'over_target' ? 'text-red-600' : 'text-green-600'}`}>
                      {result.status === 'over_target' ? 'Over Target' : 'On Track'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Select Category</CardTitle>
              <CardDescription>Choose the type of activity you want to log</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => {
                      setSelectedCategory(category.id);
                      setActivityType('');
                    }}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedCategory === category.id
                        ? 'border-green-600 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }`}
                  >
                    <div className="text-3xl mb-2">{category.icon}</div>
                    <div className="font-semibold">{category.name}</div>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="activityType">Activity Type</Label>
                    <select
                      id="activityType"
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                      className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                      required
                    >
                      <option value="">Select activity type</option>
                      {activityTypes[selectedCategory as keyof typeof activityTypes]?.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {activityType && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="amount">
                          Amount ({activityTypes[selectedCategory as keyof typeof activityTypes]?.find(t => t.id === activityType)?.unit})
                        </Label>
                        <Input
                          id="amount"
                          type="number"
                          step="0.01"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="Enter amount"
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                          id="date"
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes (optional)</Label>
                        <Input
                          id="notes"
                          type="text"
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                          placeholder="Add any notes..."
                        />
                      </div>

                      <Button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700"
                        disabled={loading}
                      >
                        {loading ? 'Logging...' : 'Log Activity'}
                      </Button>
                    </>
                  )}
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
