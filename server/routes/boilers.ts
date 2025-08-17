import { Router } from 'express';
import { supabase } from '../lib/supabase';

const router = Router();

const COLUMNS = [
  'id',
  'brand',
  'model',
  'type',
  'kw',
  'dhw_output_kw',
  'flow_lpm',
  'sku',
  'price',
  'warranty_years',
  'notes',
  'created_at',
  'updated_at',
].join(', ');

router.get('/', async (_req, res) => {
  try {
    const { data, error } = await supabase
      .from('boilers')
      .select(COLUMNS)
      .order('brand', { ascending: true })
      .order('model', { ascending: true });

    if (error) return res.status(200).json({ success: false, error: error.message });

    const normalized = (data ?? []).map((r: any) => ({
      ...r,
      kw: r.kw == null ? null : Number(r.kw),
      dhw_output_kw: r.dhw_output_kw == null ? null : Number(r.dhw_output_kw),
      flow_lpm: r.flow_lpm == null ? null : Number(r.flow_lpm),
      price: r.price == null ? null : Number(r.price),
      warranty_years: r.warranty_years == null ? 0 : Number(r.warranty_years),
    }));

    res.json({ success: true, data: normalized });
  } catch (e: any) {
    res.json({ success: false, error: e?.message ?? 'Unknown error' });
  }
});

router.patch('/:id', async (req, res) => {
  const id = req.params.id;
  const body = (req.body ?? {}) as Record<string, any>;

  const allowed = new Set([
    'brand','model','type','kw','dhw_output_kw','flow_lpm',
    'sku','price','warranty_years','notes'
  ]);
  const numeric = new Set(['kw','dhw_output_kw','flow_lpm','price','warranty_years']);

  const update: Record<string, any> = {};
  for (const [k, v] of Object.entries(body)) {
    if (!allowed.has(k) || v === undefined) continue;
    update[k] = numeric.has(k) ? (v === null ? null : Number(v)) : v;
  }

  const { data, error } = await supabase
    .from('boilers')
    .update(update)
    .eq('id', id)
    .select(COLUMNS)
    .single();

  if (error) return res.json({ success: false, error: error.message });
  res.json({ success: true, data });
});

export default router;


