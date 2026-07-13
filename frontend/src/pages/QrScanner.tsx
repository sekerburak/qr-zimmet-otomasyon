import React from 'react';
import { QrCode } from 'lucide-react';

const QrScanner = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center h-[500px] flex flex-col items-center justify-center animate-in fade-in">
      <div className="w-24 h-24 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-6">
        <QrCode className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">QR Tarayıcı Yapım Aşamasında</h2>
      <p className="text-slate-500 max-w-md mx-auto">
        Yakında html5-qrcode kütüphanesi buraya entegre edilecek ve kameradan okunan değerlerle sistemde sorgulama yapılacak.
      </p>
    </div>
  );
};

export default QrScanner;
