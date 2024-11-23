import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, TrendingUp, Save } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const GaugeChart = ({ value, label }) => {
  const getColor = (val) => {
    if (val <= 30) return '#0ECB81'; // Binance 绿色
    if (val <= 70) return '#FCD535'; // Binance 亮黄色
    return '#F6465D'; // Binance 红色
  };

  const getRiskLevel = (val) => {
    if (val <= 30) return '低风险';
    if (val <= 70) return '中风险';
    return '高风险';
  };

  const color = getColor(value);
  const riskLevel = getRiskLevel(value);
  
  // 计算SVG路径的角度
  const radius = 80;
  const strokeWidth = 8;
  const normalizedValue = Math.min(100, Math.max(0, value));
  const angle = (normalizedValue / 100) * 180;
  const angleInRadians = (angle - 180) * (Math.PI / 180);
  
  // 计算圆弧的终点
  const endX = radius * Math.cos(angleInRadians);
  const endY = radius * Math.sin(angleInRadians);
  
  // 构建SVG路径
  const path = `M-${radius},0 A${radius},${radius} 0 0,1 ${endX},${endY}`;

  return (
    <div className="relative w-full max-w-xs mx-auto group">
      <div className="relative flex flex-col items-center">
        <div className="relative w-48 h-24">
          {/* 背景圆弧 */}
          <svg
            viewBox="-100 -100 200 100"
            className="w-full h-full"
          >
            {/* 刻度线 */}
            {Array.from({ length: 11 }).map((_, i) => {
              const tickAngle = -180 + i * 18;
              const isMainTick = i % 2 === 0;
              const tickLength = isMainTick ? 15 : 10;
              const tickWidth = isMainTick ? 2 : 1;
              const rad = tickAngle * Math.PI / 180;
              const innerRadius = radius - tickLength;
              
              return (
                <g key={i} className="text-[#474D57]">
                  <line
                    x1={radius * Math.cos(rad)}
                    y1={radius * Math.sin(rad)}
                    x2={(radius - tickLength) * Math.cos(rad)}
                    y2={(radius - tickLength) * Math.sin(rad)}
                    stroke="currentColor"
                    strokeWidth={tickWidth}
                  />
                  {isMainTick && (
                    <text
                      x={(innerRadius - 10) * Math.cos(rad)}
                      y={(innerRadius - 10) * Math.sin(rad)}
                      fontSize="8"
                      fill="currentColor"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {i * 20}
                    </text>
                  )}
                </g>
              );
            })}
            
            {/* 背景圆弧 */}
            <path
              d={`M-${radius},0 A${radius},${radius} 0 0,1 ${radius},0`}
              fill="none"
              stroke="#2B3139"
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            
            {/* 值圆弧 */}
            <path
              d={path}
              fill="none"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
            />
            
            {/* 中心点 */}
            <circle cx="0" cy="0" r="4" fill={color} />
          </svg>
        
          {/* 数值显示 */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-3xl font-bold text-[#EAECEF]">
              {value}
            </div>
            <div className="text-sm font-medium" style={{ color }}>
              {riskLevel}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <h3 className="text-xl font-semibold text-[#EAECEF]">{label}</h3>
        </div>
      </div>
    </div>
  );
};

const SinglePage = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('success');
  const [riskData, setRiskData] = useState([
    { id: 'TOTAL2', label: 'TOTAL2', value: 30 },
    { id: 'TOTAL3', label: 'TOTAL3', value: 30 },
    { id: 'OTHERS', label: 'OTHERS', value: 30 },
  ]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'admin') {
      setIsAdmin(true);
    }
  }, []);

  const handleValueChange = (id, newValue) => {
    const value = Math.min(100, Math.max(0, parseInt(newValue) || 0));
    setRiskData(riskData.map(item => 
      item.id === id ? { ...item, value } : item
    ));
  };

  const handleSave = () => {
    setAlertMessage('数据已成功更新！');
    setAlertType('success');
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#0B0E11]">
      {/* 导航栏 */}
      <nav className="bg-[#0B0E11] border-b border-[#282A2E] sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Activity className="h-6 w-6 text-[#FCD535]" />
              <span className="text-xl font-bold text-[#FCD535]">
                ALTSCOINRISK
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* 提示消息 */}
      {showAlert && (
        <div className="fixed top-4 right-4 z-50">
          <Alert className="bg-[#1E2329] border border-[#282A2E]">
            <AlertDescription className="text-[#EAECEF]">
              {alertMessage}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* 主要内容 */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* 标题部分 */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold text-[#EAECEF] mb-4">
            加密货币各项市值风险指数
          </h1>
          <p className="text-lg text-[#848E9C]">
            实时监控不同市值分类的风险指标（0-100）
          </p>
        </div>

        {/* 风险指数说明 */}
        <div className="bg-[#1E2329] rounded-lg border border-[#282A2E] p-6 mb-8">
          <div className="flex items-center space-x-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-[#F0B90B]" />
            <h2 className="text-xl font-semibold text-[#EAECEF]">风险指数说明</h2>
          </div>
          <div className="space-y-2 text-[#848E9C]">
            <p>• 0-30: 低风险区间（绿色）- 市场相对稳定</p>
            <p>• 31-70: 中等风险区间（黄色）- 需要保持警惕</p>
            <p>• 71-100: 高风险区间（红色）- 市场波动剧烈</p>
          </div>
        </div>

        {/* 仪表盘网格 */}
        <div className="grid md:grid-cols-3 gap-8">
          {riskData.map((item) => (
            <div key={item.id} className="bg-[#1E2329] rounded-lg border border-[#282A2E] p-6 group hover:border-[#F0B90B]/20 transition-all duration-300">
              <GaugeChart value={item.value} label={item.label} />
              {isAdmin && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-[#848E9C] mb-1">
                    更新风险值
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={item.value}
                    onChange={(e) => handleValueChange(item.id, e.target.value)}
                    className="w-full px-3 py-2 bg-[#0B0E11] border border-[#282A2E] rounded-md text-[#EAECEF] focus:ring-2 focus:ring-[#F0B90B]/20 focus:border-transparent"
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* 管理员保存按钮 */}
        {isAdmin && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={handleSave}
              className="flex items-center space-x-2 bg-[#FCD535] hover:bg-[#FCD535]/90 text-[#0B0E11] px-6 py-3 rounded-lg transition-all duration-300"
            >
              <Save className="h-5 w-5" />
              <span>保存更改</span>
            </button>
          </div>
        )}

        {/* 市场趋势分析 */}
        <div className="mt-12 bg-[#1E2329] rounded-lg border border-[#282A2E] p-6">
          <div className="flex items-center space-x-2 mb-4">
            <TrendingUp className="h-5 w-5 text-[#F0B90B]" />
            <h2 className="text-xl font-semibold text-[#EAECEF]">市值分类说明</h2>
          </div>
          <div className="space-y-4 text-[#848E9C]">
            <div>
              <h3 className="font-semibold text-[#EAECEF]">TOTAL2</h3>
              <p>代表除比特币外的所有加密货币总市值</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#EAECEF]">TOTAL3</h3>
              <p>代表除比特币和以太坊外的所有加密货币总市值</p>
            </div>
            <div>
              <h3 className="font-semibold text-[#EAECEF]">OTHERS</h3>
              <p>排除市值前十的加密货币之外的山寨币总市值</p>
            </div>
          </div>
        </div>
      </main>

      {/* 页脚 */}
      <footer className="bg-[#0B0E11] border-t border-[#282A2E] py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-[#848E9C]">
            &copy; 2024 ALTSCOINRISK. 数据仅供参考，不构成投资建议。
          </p>
        </div>
      </footer>
    </div>
  );
};

export default SinglePage;