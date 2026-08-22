import { useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Download, Check, MessageCircle, Send, Facebook, Smartphone } from 'lucide-react';
import PageLayout from '@/components/PageLayout';
import { useTranslation } from '@/hooks/useTranslation';
import { copyText, downloadShareCard, openSocialShare, shareContent, type SocialPlatform } from '@/lib/shareService';

const socialPlatforms: Array<{ name: SocialPlatform; icon: typeof MessageCircle; color: string }> = [
  { name: 'WhatsApp', icon: MessageCircle, color: 'from-green-600 to-green-700' },
  { name: 'Telegram', icon: Send, color: 'from-blue-600 to-blue-700' },
  { name: 'Facebook', icon: Facebook, color: 'from-blue-700 to-blue-800' },
  { name: 'Twitter', icon: Smartphone, color: 'from-gray-600 to-gray-700' },
];

export default function Share() {
  const { t, language } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const isRtl = language === 'ar';
  const shareText = t('shareMessage');
  const shareUrl = window.location.origin;
  const payload = { title: t('appName'), text: shareText, url: shareUrl };

  const handleSystemShare = async () => {
    const result = await shareContent(payload);
    if (result === 'copied') {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleCopy = async () => {
    if (await copyText(`${shareText}\n\n${shareUrl}`)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  };

  const handleDownload = async () => {
    await downloadShareCard({
      title: t('appName'),
      text: isRtl ? 'سبحان الله وبحمده، سبحان الله العظيم' : 'Glory be to Allah and praise Him; glory be to Allah, the Most Great.',
      url: shareUrl,
      filename: 'adhkar-reader-share-card.png',
    });
    setDownloaded(true);
    window.setTimeout(() => setDownloaded(false), 1800);
  };

  return (
    <PageLayout title={t('share')} subtitle={t('share_via')}>
      <div className="pb-20 md:pb-8 mt-6 space-y-6" dir={isRtl ? 'rtl' : 'ltr'}>
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-gradient-to-r from-amber-600/20 to-amber-500/10 border border-amber-400/30">
          <h3 className="text-lg font-bold gold-text mb-2">{t('shareMessage')}</h3>
          <p className="text-sm mb-5" style={{ color: 'var(--text-muted)' }}>{t('shareWith')}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {socialPlatforms.map(({ name, icon: Icon, color }, index) => (
              <motion.button key={name} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => openSocialShare(name, payload)} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }} className={`flex flex-col items-center gap-2 px-3 py-4 rounded-xl bg-gradient-to-br ${color} text-white`} aria-label={`${t('share')} ${name}`}>
                <Icon className="w-6 h-6" />
                <span className="text-xs font-medium">{name}</span>
              </motion.button>
            ))}
          </div>
          <button onClick={handleSystemShare} className="w-full mt-4 py-3 rounded-xl flex items-center justify-center gap-2" style={{ background: 'var(--gold-muted-strong)', border: '1px solid var(--gold-border-strong)', color: 'var(--text-gold)' }} aria-label={t('share')}>
            <Share2 className="w-5 h-5" />
            {t('share')}
          </button>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-4 rounded-2xl bg-amber-900/20 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-4"><Copy className="w-5 h-5" style={{ color: 'var(--text-gold)' }} /><h3 className="font-bold gold-text">{t('copyLink')}</h3></div>
          <button onClick={handleCopy} className="w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2" style={{ background: 'var(--gold-muted-strong)', border: '1px solid var(--gold-border-strong)', color: 'var(--text-gold)' }}>
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? t('copied') : t('copyLink')}
          </button>
        </motion.section>

        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="p-4 rounded-2xl bg-amber-900/20 border border-amber-500/20">
          <div className="flex items-center gap-3 mb-4"><Download className="w-5 h-5" style={{ color: 'var(--text-gold)' }} /><h3 className="font-bold gold-text">{t('share')}</h3></div>
          <button onClick={handleDownload} className="w-full px-4 py-3 rounded-xl flex items-center justify-center gap-2" style={{ background: 'var(--gold-muted-strong)', border: '1px solid var(--gold-border-strong)', color: 'var(--text-gold)' }}>
            {downloaded ? <Check className="w-4 h-4" /> : <Download className="w-4 h-4" />}
            {downloaded ? t('success') : t('downloadData')}
          </button>
        </motion.section>
      </div>
    </PageLayout>
  );
}
