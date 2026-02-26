export const MESSAGES = {
  welcome: (points) =>
    `*Welcome to Blip.money Early Access*\n\n` +
    `Earn Blip Points.\n` +
    `Get early airdrop allocation.\n` +
    `Access the P2P payment protocol before launch.\n\n` +
    `You received *${points} Blip Points*.\n\n` +
    `Tap below to begin onboarding.`,

  alreadyRegistered: (points) =>
    `*Welcome back to Blip.money*\n\n` +
    `You are already registered.\n` +
    `Balance: *${points} Blip Points*\n\n` +
    `/tasks — Earn points\n` +
    `/ref — Invite friends\n` +
    `/daily — Daily reward\n` +
    `/leaderboard — Top users`,

  resumeOnboarding:
    `*Welcome back*\n\n` +
    `Let's finish your onboarding.\n` +
    `Tap below to continue.`,

  askName:
    `*Step 1 of 3 — Your Name*\n\n` +
    `What is your full name?`,

  askCountry:
    `*Step 2 of 3 — Country*\n\n` +
    `Which country are you currently in?`,

  askRole:
    `*Step 3 of 3 — How will you use Blip?*\n\n` +
    `Select your primary role on the network.`,

  onboardComplete: (totalPoints) =>
    `*Registration Complete*\n\n` +
    `Onboarding bonus: +50 points\n` +
    `Total balance: *${totalPoints} Blip Points*\n\n` +
    `/tasks — Complete tasks for more points\n` +
    `/ref — Invite friends (+50 each)\n` +
    `/daily — Daily check-in (+20)\n` +
    `/leaderboard — View top users`,

  points: (points) =>
    `*Blip Points*\n\n` +
    `Balance: *${points} Points*\n\n` +
    `/tasks — Complete tasks\n` +
    `/ref — Invite friends\n` +
    `/daily — Daily check-in`,

  tasks: (completed) =>
    `*Earn More Blip Points*\n\n` +
    `${completed.telegram_group ? '~~' : ''}1. Join Telegram Group — +50 pts${completed.telegram_group ? '~~ done' : ''}\n` +
    `${completed.twitter_follow ? '~~' : ''}2. Follow on X (Twitter) — +50 pts${completed.twitter_follow ? '~~ done' : ''}\n` +
    `${completed.retweet ? '~~' : ''}3. Retweet Launch Post — +100 pts${completed.retweet ? '~~ done' : ''}\n\n` +
    `Select a task to complete.`,

  allTasksComplete:
    `*All Tasks Completed*\n\n` +
    `You have completed every available task.\n` +
    `Keep earning through /daily and /ref.`,

  referral: (link, count) =>
    `*Referral Program*\n\n` +
    `Invite friends. Earn *50 points* per referral.\n\n` +
    `Your link:\n\`${link}\`\n\n` +
    `Total referrals: *${count}*`,

  dailyClaimed: (points) =>
    `*Daily Check-in*\n\n` +
    `+20 Points added.\n` +
    `Balance: *${points} Points*\n\n` +
    `Come back tomorrow for more.`,

  dailyAlready:
    `*Daily Check-in*\n\n` +
    `Already claimed today.\n` +
    `Come back tomorrow.`,

  leaderboard: (entries) => {
    let text = `*Blip Points — Leaderboard*\n\n`;
    entries.forEach((e, i) => {
      const medal = i === 0 ? '1.' : i === 1 ? '2.' : i === 2 ? '3.' : `${i + 1}.`;
      const display = e.name || e.username || 'User';
      text += `${medal} ${display} — *${e.points}* pts\n`;
    });
    return text;
  },

  adminStats: (totalUsers, totalPoints) =>
    `*Admin Dashboard*\n\n` +
    `Total Users: *${totalUsers}*\n` +
    `Total Points Distributed: *${totalPoints}*`,

  notOnboarded:
    `Complete onboarding first.\n` +
    `Send /start to begin.`,
};
