
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ApplicationIntent, FormData } from './types';
import { TESTIMONIALS, FEATURES } from './constants';
import { geminiService } from './services/geminiService';

// --- Sub-components ---

const Header: React.FC = () => (
  <header className="fixed top-0 left-0 right-0 z-50 bg-soft-white/80 backdrop-blur-md border-b border-sand/30">
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="text-moss font-serif text-2xl font-black tracking-widest">TARA SAJU</div>
      <nav className="hidden md:flex gap-8 text-sm font-medium text-moss/70">
        <a href="#features" className="hover:text-moss transition-colors">핵심 분석</a>
        <a href="#social" className="hover:text-moss transition-colors">후기</a>
        <a href="#apply" className="px-4 py-2 bg-moss text-white rounded-full hover:bg-deep-moss transition-colors">리포트 신청</a>
      </nav>
    </div>
  </header>
);

const Hero: React.FC<{ onSetIntent: (intent: ApplicationIntent) => void }> = ({ onSetIntent }) => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <img 
        src="https://images.unsplash.com/photo-1544207592-72eeFA17aa35?q=80&w=2072&auto=format&fit=crop" 
        alt="Zen Interior" 
        className="w-full h-full object-cover brightness-110 scale-105"
      />
      <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px]"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/20 to-soft-white"></div>
    </div>
    
    <div className="relative z-10 max-w-4xl px-6 text-center">
      <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight animate-fade-in text-moss">
        요즘, 왜 이렇게 막막한지.<br />
        <span className="text-sand drop-shadow-sm">사주 흐름</span>으로 정확히 정리해드립니다.
      </h1>
      <p className="text-lg md:text-xl font-medium mb-10 text-moss/80 max-w-2xl mx-auto leading-relaxed">
        타라사주는 달콤한 말로 끝내지 않습니다. 당신의 사주 구조로부터 지금 막히는 이유와 열리는 타이밍을 알려드립니다.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
        <a href="#apply" className="w-full sm:w-auto px-8 py-4 bg-moss text-white font-bold rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all">
          내 사주 리포트 신청하기
        </a>
      </div>

      <div className="flex flex-wrap justify-center gap-6 pt-8 border-t border-moss/10">
        <button 
          onClick={() => { onSetIntent('romance'); window.location.href = '#apply'; }}
          className="flex items-center gap-2 text-moss/70 hover:text-moss transition-colors group font-semibold"
        >
          <span className="w-8 h-8 rounded-full border border-moss/30 flex items-center justify-center group-hover:border-moss group-hover:bg-moss/5 transition-all text-xs">↓</span>
          일·돈·미래가 답답해요
        </button>
        <button 
          onClick={() => { onSetIntent('life'); window.location.href = '#apply'; }}
          className="flex items-center gap-2 text-moss/70 hover:text-moss transition-colors group font-semibold"
        >
          <span className="w-8 h-8 rounded-full border border-moss/30 flex items-center justify-center group-hover:border-moss group-hover:bg-moss/5 transition-all text-xs">↓</span>
          연애·결혼이 궁금해요
        </button>
      </div>
      <p className="mt-8 text-xs text-moss/50 tracking-widest font-bold">사주를 알면 결정이 쉬워집니다.</p>
    </div>
  </section>
);

