export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

/**
 * TELEGRAM_BOT_TOKEN va TELEGRAM_CHAT_ID (bir nechta bo'lsa vergul bilan) env o'zgaruvchilari kerak.
 */
export async function sendTelegramMessage(html: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatIds = (process.env.TELEGRAM_CHAT_ID || '').split(',').map((s) => s.trim()).filter(Boolean);
  if (!token || chatIds.length === 0) {
    throw new Error('TELEGRAM_BOT_TOKEN yoki TELEGRAM_CHAT_ID sozlanmagan');
  }

  const results = await Promise.allSettled(
    chatIds.map(async (chatId) => {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: html, parse_mode: 'HTML', disable_web_page_preview: true }),
        cache: 'no-store',
        signal: AbortSignal.timeout(10000),
      });
      if (!res.ok) {
        const body = await res.text();
        throw new Error(`Telegram ${res.status}: ${body}`);
      }
    })
  );

  // Kamida bittasiga yetib borsa — muvaffaqiyat
  if (!results.some((r) => r.status === 'fulfilled')) {
    const first = results.find((r) => r.status === 'rejected') as PromiseRejectedResult | undefined;
    throw first?.reason ?? new Error('Telegram xabar yuborilmadi');
  }
}
