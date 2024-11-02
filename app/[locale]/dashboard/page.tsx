"use client";

import { useTranslations } from 'next-intl';
import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function DashboardPage() {
  const { data: session } = useSession();
  const t = useTranslations();

  // Example data - replace with real data from your API
  const activityData = [
    { name: "شنبه", count: 12 },
    { name: "یکشنبه", count: 19 },
    { name: "دوشنبه", count: 15 },
    { name: "سه‌شنبه", count: 22 },
    { name: "چهارشنبه", count: 18 },
    { name: "پنج‌شنبه", count: 25 },
    { name: "جمعه", count: 13 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        {t('dashboard.welcome')}, {session?.user?.username}
      </h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.totalCustomers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">1,234</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.activeCustomers')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">789</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.todayActivities')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">45</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.weeklyActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="var(--chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}