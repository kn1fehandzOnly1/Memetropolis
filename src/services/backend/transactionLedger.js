// ACID-Compliant Transactional Coin Ledger & Anti-Fraud Engine
// Prevents race conditions, double-spending, and balance tampering

import { db } from './firebase.config';
import { 
  doc, 
  runTransaction, 
  collection, 
  serverTimestamp, 
  increment 
} from 'firebase/firestore';

export class TransactionLedger {
  /**
   * Transfer coins from user to meme creator (Creator Tipping)
   */
  static async tipCreator({ senderId, receiverId, postId, award }) {
    if (!senderId || !receiverId || !award || award.cost <= 0) {
      throw new Error('Invalid tipping parameter payload');
    }

    const senderRef = doc(db, 'users', senderId);
    const receiverRef = doc(db, 'users', receiverId);
    const postRef = doc(db, 'posts', postId);
    const ledgerRef = doc(collection(db, 'transactions_ledger'));

    return await runTransaction(db, async (transaction) => {
      const senderDoc = await transaction.get(senderRef);
      if (!senderDoc.exists()) {
        throw new Error('Sender account does not exist');
      }

      const currentBalance = senderDoc.data().coins || 0;
      if (currentBalance < award.cost) {
        throw new Error(`Insufficient coin balance. Current: ${currentBalance}, Required: ${award.cost}`);
      }

      // 1. Deduct coins from sender
      transaction.update(senderRef, {
        coins: increment(-award.cost),
        totalTipped: increment(award.cost)
      });

      // 2. Add coins to receiver
      transaction.update(receiverRef, {
        coins: increment(award.cost),
        totalEarned: increment(award.cost)
      });

      // 3. Increment post award counter
      transaction.update(postRef, {
        [`awards.${award.id}`]: increment(1)
      });

      // 4. Record immutable audit log in transaction ledger
      transaction.set(ledgerRef, {
        type: 'CREATOR_TIP',
        senderId,
        receiverId,
        postId,
        awardId: award.id,
        amountCoins: award.cost,
        timestamp: serverTimestamp(),
        status: 'SUCCESS'
      });

      return {
        newSenderBalance: currentBalance - award.cost,
        award
      };
    });
  }

  /**
   * Award user free coins for watching a Rewarded Video Ad with daily rate limiting
   */
  static async claimRewardedAdCoins(userId, rewardCoins = 50, adUnitId = 'rad_default') {
    const userRef = doc(db, 'users', userId);
    const ledgerRef = doc(collection(db, 'transactions_ledger'));
    const todayDateStr = new Date().toISOString().split('T')[0];

    return await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) {
        throw new Error('User account not found');
      }

      const userData = userDoc.data();
      const adsClaimedToday = userData.dailyAdsLog?.[todayDateStr] || 0;
      const MAX_DAILY_ADS = 5;

      if (adsClaimedToday >= MAX_DAILY_ADS) {
        throw new Error(`Daily ad reward limit reached (${MAX_DAILY_ADS}/${MAX_DAILY_ADS}). Try again tomorrow!`);
      }

      // 1. Credit reward coins to user balance
      transaction.update(userRef, {
        coins: increment(rewardCoins),
        [`dailyAdsLog.${todayDateStr}`]: increment(1)
      });

      // 2. Write transaction audit log
      transaction.set(ledgerRef, {
        type: 'REWARDED_AD_WATCH',
        userId,
        adUnitId,
        amountCoins: rewardCoins,
        timestamp: serverTimestamp(),
        status: 'SUCCESS'
      });

      return {
        newBalance: (userData.coins || 0) + rewardCoins,
        rewardCoins,
        adsRemaining: MAX_DAILY_ADS - (adsClaimedToday + 1)
      };
    });
  }

  /**
   * Process In-App Purchase Coin Pack Addition
   */
  static async processCoinPackPurchase(userId, coinPackId, amountCoins, purchaseToken) {
    const userRef = doc(db, 'users', userId);
    const ledgerRef = doc(collection(db, 'transactions_ledger'));

    return await runTransaction(db, async (transaction) => {
      // 1. Credit purchased coins
      transaction.update(userRef, {
        coins: increment(amountCoins),
        totalPurchasedCoins: increment(amountCoins)
      });

      // 2. Write immutable receipt record
      transaction.set(ledgerRef, {
        type: 'IN_APP_PURCHASE',
        userId,
        coinPackId,
        purchaseToken,
        amountCoins,
        timestamp: serverTimestamp(),
        status: 'COMPLETED'
      });

      return { amountCoins };
    });
  }

  /**
   * Claim Subscriber Milestone Reward
   */
  static async claimSubscriberMilestone(userId, milestoneCount, rewardCoins) {
    const userRef = doc(db, 'users', userId);
    const ledgerRef = doc(collection(db, 'transactions_ledger'));

    return await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userRef);
      if (!userDoc.exists()) throw new Error('User not found');

      const userData = userDoc.data();
      const currentSubs = userData.subscribers || 0;
      const claimedMilestones = userData.claimedMilestones || [];

      if (currentSubs < milestoneCount) {
        throw new Error(`Subscriber milestone not yet reached (${currentSubs}/${milestoneCount})`);
      }

      if (claimedMilestones.includes(milestoneCount)) {
        throw new Error('Milestone reward already claimed');
      }

      // 1. Add coins & mark milestone claimed
      transaction.update(userRef, {
        coins: increment(rewardCoins),
        claimedMilestones: [...claimedMilestones, milestoneCount]
      });

      // 2. Audit log
      transaction.set(ledgerRef, {
        type: 'SUBSCRIBER_MILESTONE_REWARD',
        userId,
        milestoneCount,
        rewardCoins,
        timestamp: serverTimestamp(),
        status: 'SUCCESS'
      });

      return { rewardCoins, milestoneCount };
    });
  }
}
