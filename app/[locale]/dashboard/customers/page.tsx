"use client";

import { useState, useEffect } from "react";
import { useTranslations } from 'next-intl';
import { useSession } from "next-auth/react";
import { format } from "date-fns-jalali";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Search, Filter } from "lucide-react";
import { CustomerDialog } from "@/components/customers/customer-dialog";
import { useCustomerSocket } from "@/hooks/use-customer-socket";

type Customer = {
  id: string;
  name: string;
  phone: string;
  province: string;
  lastContact: string;
  daysSinceLastContact: number;
};

export default function CustomersPage() {
  const t = useTranslations();
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [search, setSearch] = useState("");
  const [province, setProvince] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { socket } = useCustomerSocket();

  useEffect(() => {
    fetchCustomers();

    socket?.on("customerUpdated", (customer) => {
      setCustomers((prev) =>
        prev.map((c) => (c.id === customer.id ? customer : c))
      );
    });

    return () => {
      socket?.off("customerUpdated");
    };
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch("/api/customers");
      const data = await response.json();
      setCustomers(data);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name?.toLowerCase().includes(search.toLowerCase()) ||
      customer.phone?.includes(search);
    const matchesProvince = !province || customer.province === province;
    return matchesSearch && matchesProvince;
  });

  const provinces = Array.from(
    new Set(customers.map((c) => c.province).filter(Boolean))
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t('common.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={province} onValueChange={setProvince}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t('common.filter')} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">
              {t('common.all')}
            </SelectItem>
            {provinces.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('customer.name')}</TableHead>
                <TableHead>{t('customer.phone')}</TableHead>
                <TableHead>{t('customer.province')}</TableHead>
                <TableHead>{t('customer.lastContact')}</TableHead>
                <TableHead>{t('customer.daysSinceLastContact')}</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>{customer.province}</TableCell>
                  <TableCell>
                    {customer.lastContact &&
                      format(new Date(customer.lastContact), 'yyyy/MM/dd')}
                  </TableCell>
                  <TableCell>{customer.daysSinceLastContact}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedCustomer(customer)}
                    >
                      {t('common.view')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      <CustomerDialog
        customer={selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </div>
  );
}