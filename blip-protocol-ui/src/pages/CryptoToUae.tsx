import React, { useState, useEffect } from 'react';
import './CryptoToUae.css';

// Type definitions
interface MerchantNode {
  id: number;
  name: string;
  type: 'bank' | 'cash';
  region: 'dxb' | 'auh';
  min: number;
  desc: string;
  latency: string;
  bond: 'LOW' | 'MED' | 'HIGH' | 'MAX';
}

interface ServiceData {
  title: string;
  content: string;
}

const CryptoToUae: React.FC = () => {
  // State management
  const [simAsset, setSimAsset] = useState<string>('USDT');
  const [simAmount, setSimAmount] = useState<number>(1000);
  const [simPriority, setSimPriority] = useState<'cheapest' | 'fastest'>('cheapest');
  const [pathAsset, setPathAsset] = useState<string>('USDT');
  const [pathMethod, setPathMethod] = useState<'bank' | 'cash'>('bank');
  const [pathRegion, setPathRegion] = useState<'dxb' | 'auh'>('dxb');
  const [pathAmount, setPathAmount] = useState<number>(50000);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  const [terminalModalOpen, setTerminalModalOpen] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContent, setModalContent] = useState<string>('');
  const [terminalContext, setTerminalContext] = useState<string>('Initiating secure channel...');
  const [faqOpen, setFaqOpen] = useState<{ [key: number]: boolean }>({});

  // Service data
  const serviceData: { [key: string]: ServiceData } = {
    crypto_aed: {
      title: 'Crypto to AED',
      content: `<h4 class="text-zinc-200 font-bold mb-2">Crypto to AED in UAE – Fast & Secure Conversion</h4><p class="mb-4">Converting crypto to AED in the UAE requires a trusted, transparent, and locally compliant solution. Blip Money provides a secure way for individuals and businesses to convert cryptocurrency into AED across Dubai and the UAE.</p><p class="mb-4">As demand for crypto cashout UAE services grows, users need a professional platform that removes uncertainty. This crypto to AED service is designed to help users safely sell crypto in the UAE and convert digital assets into AED without delays, unclear pricing, or unnecessary risk.</p><h4 class="text-zinc-200 font-bold mb-2 pt-2">Reliable Crypto to AED Conversion in Dubai</h4><p>Whether you are converting crypto for personal use or business needs, this service offers a dependable crypto to cash Dubai process with transparent rates, defined timelines, and compliance-first execution.</p>`
    },
    usdt_aed: {
      title: 'USDT to AED',
      content: `<h4 class="text-zinc-200 font-bold mb-2">USDT to AED Conversion in Dubai & UAE</h4><p class="mb-4">USDT to AED conversion is one of the most requested crypto services in the region. USDT is widely used for trading and payments, making fast and reliable AED settlement essential.</p><p class="mb-4">This platform allows users to sell USDT in the UAE, withdraw USDT in Dubai, and convert stablecoins into AED through a structured and transparent process. Clear pricing and predictable execution make this an ideal solution for crypto to AED requirements.</p><h4 class="text-zinc-200 font-bold mb-2 pt-2">Convert USDT to AED with Confidence</h4><p>Whether you earn in USDT or manage stablecoin liquidity, this USDT to AED service ensures smooth conversion with professional handling and UAE-friendly execution.</p>`
    },
    crypto_cashout: {
      title: 'Crypto Cashout UAE',
      content: `<h4 class="text-zinc-200 font-bold mb-2">Crypto Cashout in UAE – Safe & Transparent</h4><p class="mb-4">Finding a reliable crypto cashout UAE solution can be challenging. This service is designed for users who want to sell crypto in the UAE, convert crypto to AED, and withdraw funds without relying on informal or risky channels.</p><p class="mb-4">With verified processes and structured execution, users can confidently withdraw crypto in Dubai while maintaining compliance and transparency.</p><h4 class="text-zinc-200 font-bold mb-2 pt-2">Trusted Crypto Cashout Process</h4><p>From initiating the transaction to final AED settlement, the crypto cashout UAE process is clear, secure, and suitable for long-term use by individuals and businesses.</p>`
    },
    withdraw_crypto: {
      title: 'Withdraw Crypto in Dubai',
      content: `<h4 class="text-zinc-200 font-bold mb-2">Withdraw Crypto in Dubai Easily</h4><p class="mb-4">If you need to withdraw crypto in Dubai, a structured and compliant approach is essential. This service allows users to convert crypto into AED efficiently while supporting safe crypto cashout UAE needs.</p><p class="mb-4">The withdrawal flow is designed to reduce friction and ensure a reliable crypto to cash Dubai experience with clear timelines and professional execution.</p><h4 class="text-zinc-200 font-bold mb-2 pt-2">Simple Crypto Withdrawal for UAE Users</h4><p>Built specifically for Dubai and UAE users, this service provides a dependable method to withdraw crypto without uncertainty or hidden risks.</p>`
    },
    crypto_cash: {
      title: 'Crypto to Cash Dubai',
      content: `<h4 class="text-zinc-200 font-bold mb-2">Crypto to Cash in Dubai – Professional Cashout Solution</h4><p class="mb-4">Converting crypto to cash in Dubai requires trust, execution, and regulatory awareness. This service enables users to convert crypto to AED and complete crypto cashout UAE through clean and transparent workflows.</p><p class="mb-4">Instead of informal methods, users get a reliable solution to withdraw crypto in Dubai and access AED liquidity safely.</p><h4 class="text-zinc-200 font-bold mb-2 pt-2">Secure Crypto to Cash Conversion</h4><p>Each transaction follows a structured process, ensuring funds are protected while delivering timely AED access for personal or business use.</p>`
    },
    sell_crypto: {
      title: 'Sell Crypto UAE',
      content: `<h4 class="text-zinc-200 font-bold mb-2">Sell Crypto in UAE with Transparency</h4><p class="mb-4">Selling crypto in the UAE should be simple and predictable. This sell crypto UAE service allows users to convert supported crypto assets into AED with clear pricing and professional execution.</p><p class="mb-4">Whether you are converting USDT to AED or completing a full crypto cashout UAE, the process is designed to remove uncertainty and provide consistent results.</p><h4 class="text-zinc-200 font-bold mb-2 pt-2">Trusted Way to Sell Crypto in UAE</h4><p>This service supports traders, investors, freelancers, and businesses looking to sell crypto and convert assets into AED through a transparent and reliable system.</p>`
    }
  };

  // Merchant nodes data
  const merchantNodes: MerchantNode[] = [
    { id: 1, name: "DIFC Liquidity Hub", type: "bank", region: "dxb", min: 50000, desc: "Institutional Tier. Bond: $250k.", latency: "12m", bond: "HIGH" },
    { id: 2, name: "Jumeirah Vault", type: "cash", region: "dxb", min: 1000, desc: "Physical Node. Bond: $50k.", latency: "10m", bond: "MED" },
    { id: 3, name: "ADGM Gateway", type: "bank", region: "auh", min: 100000, desc: "Regulated Rails. Bond: $500k.", latency: "15m", bond: "MAX" },
    { id: 4, name: "Marina Point", type: "cash", region: "dxb", min: 500, desc: "Retail Node. Bond: $25k.", latency: "14m", bond: "LOW" },
    { id: 5, name: "DSO Tech Bridge", type: "bank", region: "dxb", min: 5000, desc: "Automated. Bond: $100k.", latency: "25m", bond: "MED" },
    { id: 6, name: "Corniche Desk", type: "cash", region: "auh", min: 25000, desc: "VIP Node. Bond: $150k.", latency: "18m", bond: "HIGH" }
  ];

  // Simulator calculation
  const calculateSimulation = () => {
    let rate = 3.674;
    let target = "AED";

    if (simAsset === 'AED') {
      rate = 0.2721;
      target = "USDT";
    } else if (simAsset === 'USDC') {
      rate = 3.672;
    } else if (simAsset === 'BTC') {
      rate = 242000;
    } else if (simAsset === 'ETH') {
      rate = 9800;
    }

    let spreadPercent = 0.012;
    if (simPriority === 'fastest') spreadPercent = 0.020;

    const gross = simAmount * rate;
    const fee = gross * spreadPercent;
    const net = gross - fee;

    return { net, fee, spreadPercent, target };
  };

  const simResult = calculateSimulation();

  // Filter merchant nodes based on path parameters
  const filteredMerchantNodes = merchantNodes.filter(node => {
    return node.type === pathMethod &&
           node.region === pathRegion &&
           pathAmount >= node.min;
  });

  // Modal handlers
  const openServiceModal = (serviceKey: string) => {
    const data = serviceData[serviceKey];
    if (data) {
      setModalTitle(data.title);
      setModalContent(data.content);
      setDetailModalOpen(true);
    }
  };

  const showDetailModal = (title: string, content: string) => {
    setModalTitle(title);
    setModalContent(content);
    setDetailModalOpen(true);
  };

  const closeDetailModal = () => {
    setDetailModalOpen(false);
  };

  const openTerminal = (context: string) => {
    setTerminalContext(context);
    setTerminalModalOpen(true);

    setTimeout(() => {
      setTerminalModalOpen(false);
    }, 2500);
  };

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    // Schema.org structured data
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "Blip.money",
      "url": "https://blip.money",
      "description": "Decentralized crypto cashout and USDT to AED settlement protocol in the UAE.",
      "areaServed": {
        "@type": "Country",
        "name": "United Arab Emirates"
      },
      "serviceType": [
        "Crypto Cashout UAE",
        "USDT to AED",
        "Sell Crypto Dubai",
        "Crypto to Cash Dubai",
        "Withdraw Crypto UAE"
      ]
    });
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="bg-tech-grid text-zinc-400 min-h-screen selection:bg-white/20 selection:text-white overflow-x-hidden">
      
    
      {/* Hero Section */}
      <main className="relative pt-40 pb-20 px-6">
        <div className="absolute inset-0 bg-vignette pointer-events-none"></div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded border border-zinc-800 bg-zinc-900/30 text-zinc-400 text-[10px] font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
              ACTIVE ROUTING ENGINE
            </div>

            <h1 className="text-5xl md:text-7xl font-semibold tracking-[-0.04em] leading-[1.05] text-metallic">
              On-Demand <br />
              P2P Settlement.
            </h1>

            <div className="space-y-4 max-w-lg">
              <p className="text-lg text-zinc-500 font-light leading-relaxed">
                Broadcast your demand. Bonded merchants compete to fill your order. Experience <span className="text-zinc-200">Non-Custodial Escrow</span> and <span className="text-zinc-200">Reputation-Weighted Routing</span> for instant fiat settlement.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button onClick={() => openTerminal('BROADCASTING SETTLEMENT REQUEST...')} className="bg-orange-600 hover:bg-orange-500 text-black px-6 py-3 rounded font-medium text-sm transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(249,115,22,0.15)]">
                Broadcast Request
              </button>
              <button onClick={() => scrollToSection('mechanics')} className="border border-zinc-800 text-zinc-300 hover:border-zinc-600 hover:text-white px-6 py-3 rounded font-medium text-sm transition-all flex items-center justify-center gap-2">
                How it Works
              </button>
            </div>

            {/* Trust Signals */}
            <div className="pt-12 border-t border-zinc-900 flex flex-wrap gap-8 items-center opacity-40">
              <span className="text-[10px] font-mono text-zinc-700 uppercase tracking-widest block w-full mb-1">Settlement Assurance</span>
              <span className="text-zinc-300 font-bold text-xs tracking-wide flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                BONDED MERCHANTS
              </span>
              <span className="text-zinc-300 font-bold text-xs tracking-wide flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                SMART ESCROW
              </span>
              <span className="text-zinc-300 font-bold text-xs tracking-wide flex items-center gap-2">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                ALGO ROUTING
              </span>
            </div>
          </div>
        </div>
      </main>

      {/* SEO Content Block */}
      <section className="border-b border-white/5 bg-[#030303]">
        <div className="max-w-5xl mx-auto px-6 py-16 text-zinc-500 text-sm leading-relaxed">
          <h2 className="text-xl font-semibold text-zinc-200 mb-4">
            Crypto Cashout & USDT to AED in UAE
          </h2>

          <p>
            Blip.money provides a decentralized way to perform crypto cashout in UAE using
            non-custodial escrow and bonded merchants. Users can convert USDT to AED,
            sell crypto in Dubai, or withdraw crypto directly to bank accounts or physical cash
            locations without relying on centralized exchanges.
          </p>

          <p className="mt-4">
            Unlike traditional crypto off-ramps, Blip.money enables on-demand settlement
            where merchants compete to fulfill your request. This ensures better pricing,
            faster execution, and reduced counterparty risk for crypto to cash Dubai transactions.
          </p>

          <p className="mt-4">
            Supported services include crypto to AED conversion, USDT cashout in Dubai,
            anonymous crypto withdrawals, and institutional-grade OTC settlement across
            Dubai and Abu Dhabi.
          </p>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-24 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-100 mb-2 tracking-tight">Market Simulation</h2>
              <p className="text-zinc-600 text-sm font-mono">ESTIMATE BIDDING SPREADS & LIQUIDITY</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Rate Estimator */}
            <div className="glass-panel p-6 rounded lg:col-span-2">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <div className="w-1.5 h-1.5 bg-zinc-500 rounded-sm"></div>
                <h3 className="font-mono text-xs text-zinc-300 uppercase tracking-widest">Rate Estimator</h3>
              </div>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-widest">Asset</label>
                    <select
                      value={simAsset}
                      onChange={(e) => setSimAsset(e.target.value)}
                      className="tool-input"
                    >
                      <option value="USDT">USDT (ERC20)</option>
                      <option value="USDC">USDC (ERC20)</option>
                      <option value="BTC">BTC (Native)</option>
                      <option value="ETH">ETH (Native)</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-widest">Routing Strategy</label>
                    <div className="grid grid-cols-2 gap-2">
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="sim-priority"
                          value="cheapest"
                          checked={simPriority === 'cheapest'}
                          onChange={() => setSimPriority('cheapest')}
                          className="peer sr-only"
                        />
                        <div className="border border-zinc-800 rounded p-2 hover:bg-zinc-900 transition-all peer-checked:border-zinc-500 peer-checked:bg-zinc-900">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-zinc-300">Cheapest</span>
                            <span className="text-[10px] font-mono text-zinc-600">~1.2% Spread</span>
                          </div>
                          <div className="text-[9px] font-mono text-zinc-500">Wait for competitive fill</div>
                        </div>
                      </label>
                      <label className="cursor-pointer">
                        <input
                          type="radio"
                          name="sim-priority"
                          value="fastest"
                          checked={simPriority === 'fastest'}
                          onChange={() => setSimPriority('fastest')}
                          className="peer sr-only"
                        />
                        <div className="border border-zinc-800 rounded p-2 hover:bg-zinc-900 transition-all peer-checked:border-zinc-500 peer-checked:bg-zinc-900">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-xs font-medium text-zinc-300">Fastest</span>
                            <span className="text-[10px] font-mono text-zinc-600">~2.0% Spread</span>
                          </div>
                          <div className="text-[9px] font-mono text-zinc-500">Immediate acceptance</div>
                        </div>
                      </label>
                    </div>
                  </div>

                  <div className="col-span-full">
                    <label className="block text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-widest">Volume</label>
                    <div className="flex items-center gap-4 border-b border-zinc-800 pb-2">
                      <input
                        type="number"
                        value={simAmount}
                        onChange={(e) => setSimAmount(parseFloat(e.target.value) || 0)}
                        className="bg-transparent text-zinc-200 font-mono text-xl w-full outline-none"
                      />
                      <span className="text-xs font-mono text-zinc-500">{simAsset}</span>
                    </div>
                    <div className="pt-4">
                      <input
                        type="range"
                        min="100"
                        max="1000000"
                        step="100"
                        value={simAmount}
                        onChange={(e) => setSimAmount(parseFloat(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-zinc-900/30 p-4 rounded border border-zinc-800/50 flex justify-between items-end">
                  <div>
                    <span className="text-[10px] font-mono text-zinc-600 block mb-1">
                      EST. MERCHANT SPREAD (~{(simResult.spreadPercent * 100).toFixed(1)}%)
                    </span>
                    <span className="text-sm text-zinc-400 font-mono">
                      {simResult.fee.toLocaleString('en-US', { minimumFractionDigits: 2 })} {simResult.target}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-zinc-600 block mb-1">EST. NET ({simResult.target})</span>
                    <span className="text-2xl font-bold text-zinc-100 tracking-tight">
                      {simResult.net.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Network Status */}
            <div className="glass-panel p-6 rounded">
              <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full animate-pulse"></div>
                <h3 className="font-mono text-xs text-zinc-300 uppercase tracking-widest">Active Corridors</h3>
              </div>
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs text-zinc-400">Dubai (DXB)</span>
                  <span className="text-[10px] font-mono text-orange-500 border border-orange-500/20 bg-orange-900/10 px-1.5 py-0.5 rounded">HIGH_LIQUIDITY</span>
                </div>
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <span className="text-xs text-zinc-400">Abu Dhabi (AUH)</span>
                  <span className="text-[10px] font-mono text-zinc-500">MODERATE</span>
                </div>
                <div className="pt-2">
                  <div className="flex justify-between text-[10px] font-mono text-zinc-500 mb-2">
                    <span>TOTAL_BONDED_VALUE</span>
                    <span className="text-zinc-300">$4.2M</span>
                  </div>
                  <div className="h-0.5 bg-zinc-800 w-full">
                    <div className="h-full bg-zinc-400 w-[75%]"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Path Finder */}
            <div className="glass-panel p-8 rounded lg:col-span-3">
              <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-6">
                <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <div>
                  <h3 className="text-sm font-medium text-zinc-200">Liquidity Discovery</h3>
                  <p className="text-[10px] text-zinc-600 font-mono mt-1">BROADCAST DEMAND TO MATCH WITH MERCHANT NODES</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
                <div>
                  <label className="block text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-widest">Input Asset</label>
                  <select
                    value={pathAsset}
                    onChange={(e) => setPathAsset(e.target.value)}
                    className="tool-input"
                  >
                    <option value="USDT">USDT</option>
                    <option value="USDC">USDC</option>
                    <option value="BTC">BTC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-widest">Payout Method</label>
                  <select
                    value={pathMethod}
                    onChange={(e) => setPathMethod(e.target.value as 'bank' | 'cash')}
                    className="tool-input"
                  >
                    <option value="bank">Bank Transfer</option>
                    <option value="cash">Physical Vault</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-widest">Region</label>
                  <select
                    value={pathRegion}
                    onChange={(e) => setPathRegion(e.target.value as 'dxb' | 'auh')}
                    className="tool-input"
                  >
                    <option value="dxb">Dubai (Main)</option>
                    <option value="auh">Abu Dhabi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-widest">Volume</label>
                  <div className="pt-2">
                    <input
                      type="range"
                      min="1000"
                      max="1000000"
                      step="5000"
                      value={pathAmount}
                      onChange={(e) => setPathAmount(parseInt(e.target.value))}
                      className="w-full"
                    />
                    <div className="text-right text-[10px] text-zinc-400 font-mono mt-1">
                      {pathAmount.toLocaleString('en-US')} AED
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredMerchantNodes.length === 0 ? (
                  <div className="col-span-full py-8 text-center text-zinc-700 font-mono text-xs">
                    NO ACTIVE MERCHANTS FOR THESE PARAMETERS
                  </div>
                ) : (
                  filteredMerchantNodes.map((node) => (
                    <div key={node.id} className="border border-zinc-800 bg-zinc-900/20 p-4 rounded hover:border-zinc-600 transition-all cursor-default group">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider">{node.type}</span>
                        <span className="text-[9px] font-mono text-zinc-400 border border-zinc-800 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div> BOND: {node.bond}
                        </span>
                      </div>
                      <h4 className="text-zinc-200 font-medium text-sm mb-1 group-hover:text-white">{node.name}</h4>
                      <p className="text-[10px] text-zinc-600 mb-3">{node.desc}</p>
                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                        <span className="text-[9px] text-zinc-600 font-mono">MIN: {node.min.toLocaleString()}</span>
                        <button
                          onClick={() => openTerminal(`Connecting to ${node.name}...`)}
                          className="text-[9px] font-medium text-orange-600 hover:text-orange-500"
                        >
                          REQUEST -&gt;
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Merchant Assurance Levels */}
      <section className="py-24 px-6 border-t border-white/5 bg-[#030303]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold text-zinc-200 mb-2 tracking-tight">Merchant Assurance Protocol</h2>
            <p className="text-zinc-600 text-sm font-mono uppercase tracking-widest">Reputation-Weighted Routing (Section 11)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 3 */}
            <div className="glass-panel p-6 rounded border-l-2 border-zinc-700">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono text-zinc-500 uppercase">Tier 3</span>
                <div className="icon-box bg-zinc-800/50 mb-0">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-zinc-300 mb-2">Standard Node</h3>
              <p className="text-xs text-zinc-500 mb-4 h-10">Entry-level merchants for retail volume.</p>
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <div className="flex justify-between text-xs"><span className="text-zinc-600">Min Bond</span> <span className="text-zinc-400">$10,000</span></div>
                <div className="flex justify-between text-xs"><span className="text-zinc-600">Max Tx</span> <span className="text-zinc-400">$5,000</span></div>
              </div>
            </div>

            {/* Tier 2 */}
            <div className="glass-panel p-6 rounded border-l-2 border-orange-500/50 relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono text-orange-400 uppercase">Tier 2</span>
                <div className="icon-box bg-orange-900/30 mb-0">
                  <svg className="w-4 h-4 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Verified Merchant</h3>
              <p className="text-xs text-zinc-500 mb-4 h-10">High-volume nodes with automated settlement hooks.</p>
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <div className="flex justify-between text-xs"><span className="text-zinc-600">Min Bond</span> <span className="text-zinc-300">$50,000</span></div>
                <div className="flex justify-between text-xs"><span className="text-zinc-600">Max Tx</span> <span className="text-zinc-300">$100,000</span></div>
              </div>
            </div>

            {/* Tier 1 */}
            <div className="glass-panel p-6 rounded border-l-2 border-orange-500 bg-gradient-to-br from-zinc-900 to-black relative overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-mono text-orange-500 uppercase font-bold">Tier 1 • Institutional</span>
                <div className="icon-box bg-orange-600/20 mb-0 border border-orange-500/30">
                  <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Liquidity Partner</h3>
              <p className="text-xs text-zinc-400 mb-4 h-10">Fully bonded institutions with direct banking APIs.</p>
              <div className="space-y-2 border-t border-zinc-800 pt-4">
                <div className="flex justify-between text-xs"><span className="text-zinc-500">Min Bond</span> <span className="text-white font-mono">$250,000+</span></div>
                <div className="flex justify-between text-xs"><span className="text-zinc-500">Max Tx</span> <span className="text-white font-mono">Unlimited</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Protocol Mechanics */}
      <section id="mechanics" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-semibold text-zinc-200 mb-2 tracking-tight">Protocol Mechanics</h2>
            <p className="text-zinc-600 text-sm font-mono uppercase tracking-widest">From Demand Broadcast to Finality</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="glass-panel p-6 rounded relative group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-mono text-xs border border-zinc-700">01</div>
              <h3 className="text-sm font-bold text-zinc-200 mb-2">Demand Broadcast</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">User broadcasts a settlement request (Asset, Volume, Max Time) to the network. No static listings.</p>
            </div>
            <div className="glass-panel p-6 rounded relative group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-mono text-xs border border-zinc-700">02</div>
              <h3 className="text-sm font-bold text-zinc-200 mb-2">Merchant Bidding</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Bonded merchants analyze the request and submit bids. Routing engine selects best execution.</p>
            </div>
            <div className="glass-panel p-6 rounded relative group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-mono text-xs border border-zinc-700">03</div>
              <h3 className="text-sm font-bold text-zinc-200 mb-2">Non-Custodial Escrow</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">User funds are locked in a smart contract. Merchant sends fiat off-chain.</p>
            </div>
            <div className="glass-panel p-6 rounded relative group">
              <div className="absolute -top-3 -left-3 w-8 h-8 bg-zinc-800 rounded-full flex items-center justify-center text-zinc-400 font-mono text-xs border border-zinc-700">04</div>
              <h3 className="text-sm font-bold text-zinc-200 mb-2">Proof & Release</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">Oracle validates payment proof. Contract releases crypto to merchant. Reputation score updates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section id="services" className="py-24 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <h4 className="text-xs font-mono text-zinc-600 uppercase tracking-widest mb-8">Core Settlement Services</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { key: 'crypto_aed', title: 'Crypto to AED', desc: 'Convert your crypto directly to AED through our decentralized settlement network.', color: 'blue' },
              { key: 'usdt_aed', title: 'USDT to AED', desc: 'Easily exchange USDT to AED securely and instantly.', color: 'green' },
              { key: 'crypto_cashout', title: 'Crypto Cashout UAE', desc: 'Cash out your crypto in the UAE without custodial risk.', color: 'purple' },
              { key: 'withdraw_crypto', title: 'Withdraw Crypto in Dubai', desc: 'Withdraw crypto in Dubai safely and privately.', color: 'orange' },
              { key: 'crypto_cash', title: 'Crypto to Cash Dubai', desc: 'Turn your crypto into cash in Dubai fast.', color: 'pink' },
              { key: 'sell_crypto', title: 'Sell Crypto UAE', desc: 'Sell your crypto in the UAE with ease.', color: 'cyan' }
            ].map((service) => (
              <div key={service.key} className="glass-panel p-6 rounded card-hover cursor-pointer group flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className={`icon-box bg-${service.color}-900/20 text-${service.color}-400`}>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-base font-bold text-zinc-200 mb-3">{service.title}</h3>
                <p className="text-sm text-zinc-500 leading-relaxed mb-6 flex-grow">{service.desc}</p>
                <button
                  onClick={() => openServiceModal(service.key)}
                  className={`w-full py-2 rounded border border-zinc-800 bg-zinc-900/50 text-xs font-medium text-zinc-400 group-hover:border-${service.color}-500/50 group-hover:text-${service.color}-400 transition-all`}
                >
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases & Ecosystem */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-xl font-semibold text-zinc-200 mb-6 tracking-tight">Ecosystem Integration</h2>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">
              Blip acts as the invisible settlement layer for the global economy. Wallets, Fintechs, and DAOs can bridge directly into our merchant network via API.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-300">Wallets</div>
                  <div className="text-[10px] text-zinc-600">Native "Cash Out" Button</div>
                </div>
              </div>
              <div className="bg-zinc-900/30 border border-zinc-800 p-4 rounded flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-zinc-800 flex items-center justify-center">
                  <svg className="w-4 h-4 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="text-sm font-medium text-zinc-300">Fintechs</div>
                  <div className="text-[10px] text-zinc-600">Crypto-to-Fiat Rails</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-zinc-200 mb-6 tracking-tight">Who is Blip For?</h2>
            <div className="space-y-4">
              {[
                { title: 'Freelancers & Remote Workers', desc: 'Get paid in crypto, spend in local AED instantly without exchange delays.' },
                { title: 'Institutions & Treasuries', desc: 'Off-ramp corporate treasury with high liquidity and compliant invoicing.' },
                { title: 'OTC Desks', desc: 'Source liquidity on-demand from a network of bonded counterparties.' }
              ].map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="mt-1">
                    <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-zinc-300">{item.title}</h4>
                    <p className="text-xs text-zinc-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section id="compare" className="py-24 px-6 border-t border-white/5 bg-[#050505]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-semibold text-zinc-200 mb-2 tracking-tight">Market Structure Comparison</h2>
            <p className="text-zinc-600 text-sm font-mono uppercase tracking-widest">Protocol Architecture vs Legacy Models</p>
          </div>

          <div className="border border-zinc-800 rounded-lg overflow-hidden">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/50 text-zinc-500 font-mono text-[10px] uppercase tracking-widest">
                <tr>
                  <th className="px-8 py-4 font-medium">Core Metric</th>
                  <th className="px-8 py-4 font-medium">Standard P2P Listing</th>
                  <th className="px-8 py-4 font-medium text-orange-500">Blip On-Demand Protocol</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50 bg-[#050505]">
                {[
                  ['Discovery Model', 'Static Listings (Passive)', 'Active Demand Broadcasting'],
                  ['Merchant Availability', 'Unknown / Offline Risk', 'Live Routing (Online Only)'],
                  ['Pricing Efficiency', 'Static / Wide Spreads', 'Real-Time Competitive Bidding'],
                  ['Trust Mechanism', 'Manual Dispute Resolution', 'Programmatic Bonding & Slashing']
                ].map((row, i) => (
                  <tr key={i}>
                    <td className="px-8 py-4 text-zinc-400">{row[0]}</td>
                    <td className="px-8 py-4 text-zinc-600">{row[1]}</td>
                    <td className="px-8 py-4 text-zinc-300">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-2xl font-semibold text-zinc-200 mb-2 tracking-tight">Protocol FAQ</h2>
            <p className="text-zinc-600 text-sm font-mono uppercase tracking-widest">Technical & Operational Details</p>
          </div>

          <div className="space-y-4">
            {[
              { q: 'Is crypto cashout legal in UAE?', a: 'Crypto cashout in UAE is permitted through compliant merchant networks. Blip.money operates as a decentralized coordination layer while individual merchants handle fiat settlement according to local regulations.' },
              { q: 'How can I convert USDT to AED in Dubai?', a: 'You can convert USDT to AED by broadcasting a settlement request on Blip.money. Bonded merchants submit bids and execute the transfer via bank or cash payout.' },
              { q: 'How does "On-Demand" routing work?', a: 'Unlike legacy P2P platforms with static order books, Blip broadcasts your settlement request to active nodes. Merchants analyze your parameters (Volume, Asset, Payout) and submit competitive bids in real-time. This ensures current pricing and guaranteed availability.' },
              { q: 'Is the escrow custodial?', a: 'No. Blip utilizes smart-contract-enforced non-custodial escrow. Your funds are locked on-chain and only released when the oracle validates the fiat settlement or the merchant provides cryptographic proof.' },
              { q: 'What is a "Bonded Merchant"?', a: 'To receive requests, merchants must stake a financial bond. If a merchant accepts a request but fails to settle within the agreed window, a portion of their bond is slashed to compensate the user. This aligns incentives for speed and reliability.' },
              { q: 'Which chains are supported?', a: 'Blip is architecturally chain-agnostic. We currently support high-velocity settlement on Ethereum, Solana, and Polygon for USDT and USDC, bridging directly to UAE banking rails.' },
              { q: 'Do I need to perform KYC?', a: 'The protocol itself is neutral and permissionless. However, individual merchant nodes may require KYC data (Source of Funds, ID) depending on their local jurisdiction and the specific payout method selected (e.g., Bank Wire requires beneficiary details).' },
              { q: 'What are the settlement times?', a: 'Settlement depends on the chosen rail. Cash Vaults can be instant (physical proximity). Domestic Bank Transfers (UAE) typically settle within T+0 (Same Day) during banking hours or T+1 otherwise.' }
            ].map((faq, i) => (
              <div key={i} className="border border-zinc-800 bg-zinc-900/20 rounded-lg overflow-hidden">
                <button
                  className="w-full flex justify-between items-center p-5 text-left bg-zinc-900/40 hover:bg-zinc-800/60 transition-colors"
                  onClick={() => toggleFaq(i)}
                >
                  <span className="font-medium text-zinc-200 text-sm">{faq.q}</span>
                  <svg
                    className={`w-4 h-4 text-zinc-500 transition-transform duration-300 ${faqOpen[i] ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div
                  className="faq-content bg-zinc-950/50"
                  style={{ maxHeight: faqOpen[i] ? '1000px' : '0' }}
                >
                  <div className="p-5 text-xs text-zinc-400 leading-relaxed border-t border-zinc-800/50">
                    {faq.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-semibold text-zinc-200 mb-6 tracking-tight">Ready to Broadcast?</h2>
          <p className="text-zinc-500 mb-8 max-w-lg mx-auto leading-relaxed">Join the network where liquidity is routed, not listed. Institutional settlement for the decentralized economy.</p>
          <button
            onClick={() => openTerminal('Initializing Protocol...')}
            className="bg-zinc-100 hover:bg-white text-black px-10 py-3 rounded font-bold tracking-tight transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          >
            Launch Protocol Terminal
          </button>
        </div>
      </section>

      

      {/* Detail Modal */}
      {detailModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded w-full max-w-lg shadow-2xl modal-animate relative">
            <button onClick={closeDetailModal} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
              <h3 className="text-lg font-bold text-zinc-200">{modalTitle}</h3>
            </div>
            <div
              className="text-sm text-zinc-400 leading-relaxed font-light"
              dangerouslySetInnerHTML={{ __html: modalContent }}
            />
            <div className="mt-8 pt-6 border-t border-zinc-900 flex justify-end">
              <button onClick={closeDetailModal} className="text-xs font-mono text-zinc-500 hover:text-white uppercase tracking-widest">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Terminal Modal */}
      {terminalModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-[#0a0a0a] border border-zinc-800 p-8 rounded w-full max-w-md shadow-2xl modal-animate font-mono">
            <div className="flex items-center gap-3 mb-6 border-b border-zinc-900 pb-4">
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></div>
              <span className="text-xs text-zinc-300 tracking-widest uppercase">Protocol Handshake</span>
            </div>
            <div className="space-y-2 text-xs text-zinc-500 mb-6">
              <p>&gt; <span>{terminalContext}</span></p>
              <p>&gt; Verifying device integrity...</p>
              <p>&gt; Fetching active merchant bonds...</p>
            </div>
            <div className="h-0.5 w-full bg-zinc-900 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-orange-600 w-full transition-all duration-[2000ms] ease-out"></div>
            </div>
            <div className="text-[10px] text-zinc-300 text-right">ESTABLISHED</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CryptoToUae;
