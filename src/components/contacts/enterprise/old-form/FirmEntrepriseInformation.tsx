import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase } from 'lucide-react';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Activity, ResponseCurrencyDto, PaymentCondition } from '@/types';
import { useFirmStore } from '@/hooks/stores/useEnterpriseStore';
import { useTranslation } from 'react-i18next';
import { PhoneInput } from '@/components/ui/phone-input';

interface FirmProfessionalInformationProps {
  className?: string;
  activities?: Activity[];
  currencies?: ResponseCurrencyDto[];
  paymentConditions?: PaymentCondition[];
  loading?: boolean;
}

const FirmProfessionalInformation: React.FC<FirmProfessionalInformationProps> = ({
  className,
  activities,
  currencies,
  paymentConditions,
  loading
}) => {
  const { t: tContact } = useTranslation('contacts');
  const { t: tCurrency } = useTranslation('currency');

  const firmStore = useFirmStore();
  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <Briefcase className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">{tContact('common.firm_information')}</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex mt-2">
          <div className="ml-1 w-2/5">
            <Label>{tContact('firm.attributes.type')} (*)</Label>
            <div className="flex items-center my-4">
              <RadioGroup
                value={firmStore.isPerson ? 'particulier' : 'entreprise'}
                className="block md:flex justify-center items-center"
                onValueChange={(e) => {
                  firmStore.set('isPerson', e === 'particulier');
                  firmStore.set('taxIdNumber', '');
                }}>
                <div className="flex items-center">
                  <RadioGroupItem value="entreprise" />
                  <Label className="ml-1" isPending={loading}>
                    {tContact('firm.attributes.entreprise_type')}
                  </Label>
                </div>
                <div className="flex items-center">
                  <RadioGroupItem value="particulier" />
                  <Label className="ml-1" isPending={loading}>
                    {tContact('firm.attributes.particular_entreprise_type')}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </div>
          {!firmStore.isPerson && (
            <div className="w-3/5">
              <Label>{tContact('firm.attributes.tax_number')} (*)</Label>
              <Input
                className="mt-1"
                placeholder="Ex. 123456789"
                value={firmStore?.taxIdNumber}
                onChange={(e) => firmStore.set('taxIdNumber', e.target.value)}
              />
            </div>
          )}
        </div>
        <div className="flex mt-2">
          <div className="mr-1 w-1/3">
            <Label>{tContact('firm.attributes.entreprise_name')} (*)</Label>
            <Input
              className="mt-1"
              placeholder="Ex. Zedney Creative"
              value={firmStore?.enterpriseName}
              onChange={(e) => firmStore.set('enterpriseName', e.target.value)}
            />
          </div>
          <div className="mx-1 w-1/3">
            <Label>{tContact('firm.attributes.website')}</Label>
            <Input
              type="url"
              className="mt-1"
              placeholder="Ex. zedneycreative.com"
              value={firmStore?.website}
              onChange={(e) => firmStore.set('website', e.target.value)}
            />
          </div>
          <div className="mx-1 w-1/3">
            <Label>{tContact('firm.attributes.phone')}</Label>
            <PhoneInput
              isPending={!!loading}
              type="tel"
              defaultCountry="TN"
              className="mt-1"
              placeholder="Ex. +216 72 398 389"
              value={firmStore?.entreprisePhone}
              onChange={(value) => firmStore.set('entreprisePhone', value)}
            />
          </div>
        </div>

        <div className="flex mt-2">
          <div className="mt-1 mr-2 w-1/2">
            <Label>{tContact('firm.attributes.activity')}</Label>
            <div className="mt-2">
              <Select
                key={firmStore.activity?.id || 'activity'}
                onValueChange={(e) => firmStore.set('activity', { id: parseInt(e) } as Activity)}
                value={firmStore?.activity?.id?.toString() || ''}>
                <SelectTrigger>
                  <SelectValue placeholder={tContact('firm.attributes.activity')} />
                </SelectTrigger>
                <SelectContent>
                  {activities?.map((activity) => (
                    <SelectItem key={activity.id} value={activity?.id?.toString() || ''}>
                      {activity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-1 mr-2 w-1/2">
            <Label>{tContact('firm.attributes.currency')}</Label>
            <div className="mt-2">
              <Select
                key={firmStore.currency?.id || 'currency'}
                onValueChange={(e) =>
                  firmStore.set('currency', { id: parseInt(e) } as ResponseCurrencyDto)
                }
                value={firmStore?.currency?.id?.toString() || ''}>
                <SelectTrigger>
                  <SelectValue placeholder={tContact('firm.attributes.currency')} />
                </SelectTrigger>
                <SelectContent>
                  {currencies?.map((currency) => (
                    <SelectItem key={currency.id} value={currency?.id?.toString() || ''}>
                      {currency?.code && tCurrency(currency?.code)} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="flex mt-2">
          <div className="mr-2 w-full">
            <Label>{tContact('firm.attributes.payment_conditions')}</Label>
            <div className="mt-1">
              <Select
                key={firmStore.paymentCondition?.id || 'paymentCondition'}
                onValueChange={(e) =>
                  firmStore.set('paymentCondition', { id: parseInt(e) } as PaymentCondition)
                }
                value={firmStore?.paymentCondition?.id?.toString() || ''}>
                <SelectTrigger>
                  <SelectValue placeholder={tContact('firm.attributes.payment_conditions')} />
                </SelectTrigger>
                <SelectContent>
                  {paymentConditions?.map((condition) => (
                    <SelectItem key={condition.id} value={condition?.id?.toString() || ''}>
                      {condition.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FirmProfessionalInformation;
