import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Sparkles, Star, Moon, Sun } from 'lucide-react';

const ZODIAC_SIGNS = [
  { name: 'Koç', dates: '21 Mart - 19 Nisan' },
  { name: 'Boğa', dates: '20 Nisan - 20 Mayıs' },
  { name: 'İkizler', dates: '21 Mayıs - 20 Haziran' },
  { name: 'Yengeç', dates: '21 Haziran - 22 Temmuz' },
  { name: 'Aslan', dates: '23 Temmuz - 22 Ağustos' },
  { name: 'Başak', dates: '23 Ağustos - 22 Eylül' },
  { name: 'Terazi', dates: '23 Eylül - 22 Ekim' },
  { name: 'Akrep', dates: '23 Ekim - 21 Kasım' },
  { name: 'Yay', dates: '22 Kasım - 21 Aralık' },
  { name: 'Oğlak', dates: '22 Aralık - 19 Ocak' },
  { name: 'Kova', dates: '20 Ocak - 18 Şubat' },
  { name: 'Balık', dates: '19 Şubat - 20 Mart' },
];

function App() {
  const [selectedSign, setSelectedSign] = useState('');
  const [reading, setReading] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const getHoroscope = async (sign: string) => {
    setLoading(true);
    setError('');
    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('API anahtarı bulunamadı!');
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

      const prompt = `${sign} burcu için günlük yorum yazar mısın? Aşk, kariyer ve sağlık alanlarında detaylı bir yorum olsun. Yaklaşık 150 kelime olsun.`;
      
      const result = await model.generateContent(prompt);
      const response = await result.response;
      setReading(response.text());
    } catch (error) {
      console.error('Error:', error);
      setError('Üzgünüz, bir hata oluştu. Lütfen API anahtarınızı kontrol edin ve tekrar deneyin.');
      setReading('');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-pink-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Moon className="w-8 h-8 text-yellow-300" />
            <Star className="w-10 h-10 text-yellow-300" />
            <Sun className="w-8 h-8 text-yellow-300" />
          </div>
          <h1 className="text-4xl font-bold mb-2">Astroloji Rehberi</h1>
          <p className="text-lg text-purple-200">Yıldızların size ne söylediğini keşfedin</p>
        </header>

        {error && (
          <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-12">
          {ZODIAC_SIGNS.map((sign) => (
            <button
              key={sign.name}
              onClick={() => {
                setSelectedSign(sign.name);
                getHoroscope(sign.name);
              }}
              className={`p-4 rounded-lg transition-all duration-300 ${
                selectedSign === sign.name
                  ? 'bg-white/20 shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/15'
              }`}
            >
              <h3 className="text-xl font-semibold mb-1">{sign.name}</h3>
              <p className="text-sm text-purple-200">{sign.dates}</p>
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-6 h-6 animate-spin text-yellow-300" />
            <p>Yıldızlar konuşuyor...</p>
          </div>
        )}

        {reading && !loading && (
          <div className="bg-white/10 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Star className="w-6 h-6 text-yellow-300" />
              {selectedSign} Günlük Yorumu
            </h2>
            <p className="text-lg leading-relaxed whitespace-pre-line">{reading}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;