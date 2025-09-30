'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Clock, AlertTriangle, CreditCard, X } from 'lucide-react';

export default function TrialCountdown({ 
  showUpgrade = true, 
  compact = false, 
  onUpgrade,
  onDismiss 
}) {
  const { user, trialStatus, requiresSubscription } = useAuth();
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Calculate time remaining
  useEffect(() => {
    if (!trialStatus?.trialEndDate) return;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const endTime = new Date(trialStatus.trialEndDate).getTime();
      const difference = endTime - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [trialStatus?.trialEndDate]);

  // Don't show for basic accounts or if no trial status
  if (!trialStatus || user?.accountTier === 'basic') {
    return null;
  }

  // Don't show if user has active subscription
  if (trialStatus.hasSubscription && trialStatus.subscriptionStatus === 'active') {
    return null;
  }

  const isExpired = trialStatus.expired;
  const isUrgent = timeLeft.days <= 3 && !isExpired;
  const isWarning = timeLeft.days <= 7 && timeLeft.days > 3 && !isExpired;

  // Get appropriate styling
  const getStyles = () => {
    if (isExpired) {
      return {
        container: 'bg-red-50 border-red-200 text-red-800',
        icon: 'text-red-500',
        button: 'bg-red-600 hover:bg-red-700 text-white'
      };
    } else if (isUrgent) {
      return {
        container: 'bg-white border-teachgage-orange text-teachgage-navy',
        icon: 'text-teachgage-orange',
        button: 'bg-teachgage-orange hover:bg-orange-600 text-white'
      };
    } else if (isWarning) {
      return {
        container: 'bg-white border-teachgage-orange text-teachgage-navy',
        icon: 'text-teachgage-orange',
        button: 'bg-teachgage-orange hover:bg-orange-600 text-white'
      };
    } else {
      return {
        container: 'bg-white border-teachgage-blue text-teachgage-navy',
        icon: 'text-teachgage-blue',
        button: 'bg-teachgage-blue hover:bg-teachgage-medium-blue text-white'
      };
    }
  };

  const styles = getStyles();

  // Compact version for headers/navbars
  if (compact) {
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full border ${styles.container}`}>
        <Clock className={`w-3 h-3 mr-1 ${styles.icon}`} />
        <span className="text-xs font-medium">
          {isExpired 
            ? 'Trial Expired' 
            : `${timeLeft.days}d ${timeLeft.hours}h left`
          }
        </span>
        {showUpgrade && (
          <button
            onClick={onUpgrade}
            className="ml-2 text-xs underline hover:no-underline"
          >
            Upgrade
          </button>
        )}
      </div>
    );
  }

  // Full version for dashboards/main content
  return (
    <div className={`rounded-lg border p-4 ${styles.container}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <div className={`p-1 rounded-full ${isExpired ? 'bg-red-100' : isUrgent ? 'bg-teachgage-orange bg-opacity-20' : isWarning ? 'bg-teachgage-orange bg-opacity-20' : 'bg-teachgage-blue bg-opacity-20'}`}>
            {isExpired ? (
              <AlertTriangle className={`w-5 h-5 ${styles.icon}`} />
            ) : (
              <Clock className={`w-5 h-5 ${styles.icon}`} />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className="font-semibold">
              {isExpired 
                ? 'Trial Period Expired'
                : isUrgent 
                  ? 'Trial Ending Soon!'
                  : isWarning
                    ? 'Trial Ending This Week'
                    : 'Free Trial Active'
              }
            </h3>
            
            <p className="text-sm mt-1">
              {isExpired ? (
                'Your trial has ended. Subscribe now to continue using all features.'
              ) : (
                <>
                  Your {user?.accountTier} trial expires in{' '}
                  <span className="font-semibold">
                    {timeLeft.days > 0 && `${timeLeft.days} day${timeLeft.days !== 1 ? 's' : ''}`}
                    {timeLeft.days > 0 && (timeLeft.hours > 0 || timeLeft.minutes > 0) && ', '}
                    {timeLeft.hours > 0 && `${timeLeft.hours} hour${timeLeft.hours !== 1 ? 's' : ''}`}
                    {timeLeft.hours > 0 && timeLeft.minutes > 0 && ', '}
                    {timeLeft.days === 0 && timeLeft.hours === 0 && `${timeLeft.minutes} minute${timeLeft.minutes !== 1 ? 's' : ''}`}
                  </span>
                  . Subscribe to continue with full access.
                </>
              )}
            </p>

            {!isExpired && (
              <div className="mt-3 grid grid-cols-4 gap-2 text-center">
                <div className="bg-white bg-opacity-50 rounded p-2">
                  <div className="text-lg font-bold">{timeLeft.days}</div>
                  <div className="text-xs">Days</div>
                </div>
                <div className="bg-white bg-opacity-50 rounded p-2">
                  <div className="text-lg font-bold">{timeLeft.hours}</div>
                  <div className="text-xs">Hours</div>
                </div>
                <div className="bg-white bg-opacity-50 rounded p-2">
                  <div className="text-lg font-bold">{timeLeft.minutes}</div>
                  <div className="text-xs">Minutes</div>
                </div>
                <div className="bg-white bg-opacity-50 rounded p-2">
                  <div className="text-lg font-bold">{timeLeft.seconds}</div>
                  <div className="text-xs">Seconds</div>
                </div>
              </div>
            )}

            {showUpgrade && (
              <div className="mt-4 flex space-x-3">
                <button
                  onClick={onUpgrade}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${styles.button}`}
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  {isExpired ? 'Subscribe Now' : 'Upgrade Account'}
                </button>
                
                <button className="text-sm underline hover:no-underline">
                  Learn More
                </button>
              </div>
            )}
          </div>
        </div>

        {onDismiss && !isExpired && (
          <button
            onClick={onDismiss}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
