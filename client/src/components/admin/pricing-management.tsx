import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Save, X, Plus, Package, Wrench, Zap } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

const formatGBP = (v: unknown) => {
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[£,\s]/g, '')) || 0;
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(n);
};

export function PricingManagement() {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: boilers } = useQuery({
    queryKey: ['/api/admin/boilers'],
    enabled: true,
  });

  const { data: labourCosts } = useQuery({
    queryKey: ['/api/admin/labour-costs'],
    enabled: true,
  });

  const { data: sundries } = useQuery({
    queryKey: ['/api/admin/sundries'],
    enabled: true,
  });

  const updateBoiler = async (id: string, payload: any) => {
    const res = await fetch(`/api/admin/boilers/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      credentials: 'include',
    });
    const json = await res.json();
    if (!res.ok || json?.success === false) throw new Error(json?.error || `Failed with ${res.status}`);
    return json.data ?? json;
  };

  const updateMutation = useMutation({
    mutationFn: async ({ id, values }: { id: string; values: any }) => updateBoiler(id, values),
    onSuccess: () => {
      toast({ title: 'Update successful', description: 'Boiler updated' });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/boilers'] });
      setEditingItem(null);
      setEditValues({});
    },
    onError: () => {
      toast({ title: 'Update failed', description: 'Failed to update boiler', variant: 'destructive' });
    },
  });

  const startEdit = (boiler: any) => {
    const rowKey = `boilers-${boiler.id}`;
    setEditingItem(rowKey);
    setEditValues({
      [`${rowKey}-brand`]: boiler.brand ?? '',
      [`${rowKey}-model`]: boiler.model ?? '',
      [`${rowKey}-type`]: boiler.type ?? '',
      [`${rowKey}-kw`]: boiler.kw != null ? String(boiler.kw) : '',
      [`${rowKey}-dhw_output_kw`]: boiler.dhw_output_kw != null ? String(boiler.dhw_output_kw) : '',
      [`${rowKey}-flow_lpm`]: boiler.flow_lpm != null ? String(boiler.flow_lpm) : '',
      [`${rowKey}-sku`]: boiler.sku ?? '',
      [`${rowKey}-price`]: boiler.price != null ? String(boiler.price) : '',
      [`${rowKey}-warranty_years`]: (boiler.warranty_years ?? boiler.warrantyYears) != null ? String(boiler.warranty_years ?? boiler.warrantyYears) : '',
    });
  };

  const saveEdit = async (_type: string, id: string) => {
    const rowKey = `boilers-${id}`;
    const get = (field: string) => editValues[`${rowKey}-${field}`];
    const parseNum = (v: string | undefined) => {
      if (v == null) return undefined;
      const n = Number(String(v).replace(/[£,\s]/g, ''));
      return Number.isFinite(n) ? n : undefined;
    };
    const payload: Record<string, any> = {};
    const maybeSet = (key: string, value: any) => {
      if (value === undefined) return;
      payload[key] = value === '' ? null : value;
    };
    maybeSet('brand', get('brand'));
    maybeSet('model', get('model'));
    maybeSet('type', get('type'));
    maybeSet('kw', parseNum(get('kw')));
    maybeSet('dhw_output_kw', parseNum(get('dhw_output_kw')));
    maybeSet('flow_lpm', parseNum(get('flow_lpm')));
    maybeSet('sku', get('sku'));
    maybeSet('price', parseNum(get('price')));
    maybeSet('warranty_years', parseNum(get('warranty_years')));

    updateMutation.mutate({ id, values: payload });
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setEditValues({});
  };

  const formatPrice = (price: number) => {
    return `£${(price / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Pricing Management</h2>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Add New Item
        </Button>
      </div>

      <Tabs defaultValue="boilers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border-slate-600">
          <TabsTrigger value="boilers" className="text-slate-300">
            <Package className="h-4 w-4 mr-2" />
            Boilers
          </TabsTrigger>
          <TabsTrigger value="labour" className="text-slate-300">
            <Wrench className="h-4 w-4 mr-2" />
            Labour
          </TabsTrigger>
          <TabsTrigger value="sundries" className="text-slate-300">
            <Zap className="h-4 w-4 mr-2" />
            Sundries
          </TabsTrigger>
        </TabsList>

        <TabsContent value="boilers">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Boiler Pricing</CardTitle>
              <CardDescription className="text-slate-300">
                Manage boiler supply prices and specifications
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600">
                      <TableHead className="text-slate-300">Make</TableHead>
                      <TableHead className="text-slate-300">Model</TableHead>
                      <TableHead className="text-slate-300">Type</TableHead>
                      <TableHead className="text-slate-300">Tier</TableHead>
                      <TableHead className="text-slate-300">kW</TableHead>
                      <TableHead className="text-slate-300">DHW kW</TableHead>
                      <TableHead className="text-slate-300">Flow LPM</TableHead>
                      <TableHead className="text-slate-300">Supply Price</TableHead>
                      <TableHead className="text-slate-300">Warranty</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {boilers?.map((boiler: any) => (
                      <TableRow key={boiler.id} className="border-slate-600">
                        <TableCell className="text-white">
                          {editingItem === `boilers-${boiler.id}` ? (
                            <Input
                              value={editValues[`boilers-${boiler.id}-brand`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`boilers-${boiler.id}-brand`]: e.target.value }))}
                              className="w-40 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="Brand"
                            />
                          ) : (
                            boiler.brand
                          )}
                        </TableCell>
                        <TableCell className="text-white">
                          {editingItem === `boilers-${boiler.id}` ? (
                            <Input
                              value={editValues[`boilers-${boiler.id}-model`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`boilers-${boiler.id}-model`]: e.target.value }))}
                              className="w-48 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="Model"
                            />
                          ) : (
                            boiler.model
                          )}
                        </TableCell>
                        <TableCell className="text-white">
                          {editingItem === `boilers-${boiler.id}` ? (
                            <Input
                              value={editValues[`boilers-${boiler.id}-type`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`boilers-${boiler.id}-type`]: e.target.value }))}
                              className="w-28 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="combi/system"
                            />
                          ) : (
                            boiler.type
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {boiler.tier ?? '—'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white whitespace-nowrap">
                          {editingItem === `boilers-${boiler.id}` ? (
                            <Input
                              value={editValues[`boilers-${boiler.id}-kw`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`boilers-${boiler.id}-kw`]: e.target.value }))}
                              className="w-20 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="kW"
                            />
                          ) : (
                            boiler.kw != null ? `${boiler.kw}kW` : '—'
                          )}
                        </TableCell>
                        <TableCell className="text-white whitespace-nowrap">
                          {editingItem === `boilers-${boiler.id}` ? (
                            <Input
                              value={editValues[`boilers-${boiler.id}-dhw_output_kw`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`boilers-${boiler.id}-dhw_output_kw`]: e.target.value }))}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="DHW kW"
                            />
                          ) : (
                            boiler.dhw_output_kw != null ? `${boiler.dhw_output_kw}kW` : '—'
                          )}
                        </TableCell>
                        <TableCell className="text-white whitespace-nowrap">
                          {editingItem === `boilers-${boiler.id}` ? (
                            <Input
                              value={editValues[`boilers-${boiler.id}-flow_lpm`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`boilers-${boiler.id}-flow_lpm`]: e.target.value }))}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="LPM"
                            />
                          ) : (
                            boiler.flow_lpm != null ? `${boiler.flow_lpm} LPM` : '—'
                          )}
                        </TableCell>
                        <TableCell className="text-white text-right whitespace-nowrap">
                          {editingItem === `boilers-${boiler.id}` ? (
                            <Input
                              value={editValues[`boilers-${boiler.id}-price`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`boilers-${boiler.id}-price`]: e.target.value }))}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="0.00"
                            />
                          ) : (
                            formatGBP(boiler.price)
                          )}
                        </TableCell>
                        <TableCell className="text-white">
                          {editingItem === `boilers-${boiler.id}` ? (
                            <Input
                              value={editValues[`boilers-${boiler.id}-warranty_years`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`boilers-${boiler.id}-warranty_years`]: e.target.value }))}
                              className="w-20 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="years"
                            />
                          ) : (
                            (boiler.warranty_years ?? boiler.warrantyYears) + ' years'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {editingItem === `boilers-${boiler.id}` ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit('boilers', boiler.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={cancelEdit}
                                  variant="outline"
                                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => startEdit(boiler)}
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="labour">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Labour Costs</CardTitle>
              <CardDescription className="text-slate-300">
                Manage labour pricing by job type and tier
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600">
                      <TableHead className="text-slate-300">Job Type</TableHead>
                      <TableHead className="text-slate-300">Tier</TableHead>
                      <TableHead className="text-slate-300">City</TableHead>
                      <TableHead className="text-slate-300">Price</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {labourCosts?.map((labour: any) => (
                      <TableRow key={labour.id} className="border-slate-600">
                        <TableCell className="text-white">{labour.jobType}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {labour.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">{labour.city}</TableCell>
                        <TableCell className="text-white">
                          {editingItem === `labour-${labour.id}` ? (
                            <Input
                              value={editValues[`labour-${labour.id}`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`labour-${labour.id}`]: e.target.value }))}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="0.00"
                            />
                          ) : (
                            formatPrice(labour.price)
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {editingItem === `labour-${labour.id}` ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit('labour-costs', labour.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={cancelEdit}
                                  variant="outline"
                                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => startEdit(`labour-${labour.id}`, formatPrice(labour.price))}
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sundries">
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-white">Sundries & Extras</CardTitle>
              <CardDescription className="text-slate-300">
                Manage pricing for additional items and services
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-600">
                      <TableHead className="text-slate-300">Item Name</TableHead>
                      <TableHead className="text-slate-300">Category</TableHead>
                      <TableHead className="text-slate-300">Price</TableHead>
                      <TableHead className="text-slate-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sundries?.map((sundry: any) => (
                      <TableRow key={sundry.id} className="border-slate-600">
                        <TableCell className="text-white">{sundry.itemName}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-slate-300">
                            {sundry.tier}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          {editingItem === `sundries-${sundry.id}` ? (
                            <Input
                              value={editValues[`sundries-${sundry.id}`] || ''}
                              onChange={(e) => setEditValues(prev => ({ ...prev, [`sundries-${sundry.id}`]: e.target.value }))}
                              className="w-24 bg-slate-800/50 border-slate-600 text-white"
                              placeholder="0.00"
                            />
                          ) : (
                            formatPrice(sundry.price)
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {editingItem === `sundries-${sundry.id}` ? (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => saveEdit('sundries', sundry.id)}
                                  className="bg-green-600 hover:bg-green-700 text-white"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={cancelEdit}
                                  variant="outline"
                                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => startEdit(`sundries-${sundry.id}`, formatPrice(sundry.price))}
                                variant="outline"
                                className="border-slate-600 text-slate-300 hover:bg-slate-800"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}