const ProblemSolution: React.FC = () => (
  <section className="py-24 px-6 bg-soft-white overflow-hidden">
    <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-stretch">
      <div className="flex items-center justify-center p-8 rounded-2xl bg-soft-white border border-sand/20">
        <div className="relative w-full max-w-xs aspect-square flex items-center justify-center">
          <img 
            src="https://raw.githubusercontent.com/lee-anthony/ai-assets/main/saju_elements.png" 
            alt="Wu Xing Five Elements Diagram" 
            className="w-full h-auto object-contain drop-shadow-xl animate-fade-in"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1621252179027-94459d278660?q=80&w=1000&auto=format&fit=crop";
            }}
          />
        </div>
      </div>
      <div className="relative flex flex-col justify-center">
        {/* 네모 배경 하얀색, 테두리는 Type B와 동일한 border-sand 적용 */}
        <div className="bg-white border-2 border-sand rounded-3xl p-10 md:p-12 shadow-xl h-full flex flex-col justify-center">
           <div className="inline-block px-3 py-1 bg-sand/20 text-moss text-[10px] font-black tracking-widest rounded-full mb-6 w-fit">SOLUTION</div>
           <h3 className="text-2xl font-serif mb-6 text-moss font-black">정확한 사주 구조 분석</h3>
           <div className="space-y-6 text-moss/80 font-medium leading-relaxed">
             <p>
               당신의 사주 구조로 무엇이 막는지, 무엇이 열리는지를 분명히 말합니다. 그래서 결정이 쉬워집니다.
             </p>
             <p className="pt-6 border-t border-sand/30">
               타라사주는 추상적인 위로 대신,<br />
               <span className="text-moss font-black underline decoration-sand decoration-4 underline-offset-4">명확한 데이터를 제공합니다.</span>
             </p>
           </div>
        </div>
      </div>
    </div>
  </section>
);

const SegmentationBridge: React.FC<{ selectedIntent: ApplicationIntent; onSetIntent: (intent: ApplicationIntent) => void }> = ({ selectedIntent, onSetIntent }) => (
  <section id="bridge" className="py-24 px-6 bg-[#F2EDE4]">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-serif mb-4 text-moss">지금 가장 시급한 고민은 무엇인가요?</h2>
        <p className="text-moss/60">목적에 최적화된 리포트를 구성해드립니다.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div 
          onClick={() => onSetIntent('life')}
          className={`cursor-pointer group p-10 rounded-3xl border-2 transition-all h-full flex flex-col justify-between ${selectedIntent === 'life' ? 'bg-moss text-white border-moss shadow-2xl' : 'bg-white text-moss border-sand hover:border-moss'}`}
        >
          <div>
            <span className="text-sm font-bold tracking-widest opacity-60">TYPE A. 인생 고민형</span>
            <h3 className="text-2xl md:text-3xl font-serif mt-4 mb-8">“지금은 밀어붙일 때인지,<br />정비할 때인지부터.”</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start gap-3">
                <span className="mt-1">●</span>
                <span>힘이 붙는 시기 vs 소모가 큰 시기 구분</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">●</span>
                <span>커리어 방향(버팀/이직/확장) 우선순위 제안</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">●</span>
                <span>돈 흐름(붙는 구간/새는 구간) 관리 포인트</span>
              </li>
            </ul>
          </div>
          <a href="#apply" className={`mt-10 inline-block px-6 py-3 rounded-full text-center font-bold border transition-all ${selectedIntent === 'life' ? 'bg-white text-moss border-white hover:bg-transparent hover:text-white' : 'bg-moss text-white border-moss hover:bg-transparent hover:text-moss'}`}>
            내 흐름 먼저 정리하기
          </a>
        </div>

        <div 
          onClick={() => onSetIntent('romance')}
          className={`cursor-pointer group p-10 rounded-3xl border-2 transition-all h-full flex flex-col justify-between ${selectedIntent === 'romance' ? 'bg-sand text-deep-moss border-sand shadow-2xl' : 'bg-white text-moss border-sand hover:border-sand/60'}`}
        >
          <div>
            <span className="text-sm font-bold tracking-widest opacity-60">TYPE B. 연애·결혼형</span>
            <h3 className="text-2xl md:text-3xl font-serif mt-4 mb-8">“그 사람, 그리고 그 시기.<br />흔들리지 않게.”</h3>
            <ul className="space-y-4 text-lg">
              <li className="flex items-start gap-3">
                <span className="mt-1">●</span>
                <span>내게 맞는 관계의 결(붙는 타입/깨지는 포인트)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">●</span>
                <span>인연의 타이밍(시작/정리/결정 유리 시기)</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1">●</span>
                <span>결혼·가정운에서 중요한 선택 기준</span>
              </li>
            </ul>
          </div>
          <a href="#apply" className={`mt-10 inline-block px-6 py-3 rounded-full text-center font-bold border transition-all ${selectedIntent === 'romance' ? 'bg-deep-moss text-white border-deep-moss hover:bg-transparent hover:text-deep-moss' : 'bg-sand text-deep-moss border-sand hover:bg-transparent hover:text-sand'}`}>
            연애·결혼 흐름 확인하기
          </a>
        </div>
      </div>
    </div>
  </section>
);

