"use client";

import { useState } from "react";
import { useTranslations } from 'next-intl';
import { format } from "date-fns-jalali";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useCustomerSocket } from "@/hooks/use-customer-socket";

type CustomerDialogProps = {
  customer: any;
  onClose: () => void;
};

export function CustomerDialog({ customer, onClose }: CustomerDialogProps) {
  const t = useTranslations();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(customer);
  const { socket } = useCustomerSocket();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/customers/${customer.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error("Update failed");

      const updatedCustomer = await response.json();
      socket?.emit("customerUpdate", updatedCustomer);

      toast({
        title: t('customer.updateSuccess'),
        description: t('customer.updateSuccessMessage'),
      });

      setIsEditing(false);
    } catch (error) {
      toast({
        title: t('customer.updateError'),
        description: t('customer.updateErrorMessage'),
        variant: "destructive",
      });
    }
  };

  if (!customer) return null;

  return (
    <Dialog open={!!customer} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? t('customer.edit') : t('customer.details')}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t('customer.name')}</Label>
              {isEditing ? (
                <Input
                  value={formData.name || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{customer.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('customer.phone')}</Label>
              {isEditing ? (
                <Input
                  value={formData.phone || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{customer.phone}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('customer.province')}</Label>
              {isEditing ? (
                <Input
                  value={formData.province || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, province: e.target.value })
                  }
                />
              ) : (
                <p className="text-sm">{customer.province}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label>{t('customer.lastContact')}</Label>
              <p className="text-sm">
                {customer.lastContact &&
                  format(new Date(customer.lastContact), 'yyyy/MM/dd')}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t('customer.notes')}</Label>
            {isEditing ? (
              <Textarea
                value={formData.notes || ""}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={4}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap">{customer.notes}</p>
            )}
          </div>

          <div className="flex justify-end gap-2">
            {isEditing ? (
              <>
                <Button type="submit">{t('common.save')}</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  {t('common.cancel')}
                </Button>
              </>
            ) : (
              <Button type="button" onClick={() => setIsEditing(true)}>
                {t('common.edit')}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}