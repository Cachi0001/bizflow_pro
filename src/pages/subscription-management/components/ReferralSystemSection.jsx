import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ReferralSystemSection = () => {
  const [referralLink, setReferralLink] = useState('https://bizflowpro.ng/ref/JD2024');
  const [copied, setCopied] = useState(false);

  const referralStats = {
    totalReferrals: 12,
    successfulReferrals: 8,
    pendingReferrals: 4,
    totalEarnings: 1600, // in Naira
    availableRewards: 3
  };

  const referralHistory = [
    {
      id: 'ref_001',
      name: 'Adebayo Ogundimu',
      email: 'adebayo@business.ng',
      status: 'completed',
      joinDate: new Date('2024-01-10'),
      reward: '₦200 discount',
      planUpgraded: 'Silver Plan'
    },
    {
      id: 'ref_002',
      name: 'Fatima Abdullahi',
      email: 'fatima@shop.ng',
      status: 'completed',
      joinDate: new Date('2024-01-05'),
      reward: '5 extra invoices',
      planUpgraded: 'Free Plan'
    },
    {
      id: 'ref_003',
      name: 'Chinedu Okoro',
      email: 'chinedu@trading.ng',
      status: 'pending',
      joinDate: new Date('2024-01-12'),
      reward: 'Pending',
      planUpgraded: null
    },
    {
      id: 'ref_004',
      name: 'Aisha Mohammed',
      email: 'aisha@fashion.ng',
      status: 'completed',
      joinDate: new Date('2023-12-28'),
      reward: '₦200 discount',
      planUpgraded: 'Silver Plan'
    }
  ];

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  const handleShareLink = (platform) => {
    const message = encodeURIComponent(`Join me on BizFlow Pro - the best business management tool for Nigerian SMEs! Get started for free: ${referralLink}`);
    
    const shareUrls = {
      whatsapp: `https://wa.me/?text=${message}`,
      twitter: `https://twitter.com/intent/tweet?text=${message}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`
    };

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      completed: {
        color: 'text-success-600',
        bgColor: 'bg-success-100',
        icon: 'CheckCircle',
        label: 'Completed'
      },
      pending: {
        color: 'text-warning-600',
        bgColor: 'bg-warning-100',
        icon: 'Clock',
        label: 'Pending'
      }
    };
    return configs[status] || configs.pending;
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-NG', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Referral Stats Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-primary-600 mb-1">
            {referralStats.totalReferrals}
          </div>
          <div className="text-sm text-text-secondary">Total Referrals</div>
        </div>
        
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-success-600 mb-1">
            {referralStats.successfulReferrals}
          </div>
          <div className="text-sm text-text-secondary">Successful</div>
        </div>
        
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-accent-600 mb-1">
            ₦{referralStats.totalEarnings.toLocaleString()}
          </div>
          <div className="text-sm text-text-secondary">Total Earned</div>
        </div>
        
        <div className="card p-4 text-center">
          <div className="text-2xl font-bold text-info-600 mb-1">
            {referralStats.availableRewards}
          </div>
          <div className="text-sm text-text-secondary">Available Rewards</div>
        </div>
      </div>

      {/* Referral Link Section */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Your Referral Link</h3>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="flex-1 p-3 bg-gray-50 border border-border rounded-lg font-mono text-sm">
              {referralLink}
            </div>
            <Button
              variant={copied ? "success" : "outline"}
              onClick={handleCopyLink}
              iconName={copied ? "Check" : "Copy"}
            >
              {copied ? 'Copied!' : 'Copy'}
            </Button>
          </div>
          
          {/* Social Share Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareLink('whatsapp')}
              iconName="MessageCircle"
              className="text-green-600 border-green-200 hover:bg-green-50"
            >
              WhatsApp
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareLink('twitter')}
              iconName="Twitter"
              className="text-blue-600 border-blue-200 hover:bg-blue-50"
            >
              Twitter
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareLink('facebook')}
              iconName="Facebook"
              className="text-blue-700 border-blue-200 hover:bg-blue-50"
            >
              Facebook
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleShareLink('linkedin')}
              iconName="Linkedin"
              className="text-blue-800 border-blue-200 hover:bg-blue-50"
            >
              LinkedIn
            </Button>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">How Referrals Work</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Share" size={24} color="var(--color-primary-600)" />
            </div>
            <h4 className="font-medium text-text-primary mb-2">1. Share Your Link</h4>
            <p className="text-sm text-text-secondary">
              Share your unique referral link with friends and business contacts
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="UserPlus" size={24} color="var(--color-secondary-600)" />
            </div>
            <h4 className="font-medium text-text-primary mb-2">2. They Sign Up</h4>
            <p className="text-sm text-text-secondary">
              When someone joins using your link, they get started with BizFlow Pro
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Icon name="Gift" size={24} color="var(--color-accent-600)" />
            </div>
            <h4 className="font-medium text-text-primary mb-2">3. Earn Rewards</h4>
            <p className="text-sm text-text-secondary">
              Get ₦200 discount or extra features when they upgrade to paid plans
            </p>
          </div>
        </div>
      </div>

      {/* Referral History */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Referral History</h3>
        
        <div className="space-y-4">
          {referralHistory.map((referral) => {
            const statusConfig = getStatusConfig(referral.status);
            
            return (
              <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className={`w-10 h-10 rounded-full ${statusConfig.bgColor} flex items-center justify-center`}>
                    <Icon name={statusConfig.icon} size={20} color={statusConfig.color.replace('text-', 'var(--color-').replace('-600', '-500)')} />
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-text-primary">{referral.name}</h4>
                    <p className="text-sm text-text-secondary">{referral.email}</p>
                    <p className="text-xs text-text-tertiary">
                      Joined {formatDate(referral.joinDate)}
                      {referral.planUpgraded && ` • ${referral.planUpgraded}`}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}>
                    {statusConfig.label}
                  </span>
                  <p className="text-sm text-text-secondary mt-1">
                    {referral.reward}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Referral Terms */}
      <div className="bg-info-50 border border-info-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Info" size={20} color="var(--color-info-600)" className="mt-0.5" />
          <div>
            <h4 className="font-medium text-info-800 mb-1">Referral Terms</h4>
            <ul className="text-sm text-info-700 space-y-1">
              <li>• Rewards are credited when referred users upgrade to paid plans</li>
              <li>• Free plan referrals earn 5 extra invoices or expenses</li>
              <li>• Paid plan referrals earn ₦200 discount on your next payment</li>
              <li>• Referral abuse is monitored and may result in account suspension</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystemSection;