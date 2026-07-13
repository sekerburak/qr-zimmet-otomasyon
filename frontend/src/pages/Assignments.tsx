import React from 'react';
import { ArrowRightLeft } from 'lucide-react';

const Assignments = () => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center h-[500px] flex flex-col items-center justify-center animate-in fade-in">
      <div className="w-24 h-24 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6">
        <ArrowRightLeft className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Zimmet İşlemleri Yapım Aşamasında</h2>
      <p className="text-slate-500 max-w-md mx-auto">
        Kullanıcılara demirbaş atama ve iade etme akışları, formları ve tabloları bu alanda yer alacaktır.
      </p>
    </div>
  );
};

export default Assignments;
