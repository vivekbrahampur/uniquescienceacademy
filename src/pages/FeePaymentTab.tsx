import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

export default function FeePaymentTab({ student, showSuccess, showError }: { student: any, showSuccess?: (m: string) => void, showError?: (m: string) => void }) {
  const [amount, setAmount] = useState('');
  const [qrCode, setQrCode] = useState('');
  const [upiId, setUpiId] = useState('7325065925@ybl'); // Updated UPI ID

  const generateQR = async () => {
    if (!amount) return;
    // UPI string format
    const upiString = `upi://pay?pa=${upiId}&pn=SchoolName&am=${amount}&cu=INR&tn=Fee for ${student.name} (Roll: ${student.roll_no})`;
    try {
      const qr = await QRCode.toDataURL(upiString);
      setQrCode(qr);
      if (showSuccess) showSuccess('Payment QR generated successfully. Please scan and pay.');
    } catch (err) {
      console.error(err);
      if (showError) showError('Failed to generate QR code');
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold">Fee Payment</h3>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700">Student Name</label>
          <input type="text" value={student.name} disabled className="w-full p-2 border rounded bg-slate-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Roll Number</label>
          <input type="text" value={student.roll_no} disabled className="w-full p-2 border rounded bg-slate-100" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700">Amount (INR)</label>
          <input type="number" value={amount} onChange={e => setAmount(e.target.value)} className="w-full p-2 border rounded" />
        </div>
        <button onClick={generateQR} className="bg-blue-900 text-white px-4 py-2 rounded">
          Generate Payment QR
        </button>
      </div>

      {qrCode && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
          <h4 className="text-lg font-bold mb-4">Scan QR to Pay</h4>
          <img src={qrCode} alt="Payment QR" className="mx-auto" />
          <p className="mt-4 text-sm text-slate-600">Scan this QR code using any UPI app to pay ₹{amount}.</p>
        </div>
      )}
    </div>
  );
}
