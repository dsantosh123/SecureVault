'use client';

import React, { useState, useEffect } from 'react';
import { Settings, Save, RotateCcw, Shield, Clock, FileText, DollarSign, Users, Lock, AlertCircle, CheckCircle, XCircle, Info, TrendingUp, Zap, Award, Crown, HelpCircle, Eye, EyeOff, Activity } from 'lucide-react';

// Types
interface PlanLimits {
  maxAssets: number | string;
  maxFileSize: number;
  maxNominees: number;
  price?: number;
}

interface SystemSettings {
  plans: {
    FREE: PlanLimits;
    PLUS: PlanLimits;
    PREMIUM: PlanLimits;
  };
  inactivityRules: {
    availablePeriods: number[];
    defaultPeriod: number;
    minimumPeriod: number;
  };
  verificationSettings: {
    autoRejectAfterDays: number;
    documentExpiryDays: number;
    maxReuploadAttempts: number;
  };
  securitySettings: {
    adminSessionTimeoutHours: number;
    maxLoginAttempts: number;
    twoFactorRequired: boolean;
  };
}

interface Tooltip {
  show: boolean;
  content: string;
  x: number;
  y: number;
}

const SettingsPage = () => {
  const [settings, setSettings] = useState<SystemSettings>({
    plans: {
      FREE: { maxAssets: 5, maxFileSize: 10, maxNominees: 2, price: 0 },
      PLUS: { maxAssets: 20, maxFileSize: 50, maxNominees: 5, price: 299 },
      PREMIUM: { maxAssets: 'Unlimited', maxFileSize: 500, maxNominees: 10, price: 499 }
    },
    inactivityRules: {
      availablePeriods: [30, 90, 180, 365],
      defaultPeriod: 180,
      minimumPeriod: 30
    },
    verificationSettings: {
      autoRejectAfterDays: 30,
      documentExpiryDays: 90,
      maxReuploadAttempts: 3
    },
    securitySettings: {
      adminSessionTimeoutHours: 8,
      maxLoginAttempts: 5,
      twoFactorRequired: true
    }
  });

  const [originalSettings, setOriginalSettings] = useState<SystemSettings>(settings);
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [activeSection, setActiveSection] = useState('plans');
  const [showPreview, setShowPreview] = useState(true);
  const [tooltip, setTooltip] = useState<Tooltip>({ show: false, content: '', x: 0, y: 0 });

  useEffect(() => {
    setOriginalSettings(settings);
  }, []);

  useEffect(() => {
    setHasChanges(JSON.stringify(settings) !== JSON.stringify(originalSettings));
  }, [settings, originalSettings]);

  const handleSave = async () => {
    setSaving(true);
    setSaveError('');
    setSaveSuccess(false);

    try {
      if (settings.inactivityRules.defaultPeriod < settings.inactivityRules.minimumPeriod) {
        throw new Error('Default period cannot be less than minimum period');
      }

      if (!settings.inactivityRules.availablePeriods.includes(settings.inactivityRules.defaultPeriod)) {
        throw new Error('Default period must be one of the available periods');
      }

      await new Promise(resolve => setTimeout(resolve, 1500));

      setOriginalSettings(settings);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setSettings(originalSettings);
    setSaveError('');
    setSaveSuccess(false);
  };

  const updatePlanLimit = (plan: 'FREE' | 'PLUS' | 'PREMIUM', field: keyof PlanLimits, value: number | string) => {
    setSettings({
      ...settings,
      plans: {
        ...settings.plans,
        [plan]: {
          ...settings.plans[plan],
          [field]: value
        }
      }
    });
  };

  const showTooltip = (content: string, e: React.MouseEvent) => {
    setTooltip({
      show: true,
      content,
      x: e.clientX,
      y: e.clientY
    });
  };

  const hideTooltip = () => {
    setTooltip({ show: false, content: '', x: 0, y: 0 });
  };

  const sections = [
    { id: 'plans', name: 'Plan Management', icon: TrendingUp, color: 'blue' },
    { id: 'inactivity', name: 'Inactivity Rules', icon: Clock, color: 'purple' },
    { id: 'verification', name: 'Verification', icon: FileText, color: 'green' },
    { id: 'security', name: 'Security', icon: Shield, color: 'red' }
  ];

  const getPlanIcon = (plan: string) => {
    switch(plan) {
      case 'FREE': return Users;
      case 'PLUS': return Zap;
      case 'PREMIUM': return Crown;
      default: return Award;
    }
  };

  const getPlanGradient = (plan: string) => {
    switch(plan) {
      case 'FREE': return 'from-gray-400 to-gray-600';
      case 'PLUS': return 'from-blue-400 to-blue-600';
      case 'PREMIUM': return 'from-purple-400 to-purple-600';
      default: return 'from-gray-400 to-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Animation */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg">
                <Settings className="w-8 h-8 text-white animate-spin-slow" style={{ animationDuration: '3s' }} />
              </div>
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  System Settings
                </h1>
                <p className="text-gray-600 mt-1">Configure global policies and limits with real-time preview</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
              >
                {showPreview ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showPreview ? 'Hide' : 'Show'} Preview
              </button>
              {hasChanges && (
                <button
                  onClick={handleReset}
                  disabled={saving}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </button>
              )}
              <button
                onClick={handleSave}
                disabled={!hasChanges || saving}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105"
              >
                <Save className="w-4 h-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>

          {/* Status Messages */}
          {saveSuccess && (
            <div className="mb-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3 shadow-sm animate-fade-in">
              <CheckCircle className="w-6 h-6 text-green-600 animate-bounce" />
              <div>
                <p className="text-green-800 font-semibold">Settings saved successfully!</p>
                <p className="text-green-600 text-sm">All changes are now active and logged in audit trail</p>
              </div>
            </div>
          )}

          {saveError && (
            <div className="mb-4 bg-gradient-to-r from-red-50 to-rose-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <XCircle className="w-6 h-6 text-red-600" />
              <div>
                <p className="text-red-800 font-semibold">Error saving settings</p>
                <p className="text-red-600 text-sm">{saveError}</p>
              </div>
            </div>
          )}

          {hasChanges && !saveSuccess && (
            <div className="mb-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 flex items-center gap-3 shadow-sm">
              <AlertCircle className="w-6 h-6 text-amber-600 animate-pulse" />
              <div>
                <p className="text-amber-800 font-semibold">You have unsaved changes</p>
                <p className="text-amber-600 text-sm">Don't forget to save your modifications</p>
              </div>
            </div>
          )}
        </div>

        {/* Section Navigation */}
        <div className="mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex gap-2">
          {sections.map(section => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                  isActive
                    ? `bg-gradient-to-r from-${section.color}-500 to-${section.color}-600 text-white shadow-md transform scale-105`
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{section.name}</span>
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Plan Management */}
            {activeSection === 'plans' && (
              <div className="space-y-4">
                {(['FREE', 'PLUS', 'PREMIUM'] as const).map(planType => {
                  const plan = settings.plans[planType];
                  const Icon = getPlanIcon(planType);
                  const gradient = getPlanGradient(planType);

                  return (
                    <div key={planType} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden transform transition-all hover:shadow-xl">
                      {/* Plan Header */}
                      <div className={`bg-gradient-to-r ${gradient} p-6 text-white`}>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-lg">
                              <Icon className="w-6 h-6" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold">{planType} Plan</h3>
                              <p className="text-white/80 text-sm">
                                {planType === 'FREE' && 'Perfect for getting started'}
                                {planType === 'PLUS' && 'Most popular choice'}
                                {planType === 'PREMIUM' && 'Ultimate protection'}
                              </p>
                            </div>
                          </div>
                          {plan.price !== undefined && (
                            <div className="text-right">
                              <p className="text-3xl font-bold">₹{plan.price}</p>
                              <p className="text-white/80 text-sm">/month</p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Plan Settings */}
                      <div className="p-6">
                        <div className="grid grid-cols-3 gap-4">
                          {/* Max Assets */}
                          <div className="relative group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                              Max Assets
                              <HelpCircle
                                className="w-4 h-4 text-gray-400 cursor-help"
                                onMouseEnter={(e) => showTooltip('Maximum number of assets a user can store', e)}
                                onMouseLeave={hideTooltip}
                              />
                            </label>
                            <input
                              type={planType === 'PREMIUM' ? 'text' : 'number'}
                              value={plan.maxAssets}
                              onChange={(e) => updatePlanLimit(planType, 'maxAssets', planType === 'PREMIUM' ? e.target.value : parseInt(e.target.value))}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-semibold"
                              placeholder={planType === 'PREMIUM' ? 'Unlimited' : ''}
                              min="1"
                            />
                          </div>

                          {/* Max File Size */}
                          <div className="relative group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                              Max File Size
                              <HelpCircle
                                className="w-4 h-4 text-gray-400 cursor-help"
                                onMouseEnter={(e) => showTooltip('Maximum file size per asset in MB', e)}
                                onMouseLeave={hideTooltip}
                              />
                            </label>
                            <div className="relative">
                              <input
                                type="number"
                                value={plan.maxFileSize}
                                onChange={(e) => updatePlanLimit(planType, 'maxFileSize', parseInt(e.target.value))}
                                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-semibold"
                                min="1"
                              />
                              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">MB</span>
                            </div>
                          </div>

                          {/* Max Nominees */}
                          <div className="relative group">
                            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                              Max Nominees
                              <HelpCircle
                                className="w-4 h-4 text-gray-400 cursor-help"
                                onMouseEnter={(e) => showTooltip('Maximum number of nominees per user', e)}
                                onMouseLeave={hideTooltip}
                              />
                            </label>
                            <input
                              type="number"
                              value={plan.maxNominees}
                              onChange={(e) => updatePlanLimit(planType, 'maxNominees', parseInt(e.target.value))}
                              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-lg font-semibold"
                              min="1"
                            />
                          </div>
                        </div>

                        {/* Plan Comparison Bar */}
                        <div className="mt-4 pt-4 border-t border-gray-200">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Storage Capacity</span>
                            <span className="font-semibold text-gray-900">
                              {plan.maxAssets === 'Unlimited' ? '∞' : `${plan.maxAssets} × ${plan.maxFileSize}MB`}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Inactivity Rules */}
            {activeSection === 'inactivity' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Inactivity Period Configuration</h3>
                    <p className="text-gray-600">Define when assets should be released to nominees</p>
                  </div>
                </div>

                {/* Period Selection */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    Available Periods
                    <HelpCircle
                      className="w-4 h-4 text-gray-400 cursor-help"
                      onMouseEnter={(e) => showTooltip('Users can choose from these inactivity periods', e)}
                      onMouseLeave={hideTooltip}
                    />
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[30, 60, 90, 120, 180, 365].map(period => {
                      const isSelected = settings.inactivityRules.availablePeriods.includes(period);
                      return (
                        <button
                          key={period}
                          onClick={() => {
                            const periods = settings.inactivityRules.availablePeriods;
                            if (isSelected) {
                              setSettings({
                                ...settings,
                                inactivityRules: {
                                  ...settings.inactivityRules,
                                  availablePeriods: periods.filter(p => p !== period)
                                }
                              });
                            } else {
                              setSettings({
                                ...settings,
                                inactivityRules: {
                                  ...settings.inactivityRules,
                                  availablePeriods: [...periods, period].sort((a, b) => a - b)
                                }
                              });
                            }
                          }}
                          className={`relative p-4 rounded-xl border-2 transition-all transform hover:scale-105 ${
                            isSelected
                              ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white border-purple-600 shadow-lg'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          <div className="text-2xl font-bold">{period}</div>
                          <div className="text-sm opacity-90">days</div>
                          {isSelected && (
                            <CheckCircle className="w-5 h-5 absolute top-2 right-2" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Default & Minimum Period */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      Default Period
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help"
                        onMouseEnter={(e) => showTooltip('Default inactivity period for new users', e)}
                        onMouseLeave={hideTooltip}
                      />
                    </label>
                    <select
                      value={settings.inactivityRules.defaultPeriod}
                      onChange={(e) => setSettings({
                        ...settings,
                        inactivityRules: {
                          ...settings.inactivityRules,
                          defaultPeriod: parseInt(e.target.value)
                        }
                      })}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                    >
                      {settings.inactivityRules.availablePeriods.map(period => (
                        <option key={period} value={period}>{period} days</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                      Minimum Period
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help"
                        onMouseEnter={(e) => showTooltip('Minimum allowed inactivity period', e)}
                        onMouseLeave={hideTooltip}
                      />
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={settings.inactivityRules.minimumPeriod}
                        onChange={(e) => setSettings({
                          ...settings,
                          inactivityRules: {
                            ...settings.inactivityRules,
                            minimumPeriod: parseInt(e.target.value)
                          }
                        })}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-lg font-semibold"
                        min="1"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">days</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Verification Settings */}
            {activeSection === 'verification' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-green-500 to-green-600 rounded-lg">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Verification & Document Policies</h3>
                    <p className="text-gray-600">Control nominee verification workflows</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Auto-reject */}
                  <div className="p-5 bg-gradient-to-br from-red-50 to-rose-50 rounded-xl border-2 border-red-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      Auto-reject Timeout
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help"
                        onMouseEnter={(e) => showTooltip('Automatically reject pending verifications after this period', e)}
                        onMouseLeave={hideTooltip}
                      />
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="7"
                        max="90"
                        value={settings.verificationSettings.autoRejectAfterDays}
                        onChange={(e) => setSettings({
                          ...settings,
                          verificationSettings: {
                            ...settings.verificationSettings,
                            autoRejectAfterDays: parseInt(e.target.value)
                          }
                        })}
                        className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="w-24 px-4 py-2 bg-white border-2 border-red-300 rounded-lg text-center">
                        <span className="text-2xl font-bold text-red-600">{settings.verificationSettings.autoRejectAfterDays}</span>
                        <span className="text-xs text-gray-600 block">days</span>
                      </div>
                    </div>
                  </div>

                  {/* Document Expiry */}
                  <div className="p-5 bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border-2 border-amber-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      Document Expiry Period
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help"
                        onMouseEnter={(e) => showTooltip('How long uploaded documents remain valid', e)}
                        onMouseLeave={hideTooltip}
                      />
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="30"
                        max="180"
                        value={settings.verificationSettings.documentExpiryDays}
                        onChange={(e) => setSettings({
                          ...settings,
                          verificationSettings: {
                            ...settings.verificationSettings,
                            documentExpiryDays: parseInt(e.target.value)
                          }
                        })}
                        className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="w-24 px-4 py-2 bg-white border-2 border-amber-300 rounded-lg text-center">
                        <span className="text-2xl font-bold text-amber-600">{settings.verificationSettings.documentExpiryDays}</span>
                        <span className="text-xs text-gray-600 block">days</span>
                      </div>
                    </div>
                  </div>

                  {/* Max Re-upload Attempts */}
                  <div className="p-5 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border-2 border-blue-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      Maximum Re-upload Attempts
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help"
                        onMouseEnter={(e) => showTooltip('How many times a nominee can resubmit documents', e)}
                        onMouseLeave={hideTooltip}
                      />
                    </label>
                    <div className="flex gap-3">
                      {[1, 2, 3, 4, 5].map(num => (
                        <button
                          key={num}
                          onClick={() => setSettings({
                            ...settings,
                            verificationSettings: {
                              ...settings.verificationSettings,
                              maxReuploadAttempts: num
                            }
                          })}
                          className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                            settings.verificationSettings.maxReuploadAttempts === num
                              ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 border-2 border-gray-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Security Settings */}
            {activeSection === 'security' && (
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-gradient-to-br from-red-500 to-red-600 rounded-lg">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">Security & Access Control</h3>
                    <p className="text-gray-600">Protect admin accounts and enforce policies</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Session Timeout */}
                  <div className="p-5 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl border-2 border-purple-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      Admin Session Timeout
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help"
                        onMouseEnter={(e) => showTooltip('Auto-logout admins after this period of inactivity', e)}
                        onMouseLeave={hideTooltip}
                      />
                    </label>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="1"
                        max="24"
                        value={settings.securitySettings.adminSessionTimeoutHours}
                        onChange={(e) => setSettings({
                          ...settings,
                          securitySettings: {
                            ...settings.securitySettings,
                            adminSessionTimeoutHours: parseInt(e.target.value)
                          }
                        })}
                        className="flex-1 h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="w-24 px-4 py-2 bg-white border-2 border-purple-300 rounded-lg text-center">
                        <span className="text-2xl font-bold text-purple-600">{settings.securitySettings.adminSessionTimeoutHours}</span>
                        <span className="text-xs text-gray-600 block">hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Max Login Attempts */}
                  <div className="p-5 bg-gradient-to-br from-orange-50 to-red-50 rounded-xl border-2 border-orange-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                      Maximum Login Attempts
                      <HelpCircle
                        className="w-4 h-4 text-gray-400 cursor-help"
                        onMouseEnter={(e) => showTooltip('Lock account after this many failed login attempts', e)}
                        onMouseLeave={hideTooltip}
                      />
                    </label>
                    <div className="flex gap-3">
                      {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                        <button
                          key={num}
                          onClick={() => setSettings({
                            ...settings,
                            securitySettings: {
                              ...settings.securitySettings,
                              maxLoginAttempts: num
                            }
                          })}
                          className={`flex-1 py-3 rounded-lg font-bold text-lg transition-all transform hover:scale-105 ${
                            settings.securitySettings.maxLoginAttempts === num
                              ? 'bg-gradient-to-br from-orange-500 to-red-600 text-white shadow-lg'
                              : 'bg-white text-gray-700 border-2 border-gray-200'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2FA Toggle */}
                  <div className="p-5 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Lock className="w-5 h-5 text-green-600" />
                          <label className="text-lg font-bold text-gray-900">Two-Factor Authentication</label>
                        </div>
                        <p className="text-sm text-gray-600">Require all admins to use 2FA for enhanced security</p>
                        <div className="mt-3 flex items-center gap-2">
                          <Activity className={`w-4 h-4 ${settings.securitySettings.twoFactorRequired ? 'text-green-600' : 'text-gray-400'}`} />
                          <span className={`text-sm font-semibold ${settings.securitySettings.twoFactorRequired ? 'text-green-600' : 'text-gray-500'}`}>
                            {settings.securitySettings.twoFactorRequired ? 'ENABLED - All admins must use 2FA' : 'DISABLED - 2FA is optional'}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => setSettings({
                          ...settings,
                          securitySettings: {
                            ...settings.securitySettings,
                            twoFactorRequired: !settings.securitySettings.twoFactorRequired
                          }
                        })}
                        className={`relative inline-flex h-12 w-24 items-center rounded-full transition-all duration-300 transform hover:scale-110 ${
                          settings.securitySettings.twoFactorRequired
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg'
                            : 'bg-gray-300'
                        }`}
                      >
                        <span
                          className={`inline-block h-10 w-10 transform rounded-full bg-white transition-transform duration-300 shadow-lg flex items-center justify-center ${
                            settings.securitySettings.twoFactorRequired ? 'translate-x-12' : 'translate-x-1'
                          }`}
                        >
                          {settings.securitySettings.twoFactorRequired ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                          ) : (
                            <XCircle className="w-6 h-6 text-gray-400" />
                          )}
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Preview Panel */}
          {showPreview && (
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                {/* Live Preview Card */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Eye className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
                  </div>

                  {activeSection === 'plans' && (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 font-medium mb-3">Plan Comparison</div>
                      {(['FREE', 'PLUS', 'PREMIUM'] as const).map(planType => {
                        const plan = settings.plans[planType];
                        return (
                          <div key={planType} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-semibold text-gray-900">{planType}</span>
                              <span className="text-sm text-gray-600">₹{plan.price}/mo</span>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div>📦 {plan.maxAssets} assets</div>
                              <div>💾 {plan.maxFileSize}MB per file</div>
                              <div>👥 {plan.maxNominees} nominees</div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeSection === 'inactivity' && (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 font-medium mb-3">Inactivity Summary</div>
                      <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-center">
                          <Clock className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                          <div className="text-3xl font-bold text-purple-600">{settings.inactivityRules.defaultPeriod}</div>
                          <div className="text-sm text-gray-600">Default Period (days)</div>
                        </div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-xs text-gray-600 space-y-2">
                          <div className="flex justify-between">
                            <span>Available Periods:</span>
                            <span className="font-semibold">{settings.inactivityRules.availablePeriods.length} options</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Minimum Period:</span>
                            <span className="font-semibold">{settings.inactivityRules.minimumPeriod} days</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'verification' && (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 font-medium mb-3">Verification Policies</div>
                      <div className="space-y-2">
                        <div className="p-3 bg-red-50 rounded-lg border border-red-200">
                          <div className="text-xs text-gray-600 mb-1">Auto-reject after</div>
                          <div className="text-2xl font-bold text-red-600">{settings.verificationSettings.autoRejectAfterDays} days</div>
                        </div>
                        <div className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="text-xs text-gray-600 mb-1">Document expiry</div>
                          <div className="text-2xl font-bold text-amber-600">{settings.verificationSettings.documentExpiryDays} days</div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="text-xs text-gray-600 mb-1">Max re-uploads</div>
                          <div className="text-2xl font-bold text-blue-600">{settings.verificationSettings.maxReuploadAttempts} attempts</div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeSection === 'security' && (
                    <div className="space-y-3">
                      <div className="text-sm text-gray-600 font-medium mb-3">Security Status</div>
                      <div className="space-y-2">
                        <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="text-xs text-gray-600 mb-1">Session Timeout</div>
                          <div className="text-2xl font-bold text-purple-600">{settings.securitySettings.adminSessionTimeoutHours} hours</div>
                        </div>
                        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="text-xs text-gray-600 mb-1">Max Login Attempts</div>
                          <div className="text-2xl font-bold text-orange-600">{settings.securitySettings.maxLoginAttempts} tries</div>
                        </div>
                        <div className={`p-3 rounded-lg border-2 ${settings.securitySettings.twoFactorRequired ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                          <div className="flex items-center justify-between">
                            <div className="text-xs text-gray-600">2FA Status</div>
                            {settings.securitySettings.twoFactorRequired ? (
                              <CheckCircle className="w-5 h-5 text-green-600" />
                            ) : (
                              <XCircle className="w-5 h-5 text-gray-400" />
                            )}
                          </div>
                          <div className={`text-sm font-bold mt-1 ${settings.securitySettings.twoFactorRequired ? 'text-green-600' : 'text-gray-500'}`}>
                            {settings.securitySettings.twoFactorRequired ? 'REQUIRED' : 'OPTIONAL'}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Impact Summary */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <h3 className="text-lg font-bold text-gray-900">Impact Summary</h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                      <div>
                        <span className="text-gray-900 font-semibold">Global Changes:</span>
                        <span className="text-gray-600"> Affects all users immediately</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                      <div>
                        <span className="text-gray-900 font-semibold">Audit Trail:</span>
                        <span className="text-gray-600"> All changes are logged</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-1.5"></div>
                      <div>
                        <span className="text-gray-900 font-semibold">Reversible:</span>
                        <span className="text-gray-600"> Can be modified anytime</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Restrictions */}
                <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl border border-amber-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertCircle className="w-5 h-5 text-amber-600" />
                    <h3 className="text-lg font-bold text-gray-900">Restrictions</h3>
                  </div>
                  <div className="space-y-2 text-xs text-amber-800">
                    <div className="flex items-start gap-2">
                      <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Cannot change individual user plans</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Cannot access encryption keys</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <XCircle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                      <span>Cannot view asset content</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 mt-0.5 flex-shrink-0 text-green-600" />
                      <span className="text-green-700">Can modify global policies only</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Tooltip */}
        {tooltip.show && (
          <div
            className="fixed z-50 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg pointer-events-none"
            style={{
              left: `${tooltip.x + 10}px`,
              top: `${tooltip.y + 10}px`,
              maxWidth: '250px'
            }}
          >
            {tooltip.content}
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;