const Features: React.FC = () => (
  <section id="features" className="py-24 px-6 bg-white">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-serif text-moss mb-4">6가지 핵심 분석 항목</h2>
        <p className="text-moss/50">단순한 운세가 아닌, 당신의 운명을 구성하는 6개의 기둥을 분석합니다.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {FEATURES.map((feature) => (
          <div key={feature.id} className="p-10 rounded-2xl bg-soft-white border border-sand/20 hover:border-sand hover:shadow-lg transition-all group">
            <div className="text-4xl mb-6 group-hover:scale-110 transition-transform inline-block">{feature.icon}</div>
            <h3 className="text-xl font-bold font-serif mb-4 text-moss">{feature.title}</h3>
            <p className="text-moss/70 leading-relaxed">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const SocialProof: React.FC = () => (
  <section id="social" className="py-24 bg-moss overflow-hidden">
    <div className="text-center mb-16 px-6">
      <h2 className="text-3xl md:text-4xl font-serif text-sand mb-4">타라사주가 바꾼 삶의 조각들</h2>
      <p className="text-sand/60">이미 많은 분들이 감이 아닌 흐름으로 삶을 재정비하고 있습니다.</p>
    </div>
    
    <div className="relative flex whitespace-nowrap overflow-hidden">
      <div className="flex gap-6 animate-scroll">
        {[...TESTIMONIALS, ...TESTIMONIALS].map((testimony, idx) => (
          <div key={idx} className="inline-block w-[350px] whitespace-normal bg-deep-moss/50 border border-sand/20 p-8 rounded-2xl text-sand/90">
            <p className="italic mb-6 leading-relaxed">"{testimony.content}"</p>
            <div className="text-sm font-bold opacity-70">— {testimony.author}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const ApplicationForm: React.FC<{ intent: ApplicationIntent; onIntentChange: (intent: ApplicationIntent) => void }> = ({ intent, onIntentChange }) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    gender: 'female',
    birthDate: '',
    birthTime: 'unknown',
    calendarType: 'solar',
    intent: intent || 'life'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (intent) {
        setFormData(prev => ({ ...prev, intent }));
    }
  }, [intent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setPreview(null);
    
    const aiPreview = await geminiService.generatePreview(formData);
    setPreview(aiPreview);
    setIsLoading(false);
    
    window.scrollTo({ top: (document.getElementById('preview')?.offsetTop || 0) - 100, behavior: 'smooth' });
  };

  const handleIntentToggle = (newIntent: ApplicationIntent) => {
    onIntentChange(newIntent);
    setFormData(prev => ({ ...prev, intent: newIntent }));
  };

  return (
    <section id="apply" className="py-24 px-6 bg-soft-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-serif text-moss mb-4">리포트 신청 (입력 1분)</h2>
          <p className="text-moss/60">정확한 분석을 위해 필요한 정보를 입력해 주세요.</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-8 md:p-12 rounded-3xl shadow-xl border border-sand/30 space-y-8">
          <div className="space-y-4 p-6 bg-[#F2EDE4]/50 rounded-2xl border border-sand/30">
            <label className="text-sm font-bold text-moss/70 block text-center">분석 옵션 선택</label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => handleIntentToggle('life')}
                className={`flex-1 px-4 py-4 rounded-xl font-bold transition-all border-2 ${formData.intent === 'life' ? 'bg-moss text-white border-moss shadow-md' : 'bg-white text-moss border-sand/40 hover:border-moss/40'}`}
              >
                <div className="text-lg">종합 사주 분석</div>
                <div className="text-[10px] opacity-60 font-medium">일·재물·커리어·대운</div>
              </button>
              <button
                type="button"
                onClick={() => handleIntentToggle('romance')}
                className={`flex-1 px-4 py-4 rounded-xl font-bold transition-all border-2 ${formData.intent === 'romance' ? 'bg-sand text-deep-moss border-sand shadow-md' : 'bg-white text-moss border-sand/40 hover:border-sand/40'}`}
              >
                <div className="text-lg">연애운 특화 분석</div>
                <div className="text-[10px] opacity-60 font-medium">인연·타이밍·관계의 결</div>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-moss/70 block">이름</label>
              <input 
                required 
                type="text" 
                placeholder="성함을 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-sand/40 focus:ring-2 focus:ring-moss focus:outline-none transition-all"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-moss/70 block">성별</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-sand/40 focus:ring-2 focus:ring-moss focus:outline-none transition-all"
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
              >
                <option value="female">여성</option>
                <option value="male">남성</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-moss/70 block">생년월일</label>
              <input 
                required 
                type="date" 
                className="w-full px-4 py-3 rounded-xl border border-sand/40 focus:ring-2 focus:ring-moss focus:outline-none transition-all"
                value={formData.birthDate}
                onChange={(e) => setFormData({...formData, birthDate: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-moss/70 block">태어난 시간</label>
              <select 
                className="w-full px-4 py-3 rounded-xl border border-sand/40 focus:ring-2 focus:ring-moss focus:outline-none transition-all"
                value={formData.birthTime}
                onChange={(e) => setFormData({...formData, birthTime: e.target.value})}
              >
                <option value="unknown">모름 (자시 전후 00시 기준)</option>
                <option value="00:00">자시 (00:00 ~ 01:30)</option>
                <option value="02:00">축시 (01:30 ~ 03:30)</option>
                <option value="04:00">인시 (03:30 ~ 05:30)</option>
                <option value="06:00">묘시 (05:30 ~ 07:30)</option>
                <option value="08:00">진시 (07:30 ~ 09:30)</option>
                <option value="10:00">사시 (09:30 ~ 11:30)</option>
                <option value="12:00">오시 (11:30 ~ 13:30)</option>
                <option value="14:00">미시 (13:30 ~ 15:30)</option>
                <option value="16:00">신시 (15:30 ~ 17:30)</option>
                <option value="18:00">유시 (17:30 ~ 19:30)</option>
                <option value="20:00">술시 (19:30 ~ 21:30)</option>
                <option value="22:00">해시 (21:30 ~ 23:30)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-moss/70 block">일력 구분</label>
            <div className="flex gap-4">
              {(['solar', 'lunar', 'leap-lunar'] as const).map((type) => (
                <label key={type} className="flex-1">
                  <input 
                    type="radio" 
                    className="hidden peer" 
                    name="calendar" 
                    value={type} 
                    checked={formData.calendarType === type}
                    onChange={() => setFormData({...formData, calendarType: type})}
                  />
                  <div className="px-4 py-3 text-center border border-sand/40 rounded-xl cursor-pointer peer-checked:bg-moss peer-checked:text-white peer-checked:border-moss transition-all">
                    {type === 'solar' ? '양력' : type === 'lunar' ? '음력' : '윤달'}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-soft-white rounded-xl">
            <input type="checkbox" required className="mt-1 w-4 h-4 accent-moss" />
            <span className="text-xs text-moss/70 leading-relaxed">
              [필수] 개인정보 수집 및 이용에 동의합니다. 제공하신 정보는 사주 리포트 생성 및 분석 서비스 제공 목적으로만 사용되며, 그 외 용도로 활용되지 않습니다.
            </span>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-5 rounded-full font-black text-lg transition-all shadow-lg ${isLoading ? 'bg-moss/50 cursor-not-allowed' : 'bg-moss text-white hover:bg-deep-moss hover:scale-[1.02]'}`}
          >
            {isLoading ? '운명의 데이터를 읽고 있습니다...' : '작성 완료하고 리포트 신청하기'}
          </button>
          
          <p className="text-center text-xs text-moss/40">더 이상 감이 아닌 흐름을 확인하고 결정하세요.</p>
        </form>

        {preview && (
          <div id="preview" className="mt-12 p-10 bg-white border-2 border-sand rounded-3xl animate-fade-in-up">
            <div className="text-center mb-8">
               <span className="inline-block px-4 py-1 bg-sand/20 text-moss text-xs font-bold rounded-full mb-4">SNEAK PEEK REPORT</span>
               <h3 className="text-2xl font-serif text-moss">{formData.name}님의 사주 기운 흐름</h3>
            </div>
            <div className="font-serif italic text-lg text-moss/80 leading-relaxed text-center mb-8 whitespace-pre-wrap">
              "{preview}"
            </div>
            <div className="p-6 bg-soft-white rounded-xl text-center space-y-4">
               <p className="text-sm text-moss/60">상세 분석 내용이 포함된 풀 리포트는 입력하신 연락처로 발송 준비 중입니다.</p>
               <button className="px-8 py-3 bg-moss text-white rounded-full font-bold hover:bg-deep-moss transition-colors">
                 리포트 결제하고 바로 확인하기
               </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

const FinalCTA: React.FC = () => (
  <section className="py-32 px-6 bg-deep-moss text-sand relative overflow-hidden">
    <div className="absolute top-0 left-0 w-full h-full opacity-10">
      <img src="https://images.unsplash.com/photo-1544207592-72eeFA17aa35?q=80&w=2072&auto=format&fit=crop" alt="Zen Texture" className="w-full h-full object-cover" />
    </div>
    <div className="max-w-4xl mx-auto text-center relative z-10">
      <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
        지금이 ‘밀어붙일 때’인지,<br />
        ‘멈춰야 할 때’인지. 먼저 알고 움직이세요.
      </h2>
      <p className="text-lg md:text-xl font-light mb-12 text-sand/70 max-w-2xl mx-auto">
        타라사주 리포트는 당신을 불안하게 하지 않습니다.<br />
        정확히 정리해서, 단정히 선택하게 합니다.
      </p>
      <a href="#apply" className="inline-block px-12 py-5 bg-sand text-deep-moss font-black text-xl rounded-full hover:shadow-2xl hover:scale-105 transition-all">
        지금 내 사주 리포트 신청하기
      </a>
    </div>
  </section>
);

const Footer: React.FC = () => (
  <footer className="bg-soft-white py-16 px-6 border-t border-sand/20 text-moss/70">
    <div className="max-w-7xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-12 text-sm">
      <div className="space-y-6">
        <div className="text-moss font-serif text-2xl font-black">TARA SAJU</div>
        <div className="space-y-2">
          <p className="font-bold text-moss text-base">노마릿</p>
          <p><span className="font-semibold">대표 :</span> 고수빈</p>
          <p><span className="font-semibold">주소 :</span> 경기도 용인시 처인구 포곡읍 포곡로 72, 2층 204호 C555(대두빌딩)</p>
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="font-bold text-moss text-base tracking-widest">CS & CONTACT</h4>
        <div className="space-y-3">
          <p><span className="font-semibold">CS :</span> <span className="text-moss font-bold">010-4648-0046</span></p>
          <p><span className="font-semibold">Contact :</span> binzzz010101@gmail.com</p>
          <p><span className="font-semibold">Kakao :</span> @타라사주</p>
        </div>
      </div>
      <div className="space-y-6">
        <p className="text-xs leading-relaxed opacity-80 border-l border-sand pl-4">
          타라사주는 현대적인 감각으로 사주 명리학을 재해석하여, <br />
          삶의 중요한 변곡점에서 최고의 결정을 돕는 리포트 서비스를 제공합니다.
        </p>
        <div className="pt-2">
          <p className="text-[10px] uppercase tracking-tighter opacity-50 font-bold">Zen, Warm, Sophisticated Insights.</p>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-sand/10 text-center text-[10px] opacity-40 uppercase tracking-widest">
      &copy; {new Date().getFullYear()} 노마릿. All rights reserved.
    </div>
  </footer>
);

const App: React.FC = () => {
  const [intent, setIntent] = useState<ApplicationIntent>(null);

  return (
    <div className="min-h-screen selection:bg-sand selection:text-deep-moss">
      <Header />
      <main>
        <Hero onSetIntent={setIntent} />
        <ProblemSolution />
        <SegmentationBridge selectedIntent={intent} onSetIntent={setIntent} />
        <Features />
        <SocialProof />
        <ApplicationForm intent={intent} onIntentChange={setIntent} />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
};

export default App;
