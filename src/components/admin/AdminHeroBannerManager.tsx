import React, { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  Image as ImageIcon,
  Layers,
  Plus,
  RotateCcw,
  Save,
  Trash2,
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { useStore } from '../../context/StoreContext';

export interface CmsHeroSlide {
  id: string;
  eyebrowVi: string;
  eyebrowEn: string;
  titleVi: string;
  titleEn: string;
  subtitleVi: string;
  subtitleEn: string;
  ctaLabelVi: string;
  ctaLabelEn: string;
  ctaPath: string;
  imageUrl: string;
  captionVi: string;
  captionEn: string;
}

export interface CmsHeroMetric {
  id: string;
  value: string;
  labelVi: string;
  labelEn: string;
  subVi: string;
  subEn: string;
}

export const DEFAULT_CMS_HERO_SLIDES: CmsHeroSlide[] = [
  {
    id: 'slide-1',
    eyebrowVi: 'KHƠI BẢN LĨNH · ĐẬM CHẤT RIÊNG',
    eyebrowEn: 'IGNITING COURAGE · DEFINING CHARACTER',
    titleVi: 'Nghệ thuật cà phê Việt Nam đương đại',
    titleEn: 'Contemporary Vietnamese Coffee Craft',
    subtitleVi: 'Tuyển chọn từ 10+ vùng trồng Tây Nguyên & Tây Bắc, rang thủ công theo 7 cá tính hương vị độc bản.',
    subtitleEn: 'Curated from 10+ Vietnamese highland origins, small-batch roasted across 7 distinct character profiles.',
    ctaLabelVi: 'Khám phá Cửa hàng',
    ctaLabelEn: 'Explore Shop',
    ctaPath: '/shop',
    imageUrl: '/assets/hero-phin.jpg',
    captionVi: 'Nghệ thuật pha Phin Việt Nam — Khơi bản lĩnh. Đậm chất riêng.',
    captionEn: 'Vietnamese Phin craft — Igniting Courage. Defining Character.',
  },
  {
    id: 'slide-2',
    eyebrowVi: 'NHÂN XANH THƯƠNG MẠI S14 / S16 / S18',
    eyebrowEn: 'COMMERCIAL GREEN COFFEE S14 / S16 / S18',
    titleVi: 'Chuỗi cung ứng nhân xanh chuẩn xuất khẩu',
    titleEn: 'Export-Grade Green Bean Supply Chain',
    subtitleVi: '27 mã nhân xanh Robusta, Arabica, Culi sơ chế Natural, Honey, CBU Washed minh bạch độ ẩm & tỷ lệ lỗi.',
    subtitleEn: '27 traceable Robusta, Arabica, and Peaberry lots across Natural, Honey, and CBU Washed processes.',
    ctaLabelVi: 'Xem bảng giá Nhân Xanh',
    ctaLabelEn: 'View Green Coffee Matrix',
    ctaPath: '/green-coffee',
    imageUrl: '/assets/hero-green.jpg',
    captionVi: 'Nhân xanh tuyển chọn Tây Nguyên — Chuẩn sàng S14/S16/S18.',
    captionEn: 'Highland green coffee — S14/S16/S18 export screening.',
  },
];

export const DEFAULT_CMS_HERO_METRICS: CmsHeroMetric[] = [
  { id: 'hm-1', value: '10+', labelVi: 'Vùng nguyên liệu Việt', labelEn: 'Vietnamese Origins', subVi: 'Cầu Đất · Buôn Ma Thuột', subEn: 'Cau Dat · Buon Ma Thuot' },
  { id: 'hm-2', value: '07', labelVi: 'Cá tính hương vị', labelEn: 'Flavor Personalities', subVi: 'Định vị gu thưởng thức', subEn: 'Signature taste profiles' },
  { id: 'hm-3', value: '27', labelVi: 'Mã nhân xanh B2B', labelEn: 'Green Coffee Lots', subVi: 'S14 · S16 · S18', subEn: 'S14 · S16 · S18' },
  { id: 'hm-4', value: '+30%', labelVi: 'Thưởng nạp Ví ROAR', labelEn: 'ROAR Wallet Bonus', subVi: 'Tích điểm & đổi quà', subEn: 'Earn points & rewards' },
];

interface AdminHeroBannerManagerProps {
  settings: Record<string, string>;
  onSaved?: (next: Record<string, string>) => void;
}

export const AdminHeroBannerManager: React.FC<AdminHeroBannerManagerProps> = ({
  settings,
  onSaved,
}) => {
  const { t } = useI18n();
  const { apiFetch, showToast, refreshBootstrap } = useStore();
  const [subTab, setSubTab] = useState<'slides' | 'carousel'>('slides');
  const [slides, setSlides] = useState<CmsHeroSlide[]>(DEFAULT_CMS_HERO_SLIDES);
  const [metrics, setMetrics] = useState<CmsHeroMetric[]>(DEFAULT_CMS_HERO_METRICS);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      if (settings.cms_hero_slides_json) {
        const parsed = JSON.parse(settings.cms_hero_slides_json);
        if (Array.isArray(parsed) && parsed.length > 0) setSlides(parsed);
      }
    } catch {
      // keep default
    }
    try {
      if (settings.cms_hero_metrics_json) {
        const parsed = JSON.parse(settings.cms_hero_metrics_json);
        if (Array.isArray(parsed) && parsed.length > 0) setMetrics(parsed);
      }
    } catch {
      // keep default
    }
  }, [settings.cms_hero_slides_json, settings.cms_hero_metrics_json]);

  const moveSlide = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    const copy = [...slides];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setSlides(copy);
  };

  const moveMetric = (idx: number, dir: -1 | 1) => {
    const target = idx + dir;
    if (target < 0 || target >= metrics.length) return;
    const copy = [...metrics];
    [copy[idx], copy[target]] = [copy[target], copy[idx]];
    setMetrics(copy);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        cms_hero_slides_json: JSON.stringify(slides),
        cms_hero_metrics_json: JSON.stringify(metrics),
      };
      const res = await apiFetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: payload }),
      });
      if (res.ok) {
        onSaved?.({ ...settings, ...payload });
        await refreshBootstrap();
        showToast(t('Đã lưu nội dung Hero Banner & Carousel!', 'Saved Hero Banner & Carousel content!'));
      } else {
        showToast(t('Không thể lưu cấu hình Hero Banner.', 'Failed to save Hero Banner settings.'));
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-[#16221C] p-5 rounded-xl border border-[#202020]/10 dark:border-white/10">
        <div>
          <h2 className="text-xl font-bold text-[#202020] dark:text-[#F1EFEA]">
            {t('Quản lý Hero Banner & Carousel Trang Chủ', 'Hero Banner & Carousel Manager')}
          </h2>
          <p className="text-xs text-[#202020]/65 dark:text-[#F1EFEA]/65 mt-1">
            {t(
              'Chỉnh sửa trực tiếp tiêu đề, mô tả, hình ảnh, nút CTA của các slide Hero Banner và dải thẻ Carousel chạy ngang.',
              'Edit Hero Banner slides (headlines, copy, images, CTAs) and the running Hero Metrics Carousel.'
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setSlides(DEFAULT_CMS_HERO_SLIDES);
              setMetrics(DEFAULT_CMS_HERO_METRICS);
              showToast(t('Đã khôi phục mặc định (bấm Lưu để áp dụng)', 'Reset to defaults (click Save to apply)'));
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg border border-[#202020]/15 dark:border-white/15 text-xs font-semibold cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{t('Mặc định', 'Reset')}</span>
          </button>
          <button
            type="button"
            disabled={saving}
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00552B] text-white text-xs font-semibold hover:bg-[#004422] disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saving ? t('Đang lưu...', 'Saving...') : t('Lưu Hero & Carousel', 'Save Changes')}</span>
          </button>
        </div>
      </div>

      {/* Sub-tabs */}
      <div className="flex gap-2 border-b border-[#202020]/10 dark:border-white/10 pb-2">
        <button
          type="button"
          onClick={() => setSubTab('slides')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer ${
            subTab === 'slides' ? 'bg-[#00552B] text-white' : 'text-[#202020]/70 dark:text-[#F1EFEA]/70 hover:bg-[#202020]/5'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>{t('Slide Hero Banner', 'Hero Slides')} ({slides.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('carousel')}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold cursor-pointer ${
            subTab === 'carousel' ? 'bg-[#00552B] text-white' : 'text-[#202020]/70 dark:text-[#F1EFEA]/70 hover:bg-[#202020]/5'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>{t('Carousel Thẻ Chỉ Số', 'Metrics Carousel')} ({metrics.length})</span>
        </button>
      </div>

      {/* TAB 1: HERO SLIDES */}
      {subTab === 'slides' && (
        <div className="space-y-4">
          {slides.map((s, idx) => (
            <div key={s.id} className="bg-white dark:bg-[#16221C] p-5 rounded-xl border border-[#202020]/10 dark:border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#00552B] dark:text-[#C6A667]">
                  Slide #{idx + 1}
                </span>
                <div className="flex items-center gap-1">
                  <button type="button" disabled={idx === 0} onClick={() => moveSlide(idx, -1)} className="p-1.5 rounded hover:bg-[#202020]/10 disabled:opacity-25 cursor-pointer">
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button type="button" disabled={idx === slides.length - 1} onClick={() => moveSlide(idx, 1)} className="p-1.5 rounded hover:bg-[#202020]/10 disabled:opacity-25 cursor-pointer">
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSlides((prev) => prev.filter((x) => x.id !== s.id))}
                    className="p-1.5 rounded text-red-500 hover:bg-red-500/10 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="font-semibold text-[#202020]/65 dark:text-[#F1EFEA]/65">{t('Nhãn phụ (VI)', 'Eyebrow (VI)')}</label>
                  <input
                    value={s.eyebrowVi}
                    onChange={(e) => setSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, eyebrowVi: e.target.value } : x)))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-[#202020]/15 dark:border-white/15 bg-[#F8F5EF] dark:bg-[#0E1512]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#202020]/65 dark:text-[#F1EFEA]/65">{t('Tiêu đề chính (VI)', 'Title (VI)')}</label>
                  <input
                    value={s.titleVi}
                    onChange={(e) => setSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, titleVi: e.target.value } : x)))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-[#202020]/15 dark:border-white/15 bg-[#F8F5EF] dark:bg-[#0E1512] font-semibold"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="font-semibold text-[#202020]/65 dark:text-[#F1EFEA]/65">{t('Mô tả ngắn (VI)', 'Subtitle (VI)')}</label>
                  <textarea
                    rows={2}
                    value={s.subtitleVi}
                    onChange={(e) => setSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, subtitleVi: e.target.value } : x)))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-[#202020]/15 dark:border-white/15 bg-[#F8F5EF] dark:bg-[#0E1512]"
                  />
                </div>
                <div>
                  <label className="font-semibold text-[#202020]/65 dark:text-[#F1EFEA]/65">{t('URL Hình ảnh Banner', 'Banner Image URL')}</label>
                  <input
                    value={s.imageUrl}
                    onChange={(e) => setSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, imageUrl: e.target.value } : x)))}
                    className="mt-1 w-full px-3 py-2 rounded-lg border border-[#202020]/15 dark:border-white/15 bg-[#F8F5EF] dark:bg-[#0E1512] font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-semibold text-[#202020]/65 dark:text-[#F1EFEA]/65">{t('Chữ nút CTA', 'CTA Label')}</label>
                    <input
                      value={s.ctaLabelVi}
                      onChange={(e) => setSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, ctaLabelVi: e.target.value } : x)))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-[#202020]/15 dark:border-white/15 bg-[#F8F5EF] dark:bg-[#0E1512]"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-[#202020]/65 dark:text-[#F1EFEA]/65">{t('Link nút CTA', 'CTA Link')}</label>
                    <input
                      value={s.ctaPath}
                      onChange={(e) => setSlides((prev) => prev.map((x) => (x.id === s.id ? { ...x, ctaPath: e.target.value } : x)))}
                      className="mt-1 w-full px-3 py-2 rounded-lg border border-[#202020]/15 dark:border-white/15 bg-[#F8F5EF] dark:bg-[#0E1512] font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setSlides((prev) => [
                ...prev,
                {
                  id: `slide-${Date.now()}`,
                  eyebrowVi: 'ROAR COFFEE®',
                  eyebrowEn: 'ROAR COFFEE®',
                  titleVi: 'Banner mới',
                  titleEn: 'New Hero Slide',
                  subtitleVi: 'Mô tả ngắn cho banner mới.',
                  subtitleEn: 'Short subtitle for this hero slide.',
                  ctaLabelVi: 'Khám phá ngay',
                  ctaLabelEn: 'Explore Now',
                  ctaPath: '/shop',
                  imageUrl: '/assets/hero-phin.jpg',
                  captionVi: 'ROAR COFFEE — Khơi bản lĩnh. Đậm chất riêng.',
                  captionEn: 'ROAR COFFEE — Igniting Courage. Defining Character.',
                },
              ])
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-[#00552B] text-[#00552B] dark:text-[#C6A667] dark:border-[#C6A667] text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Thêm Slide Hero Banner mới', 'Add New Hero Slide')}</span>
          </button>
        </div>
      )}

      {/* TAB 2: METRICS CAROUSEL */}
      {subTab === 'carousel' && (
        <div className="space-y-3">
          {metrics.map((m, idx) => (
            <div key={m.id} className="bg-white dark:bg-[#16221C] p-4 rounded-xl border border-[#202020]/10 dark:border-white/10 flex flex-wrap items-center gap-3 text-xs">
              <div className="flex flex-col gap-0.5">
                <button type="button" disabled={idx === 0} onClick={() => moveMetric(idx, -1)} className="p-0.5 rounded hover:bg-[#202020]/10 disabled:opacity-25 cursor-pointer">
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>
                <button type="button" disabled={idx === metrics.length - 1} onClick={() => moveMetric(idx, 1)} className="p-0.5 rounded hover:bg-[#202020]/10 disabled:opacity-25 cursor-pointer">
                  <ArrowDown className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                <input
                  value={m.value}
                  onChange={(e) => setMetrics((prev) => prev.map((x) => (x.id === m.id ? { ...x, value: e.target.value } : x)))}
                  placeholder="10+"
                  className="px-3 py-1.5 rounded-lg border border-[#202020]/15 dark:border-white/15 bg-[#F8F5EF] dark:bg-[#0E1512] font-mono font-bold"
                />
                <input
                  value={m.labelVi}
                  onChange={(e) => setMetrics((prev) => prev.map((x) => (x.id === m.id ? { ...x, labelVi: e.target.value } : x)))}
                  placeholder="Tiêu đề thẻ"
                  className="px-3 py-1.5 rounded-lg border border-[#202020]/15 dark:border-white/15 bg-[#F8F5EF] dark:bg-[#0E1512] font-semibold"
                />
                <input
                  value={m.subVi}
                  onChange={(e) => setMetrics((prev) => prev.map((x) => (x.id === m.id ? { ...x, subVi: e.target.value } : x)))}
                  placeholder="Chú thích nhỏ"
                  className="px-3 py-1.5 rounded-lg border border-[#202020]/15 dark:border-white/15 bg-[#F8F5EF] dark:bg-[#0E1512]"
                />
              </div>
              <button
                type="button"
                onClick={() => setMetrics((prev) => prev.filter((x) => x.id !== m.id))}
                className="p-1.5 rounded text-red-500 hover:bg-red-500/10 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() =>
              setMetrics((prev) => [
                ...prev,
                {
                  id: `hm-${Date.now()}`,
                  value: '100%',
                  labelVi: 'Thẻ chỉ số mới',
                  labelEn: 'New Metric Card',
                  subVi: 'Mô tả ngắn',
                  subEn: 'Short caption',
                },
              ])
            }
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-dashed border-[#00552B] text-[#00552B] dark:text-[#C6A667] dark:border-[#C6A667] text-xs font-semibold cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t('Thêm thẻ Carousel mới', 'Add Carousel Card')}</span>
          </button>
        </div>
      )}
    </div>
  );
};
