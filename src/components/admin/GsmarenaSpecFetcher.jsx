import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Loader2, ExternalLink, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { fetchGsmSpecs, applyGsmDataToForm } from '../../utils/fetchGsmSpecs';

const emptySpecs = { specs: '', fullSpecs: {}, gsmLink: '' };

const GsmarenaSpecFetcher = ({ formData, setFormData, setImagePreview, disabled, category }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [candidates, setCandidates] = useState(null);
  const [lastMessage, setLastMessage] = useState('');

  const specCount = formData.fullSpecs ? Object.keys(formData.fullSpecs).length : 0;
  const isMobile = category === 'Mobile';

  const applyResult = (gsm) => {
    setFormData((prev) => applyGsmDataToForm(prev, gsm));
    if (gsm.image && setImagePreview) setImagePreview(gsm.image);
    setLastMessage(
      gsm.specCount
        ? `Loaded ${gsm.specCount} specification sections from GSMArena.`
        : 'GSMArena data applied.'
    );
    setError('');
  };

  const runFetch = async (href) => {
    if (!formData.name?.trim() && !href) {
      setError('Enter product name first (e.g. iPhone 16 Pro Max).');
      return;
    }

    setLoading(true);
    setError('');
    setLastMessage('');
    setCandidates(null);

    try {
      const result = await fetchGsmSpecs({
        name: formData.name,
        brand: formData.brand,
        href,
      });

      if (result.needsPick && result.candidates?.length) {
        setCandidates(result.candidates);
        setLastMessage('Multiple matches — pick the correct phone.');
        return;
      }

      applyResult(result);
    } catch (err) {
      setError(err.message || 'Could not load GSMArena specs.');
    } finally {
      setLoading(false);
    }
  };

  const pickCandidate = async (candidate) => {
    setCandidates(null);
    setLoading(true);
    try {
      const result = await fetchGsmSpecs({ href: candidate.href });
      applyResult(result);
    } catch (err) {
      setError(err.message || 'Failed to load selected model.');
    } finally {
      setLoading(false);
    }
  };

  if (!isMobile) return null;

  return (
    <div className="space-y-3 bg-gradient-to-br from-slate-50 to-primary/5 p-5 rounded-3xl border border-primary/20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-black uppercase tracking-widest text-primary">GSMArena Auto Specs</p>
          <p className="text-[10px] text-slate-500 font-semibold mt-0.5">
            Full specifications load from gsmarena.com — shown on the shop product page.
          </p>
        </div>
        <button
          type="button"
          disabled={disabled || loading}
          onClick={() => runFetch()}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-secondary text-white text-[10px] font-black uppercase tracking-wider hover:bg-secondary/90 disabled:opacity-60 shrink-0"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
          {loading ? 'Loading…' : 'Load from GSMArena'}
        </button>
      </div>

      {error && (
        <p className="flex items-start gap-2 text-xs text-red-600 font-semibold">
          <AlertCircle size={16} className="shrink-0 mt-0.5" />
          {error}
        </p>
      )}

      {lastMessage && !error && (
        <p className="flex items-center gap-2 text-xs text-emerald-700 font-semibold">
          <CheckCircle2 size={16} />
          {lastMessage}
        </p>
      )}

      {formData.gsmLink && (
        <a
          href={formData.gsmLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline"
        >
          <ExternalLink size={12} />
          View source on GSMArena
        </a>
      )}

      {specCount > 0 && (
        <details className="rounded-2xl bg-white border border-slate-200 overflow-hidden">
          <summary className="px-4 py-3 text-[10px] font-black uppercase tracking-wider text-secondary cursor-pointer">
            Preview specs ({specCount} sections)
          </summary>
          <div className="max-h-48 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-2 border-t border-slate-100">
            {Object.entries(formData.fullSpecs).map(([key, value]) => (
              <div key={key} className="text-[10px]">
                <span className="font-black text-secondary uppercase">{key}</span>
                <p className="text-slate-500 whitespace-pre-line leading-relaxed mt-0.5 line-clamp-3">
                  {String(value)}
                </p>
              </div>
            ))}
          </div>
        </details>
      )}

      <AnimatePresence>
        {candidates && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-secondary/50 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-2xl max-w-lg w-full max-h-[80vh] overflow-hidden border border-slate-200"
            >
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h3 className="font-black text-secondary uppercase text-sm tracking-wide">Pick correct model</h3>
                <button
                  type="button"
                  onClick={() => setCandidates(null)}
                  className="p-2 rounded-xl bg-slate-100 text-slate-500"
                >
                  <X size={18} />
                </button>
              </div>
              <ul className="overflow-y-auto max-h-[60vh] p-3 space-y-2">
                {candidates.map((c) => (
                  <li key={c.href}>
                    <button
                      type="button"
                      onClick={() => pickCandidate(c)}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-primary/5 border border-transparent hover:border-primary/30 text-left transition-colors"
                    >
                      {c.thumb && (
                        <img src={c.thumb} alt="" className="w-12 h-12 object-contain rounded-lg bg-slate-50" />
                      )}
                      <span className="font-bold text-sm text-secondary">{c.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export { emptySpecs };
export default GsmarenaSpecFetcher;
