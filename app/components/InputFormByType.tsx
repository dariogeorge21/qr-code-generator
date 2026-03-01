'use client';

import { useState } from 'react';
import { useQRStore } from '../store/useQRStore';
import Dropdown from './shared/Dropdown';

interface InputFormByTypeProps {
  type: string;
}

export default function InputFormByType({ type }: InputFormByTypeProps) {
  const set = useQRStore((s) => s.set);
  const inputValue = useQRStore((s) => s.inputValue);
  const upiId = useQRStore((s) => s.upiId);
  const payeeName = useQRStore((s) => s.payeeName);
  const amount = useQRStore((s) => s.amount);
  const transactionNote = useQRStore((s) => s.transactionNote);

  // Local state for multi-field types
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactOrg, setContactOrg] = useState('');
  const [contactAddress, setContactAddress] = useState('');

  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiSecurity, setWifiSecurity] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  const [emailTo, setEmailTo] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  const [smsPhone, setSmsPhone] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  const [phoneNumber, setPhoneNumber] = useState('');

  const [socialPlatform, setSocialPlatform] = useState('');
  const [socialUrl, setSocialUrl] = useState('');

  const inputClass =
    'w-full px-4 py-3 text-sm border border-[var(--color-border)] rounded-xl focus:ring-4 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none bg-[var(--color-background)] text-[var(--color-text)] placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200';
  const labelClass = 'block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider';
  const selectClass =
    'w-full px-4 py-3 text-sm border border-[var(--color-border)] rounded-xl focus:ring-4 focus:ring-[var(--color-secondary)]/20 focus:border-[var(--color-secondary)] outline-none bg-[var(--color-background)] text-[var(--color-text)] transition-all duration-200';

  const updateUPI = (updates: Partial<{ upiId: string; payeeName: string; amount: string; transactionNote: string }>) => {
    useQRStore.setState(updates);
    const s = useQRStore.getState();
    const uid = s.upiId.trim();
    if (!uid) {
      useQRStore.setState({ inputValue: '' });
      return;
    }
    const params = new URLSearchParams();
    params.set('pa', uid);
    if (s.payeeName.trim()) params.set('pn', s.payeeName.trim());
    if (s.amount.trim()) {
      const num = Number(s.amount.trim().replace(/[^\d.]/g, ''));
      if (num > 0 && isFinite(num)) {
        params.set('am', num.toFixed(2));
        params.set('cu', 'INR');
      }
    }
    if (s.transactionNote.trim()) params.set('tn', s.transactionNote.trim());
    const queryString = params.toString().replace(/\+/g, '%20');
    useQRStore.setState({ inputValue: `upi://pay?${queryString}` });
  };

  const updateContact = (name: string, phone: string, email: string, org: string, address: string) => {
    const vcard = `BEGIN:VCARD\nVERSION:3.0\nFN:${name}\nTEL:${phone}\nEMAIL:${email}\nORG:${org}\nADR:;;${address}\nEND:VCARD`;
    set({ inputValue: vcard });
  };

  const escapeWifiString = (str: string): string => {
    return str
      .replace(/\\/g, '\\\\')
      .replace(/;/g, '\\;')
      .replace(/"/g, '\\"')
      .replace(/,/g, '\\,')
      .replace(/:/g, '\\:');
  };

  const updateWifi = (ssid: string, password: string, security: string, hidden: boolean) => {
    const escapedSSID = escapeWifiString(ssid);
    const escapedPassword = escapeWifiString(password);
    const securityType = security === 'nopass' ? 'nopass' : security;
    const hiddenValue = hidden ? 'true' : 'false';
    set({ inputValue: `WIFI:T:${securityType};S:${escapedSSID};P:${escapedPassword};H:${hiddenValue};` });
  };

  const updateEmail = (to: string, subject: string, body: string) => {
    set({ inputValue: `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}` });
  };

  const updateSms = (phone: string, message: string) => {
    set({ inputValue: `sms:${phone}?body=${encodeURIComponent(message)}` });
  };

  const socialUrlMap: Record<string, string> = {
    'instagram': 'https://instagram.com/',
    'twitter / x': 'https://x.com/',
    'facebook': 'https://facebook.com/',
    'linkedin': 'https://linkedin.com/',
    'tiktok': 'https://tiktok.com/',
    'youtube': 'https://youtube.com/',
    'github': 'https://github.com/',
    'other': '',
  };

  switch (type) {
    case 'payment':
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>UPI ID <span className="text-red-500">*</span></label>
            <input type="text" value={upiId} onChange={(e) => updateUPI({ upiId: e.target.value })} placeholder="yourname@paytm" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Payee Name</label>
            <input type="text" value={payeeName} onChange={(e) => updateUPI({ payeeName: e.target.value })} placeholder="Your Name" className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Amount (₹)</label>
              <input type="text" inputMode="decimal" value={amount} onChange={(e) => { if (e.target.value === '' || /^\d*\.?\d*$/.test(e.target.value)) updateUPI({ amount: e.target.value }); }} placeholder="100.00" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Note</label>
              <input type="text" value={transactionNote} onChange={(e) => updateUPI({ transactionNote: e.target.value })} placeholder="Payment for..." className={inputClass} />
            </div>
          </div>
        </div>
      );

    case 'website':
      return (
        <div>
          <label className={labelClass}>Website URL</label>
          <input type="url" value={inputValue} onChange={(e) => set({ inputValue: e.target.value })} placeholder="https://example.com" className={inputClass} />
        </div>
      );

    case 'social':
      const platformOptions = [
        { value: 'instagram', label: 'Instagram' },
        { value: 'twitter / x', label: 'Twitter / X' },
        { value: 'facebook', label: 'Facebook' },
        { value: 'linkedin', label: 'LinkedIn' },
        { value: 'tiktok', label: 'TikTok' },
        { value: 'youtube', label: 'YouTube' },
        { value: 'github', label: 'GitHub' },
        { value: 'other', label: 'Other' },
      ];

      return (
        <div className="space-y-4">
          <Dropdown
            label="Platform"
            value={socialPlatform}
            onChange={(value) => setSocialPlatform(value)}
            options={platformOptions}
            placeholder="Select a platform..."
          />
          {socialPlatform && (
            <div>
              <label className={labelClass}>Profile URL</label>
              <input
                type="url"
                value={socialUrl}
                onChange={(e) => {
                  setSocialUrl(e.target.value);
                  set({ inputValue: e.target.value });
                }}
                onFocus={() => {
                  if (!socialUrl && socialPlatform) {
                    const baseUrl = socialUrlMap[socialPlatform] || '';
                    setSocialUrl(baseUrl);
                    set({ inputValue: baseUrl });
                  }
                }}
                placeholder="https://instagram.com/yourprofile"
                className={inputClass}
              />
            </div>
          )}
        </div>
      );

    case 'contact':
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Full Name</label>
            <input type="text" value={contactName} onChange={(e) => { setContactName(e.target.value); updateContact(e.target.value, contactPhone, contactEmail, contactOrg, contactAddress); }} placeholder="John Doe" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input type="tel" value={contactPhone} onChange={(e) => { setContactPhone(e.target.value); updateContact(contactName, e.target.value, contactEmail, contactOrg, contactAddress); }} placeholder="+1 234 567 8900" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input type="email" value={contactEmail} onChange={(e) => { setContactEmail(e.target.value); updateContact(contactName, contactPhone, e.target.value, contactOrg, contactAddress); }} placeholder="john@example.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Organisation</label>
            <input type="text" value={contactOrg} onChange={(e) => { setContactOrg(e.target.value); updateContact(contactName, contactPhone, contactEmail, e.target.value, contactAddress); }} placeholder="Acme Corp" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input type="text" value={contactAddress} onChange={(e) => { setContactAddress(e.target.value); updateContact(contactName, contactPhone, contactEmail, contactOrg, e.target.value); }} placeholder="123 Main St, City" className={inputClass} />
          </div>
        </div>
      );

    case 'wifi':
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Network Name (SSID)</label>
            <input type="text" value={wifiSSID} onChange={(e) => { setWifiSSID(e.target.value); updateWifi(e.target.value, wifiPassword, wifiSecurity, wifiHidden); }} placeholder="My WiFi Network" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Password</label>
            <input type="text" value={wifiPassword} onChange={(e) => { setWifiPassword(e.target.value); updateWifi(wifiSSID, e.target.value, wifiSecurity, wifiHidden); }} placeholder="password123" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Security</label>
            <select value={wifiSecurity} onChange={(e) => { setWifiSecurity(e.target.value); updateWifi(wifiSSID, wifiPassword, e.target.value, wifiHidden); }} className={selectClass}>
              <option value="WPA">WPA / WPA2</option>
              <option value="WEP">WEP</option>
              <option value="nopass">None</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-[var(--color-text)]">Hidden Network</label>
            <button
              onClick={() => { const newVal = !wifiHidden; setWifiHidden(newVal); updateWifi(wifiSSID, wifiPassword, wifiSecurity, newVal); }}
              className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${wifiHidden ? 'bg-orange-600 dark:bg-yellow-400' : 'bg-gray-200 dark:bg-gray-700'}`}
            >
              <span className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-200 ${wifiHidden ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>
        </div>
      );

    case 'text':
      return (
        <div>
          <label className={labelClass}>Your Text</label>
          <textarea value={inputValue} onChange={(e) => set({ inputValue: e.target.value })} placeholder="Enter any text content..." className={`${inputClass} min-h-[160px] resize-y`} />
        </div>
      );

    case 'email':
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>To (Email Address)</label>
            <input type="email" value={emailTo} onChange={(e) => { setEmailTo(e.target.value); updateEmail(e.target.value, emailSubject, emailBody); }} placeholder="recipient@example.com" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Subject</label>
            <input type="text" value={emailSubject} onChange={(e) => { setEmailSubject(e.target.value); updateEmail(emailTo, e.target.value, emailBody); }} placeholder="Hello!" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Body</label>
            <textarea value={emailBody} onChange={(e) => { setEmailBody(e.target.value); updateEmail(emailTo, emailSubject, e.target.value); }} placeholder="Write your message..." className={`${inputClass} min-h-[100px] resize-y`} />
          </div>
        </div>
      );

    case 'phone':
      return (
        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => {
              setPhoneNumber(e.target.value);
              set({ inputValue: `tel:${e.target.value}` });
            }}
            placeholder="+1 234 567 8900"
            className={inputClass}
          />
        </div>
      );

    case 'sms':
      return (
        <div className="space-y-4">
          <div>
            <label className={labelClass}>Phone Number</label>
            <input type="tel" value={smsPhone} onChange={(e) => { setSmsPhone(e.target.value); updateSms(e.target.value, smsMessage); }} placeholder="+1 234 567 8900" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Message</label>
            <textarea value={smsMessage} onChange={(e) => { setSmsMessage(e.target.value); updateSms(smsPhone, e.target.value); }} placeholder="Your SMS message..." className={`${inputClass} min-h-[100px] resize-y`} />
          </div>
        </div>
      );

    default:
      return (
        <div>
          <label className={labelClass}>Content</label>
          <textarea value={inputValue} onChange={(e) => set({ inputValue: e.target.value })} placeholder="Enter text, URL, phone number, email..." className={`${inputClass} min-h-[120px] resize-y`} />
        </div>
      );
  }
}
