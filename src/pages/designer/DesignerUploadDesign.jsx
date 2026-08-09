import { useState } from 'react';
import { apiCreateDesign } from '../../api/api';
import Icons from '../../components/Icons';
import { FormField, inputCls, btnSecondary } from '../../components/ui/FormField';
import Breadcrumb from '../../components/ui/Breadcrumb';

const DesignerUploadDesign = ({ navigateTo, showToast }) => {
  const [form, setForm] = useState({ name: '', collection: 'Summer', season: 'SS25', designType: 'Print', targetCategory: 'Ethnic', tags: '', description: '' });

  const handleSubmit = async (status) => {
    try {
      await apiCreateDesign({ ...form, status });
      showToast(status === 'Draft' ? 'Design saved as draft' : 'Design submitted for review');
      navigateTo('myDesigns');
    } catch (err) {
      showToast(err.message || 'Failed to save design', 'error');
    }
  };

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="space-y-5 animate-fade-in">
      <Breadcrumb onClick={() => navigateTo('dashboard')} label="Dashboard" />
      <h2 className="text-[24px] font-extrabold text-slate-900 tracking-tight">Upload Design</h2>
      <div className="bg-white rounded-2xl border border-slate-200/50 p-6 max-w-3xl">
        <div className="grid grid-cols-2 gap-4">
          <FormField label="Design Name"><input className={inputCls} placeholder="e.g. Floral Summer Print" value={form.name} onChange={e => update('name', e.target.value)} /></FormField>
          <FormField label="Collection">
            <select className={inputCls} value={form.collection} onChange={e => update('collection', e.target.value)}>
              <option>Summer</option><option>Festive</option><option>Casual</option><option>Heritage</option><option>Fusion</option><option>Formals</option>
            </select>
          </FormField>
          <FormField label="Season">
            <select className={inputCls} value={form.season} onChange={e => update('season', e.target.value)}><option>SS25</option><option>AW24</option><option>SS26</option></select>
          </FormField>
          <FormField label="Design Type">
            <select className={inputCls} value={form.designType} onChange={e => update('designType', e.target.value)}><option>Print</option><option>Embroidery</option><option>Solid</option><option>Textured</option></select>
          </FormField>
          <FormField label="Target Category">
            <select className={inputCls} value={form.targetCategory} onChange={e => update('targetCategory', e.target.value)}><option>Ethnic</option><option>Western</option><option>Casuals</option><option>Formals</option><option>Kids</option></select>
          </FormField>
          <FormField label="Tags"><input className={inputCls} placeholder="e.g. floral, summer, pastel" value={form.tags} onChange={e => update('tags', e.target.value)} /></FormField>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-600 mb-1.5">Design File</label>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-purple-300 hover:bg-purple-50/30 transition-all cursor-pointer group">
            <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Icons.Upload />
            </div>
            <p className="text-sm font-medium text-slate-700">Drop your design file here or <span className="text-purple-600">browse</span></p>
            <p className="text-xs text-slate-400 mt-1">PNG, AI, PDF up to 50MB</p>
          </div>
        </div>

        <div className="mt-4">
          <FormField label="Description">
            <textarea className={`${inputCls} resize-none`} rows={3} placeholder="Describe the design concept, colors, patterns…" value={form.description} onChange={e => update('description', e.target.value)} />
          </FormField>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
          <button onClick={() => handleSubmit('Draft')} className={btnSecondary}>Save as Draft</button>
          <button onClick={() => handleSubmit('Under Review')} className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm font-medium hover:shadow-lg hover:shadow-purple-300/30 transition-all active:scale-[0.98]">Submit for Review</button>
        </div>
      </div>
    </div>
  );
};

export default DesignerUploadDesign;
