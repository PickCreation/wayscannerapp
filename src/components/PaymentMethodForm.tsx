
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface PaymentMethodFormProps {
  type: "card" | "paypal" | "payoneer";
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const years = Array.from({ length: 12 }, (_, i) => (new Date().getFullYear() + i).toString().slice(-2));

const PaymentMethodForm = ({ type, onSubmit, onCancel }: PaymentMethodFormProps) => {
  // Credit Card Form State
  const [cardholderName, setCardholderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState(months[0]);
  const [expiryYear, setExpiryYear] = useState(years[0]);
  const [cvv, setCvv] = useState('');

  // PayPal and Payoneer Form State
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (type === "card") {
      const last4 = cardNumber.slice(-4);
      let cardType: "visa" | "mastercard" | "amex" | "discover" = "visa";
      
      // Simple card type detection
      if (cardNumber.startsWith('4')) {
        cardType = "visa";
      } else if (cardNumber.startsWith('5')) {
        cardType = "mastercard";
      } else if (cardNumber.startsWith('3')) {
        cardType = "amex";
      } else if (cardNumber.startsWith('6')) {
        cardType = "discover";
      }

      onSubmit({
        cardInfo: {
          name: cardholderName,
          number: cardNumber,
          expiry: `${expiryMonth}/${expiryYear}`,
          last4: last4,
          cardType: cardType
        }
      });
    } else if (type === "paypal") {
      onSubmit({
        paypalInfo: {
          email: email
        }
      });
    } else if (type === "payoneer") {
      onSubmit({
        payoneerInfo: {
          email: email
        }
      });
    }
  };

  const formatCardNumber = (value: string) => {
    const digits = value.replace(/\D/g, '');
    let formattedValue = '';
    
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formattedValue += ' ';
      }
      formattedValue += digits[i];
    }
    
    return formattedValue;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatCardNumber(e.target.value);
    setCardNumber(formattedValue);
  };

  // Render different forms based on payment method type
  const renderForm = () => {
    if (type === "card") {
      return (
        <>
          <div className="space-y-2">
            <Label htmlFor="cardholderName">Cardholder Name</Label>
            <Input
              id="cardholderName"
              placeholder="John Doe"
              value={cardholderName}
              onChange={(e) => setCardholderName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cardNumber">Card Number</Label>
            <Input
              id="cardNumber"
              placeholder="4111 1111 1111 1111"
              value={cardNumber}
              onChange={handleCardNumberChange}
              maxLength={19}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry">Expiration Date</Label>
              <div className="flex gap-2">
                <Select value={expiryMonth} onValueChange={setExpiryMonth}>
                  <SelectTrigger id="expiryMonth" className="w-full">
                    <SelectValue placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map(month => (
                      <SelectItem key={month} value={month}>{month}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span className="self-center">/</span>
                <Select value={expiryYear} onValueChange={setExpiryYear}>
                  <SelectTrigger id="expiryYear" className="w-full">
                    <SelectValue placeholder="YY" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map(year => (
                      <SelectItem key={year} value={year}>{year}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cvv">CVV</Label>
              <Input
                id="cvv"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                maxLength={4}
                required
              />
            </div>
          </div>
        </>
      );
    } else if (type === "paypal" || type === "payoneer") {
      return (
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {renderForm()}

      <div className="flex gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          className="flex-1"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          className={`flex-1 ${
            type === "card" ? "bg-wayscanner-blue" : 
            type === "paypal" ? "bg-[#0070BA]" : "bg-[#FF4800]"
          }`}
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default PaymentMethodForm;
