import { useState } from 'react';
import { Header } from '@/components/navigation/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertTriangle, Flame, Wrench, Settings, Plus, Edit, Save, X } from 'lucide-react';

// Local pricing data from CSV files
const localBoilerData = [
  { make: 'Alpha', model: 'E-Tec Plus 28kW Combi', boiler_type: 'Combi', tier: 'Budget', dwh_kw: 28.3, flow_rate_lpm: 12.1, warranty_years: 10, efficiency_rating: 'A', supply_price: 100000 },
  { make: 'Ariston', model: 'Clas One 30kW Combi', boiler_type: 'Combi', tier: 'Budget', dwh_kw: 30, flow_rate_lpm: 12.5, warranty_years: 8, efficiency_rating: 'A', supply_price: 92800 },
  { make: 'ATAG', model: 'iC 24kW Combi', boiler_type: 'Combi', tier: 'Premium', dwh_kw: 24, flow_rate_lpm: 10.1, warranty_years: 14, efficiency_rating: 'A', supply_price: 130000 },
  { make: 'Baxi', model: '800 Combi 2 24kW', boiler_type: 'Combi', tier: 'Mid-Range', dwh_kw: 24, flow_rate_lpm: 10.2, warranty_years: 10, efficiency_rating: 'A', supply_price: 98000 },
  { make: 'Ideal', model: 'Logic Max Combi2 C24', boiler_type: 'Combi', tier: 'Mid-Range', dwh_kw: 24.2, flow_rate_lpm: 9.9, warranty_years: 10, efficiency_rating: 'A', supply_price: 134880 },
  { make: 'Ideal', model: 'Vogue Max Combi 26kW', boiler_type: 'Combi', tier: 'Premium', dwh_kw: 26, flow_rate_lpm: 10.6, warranty_years: 12, efficiency_rating: 'A', supply_price: 99609 },
];

const localLabourData = [
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Budget', city: 'London (Central)', price: 120000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Central)', price: 135000 },
  { job_type: 'Combi Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Central)', price: 160000 },
  { job_type: 'System Boiler Replacement (like-for-like)', tier: 'Standard', city: 'London (Central)', price: 125000 },
  { job_type: 'System Boiler Replacement (like-for-like)', tier: 'Premium', city: 'London (Central)', price: 165000 },
  { job_type: 'Back Boiler to Combi Conversion', tier: 'Premium', city: 'London', price: 350000 },
  { job_type: 'Combi to System Conversion', tier: 'Premium', city: 'London', price: 230000 },
  { job_type: 'Central Heating Powerflush (up to 8 radiators)', tier: 'Standard', city: 'London', price: 50000 },
];

const localSundriesData = [
  { item_name: 'Fernox TF1 Compact Filter', tier: 'Magnetic Filter', price: 15000 },
  { item_name: 'Central Heating Power Flush', tier: 'Up to 10 radiators', price: 50000 },
  { item_name: 'Google Nest Learning Thermostat', tier: 'Smart Thermostat', price: 22000 },
  { item_name: 'Honeywell Home T4R', tier: 'Wireless Thermostat', price: 16000 },
  { item_name: 'Drayton Digistat+ RF', tier: 'Wireless Thermostat', price: 10000 },
  { item_name: 'Sentinel X100 Inhibitor', tier: 'System Chemical 1L', price: 2500 },
  { item_name: 'Copper Pipe', tier: '22mm x 3m length', price: 2800 },
  { item_name: 'Copper Pipe', tier: '15mm x 3m length', price: 1800 },
];

export default function EmergencyAdminDashboard() {
  const [editingBoiler, setEditingBoiler] = useState<number | null>(null);
  const [editingLabour, setEditingLabour] = useState<number | null>(null);
  const [editingSundries, setEditingSundries] = useState<number | null>(null);
  
  const [boilers, setBoilers] = useState(localBoilerData);
  const [labour, setLabour] = useState(localLabourData);
  const [sundries, setSundries] = useState(localSundriesData);

  const formatPrice = (price: number) => `£${(price / 100).toLocaleString('en-GB', { minimumFractionDigits: 2 })}`;

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Budget': return 'bg-green-100 text-green-800';
      case 'Mid-Range': return 'bg-blue-100 text-blue-800';
      case 'Premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const updateBoilerPrice = (index: number, newPrice: string) => {
    const updatedBoilers = [...boilers];
    updatedBoilers[index].supply_price = parseInt(newPrice) * 100;
    setBoilers(updatedBoilers);
    setEditingBoiler(null);
  };

  const updateLabourPrice = (index: number, newPrice: string) => {
    const updatedLabour = [...labour];
    updatedLabour[index].price = parseInt(newPrice) * 100;
    setLabour(updatedLabour);
    setEditingLabour(null);
  };

  const updateSundriesPrice = (index: number, newPrice: string) => {
    const updatedSundries = [...sundries];
    updatedSundries[index].price = parseInt(newPrice) * 100;
    setSundries(updatedSundries);
    setEditingSundries(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-900 via-orange-900 to-red-900">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center mb-4">
            <AlertTriangle className="h-8 w-8 text-red-400 mr-3" />
            <h1 className="text-3xl font-bold text-white">Emergency Admin Dashboard</h1>
          </div>
          <p className="text-slate-300">Database bypass mode - Local pricing management</p>
        </div>

        <Tabs defaultValue="boilers" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50">
            <TabsTrigger value="boilers" className="text-white data-[state=active]:bg-red-600">
              <Flame className="h-4 w-4 mr-2" />
              Boilers
            </TabsTrigger>
            <TabsTrigger value="labour" className="text-white data-[state=active]:bg-red-600">
              <Wrench className="h-4 w-4 mr-2" />
              Labour Costs
            </TabsTrigger>
            <TabsTrigger value="sundries" className="text-white data-[state=active]:bg-red-600">
              <Settings className="h-4 w-4 mr-2" />
              Sundries
            </TabsTrigger>
          </TabsList>

          <TabsContent value="boilers">
            <Card className="glass-card border-red-500/50">
              <CardHeader>
                <CardTitle className="text-white">Boiler Pricing Management</CardTitle>
                <CardDescription className="text-slate-300">
                  Manage boiler specifications and pricing for quotation calculations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left p-2 text-slate-200">Make & Model</th>
                        <th className="text-left p-2 text-slate-200">Type</th>
                        <th className="text-left p-2 text-slate-200">Tier</th>
                        <th className="text-left p-2 text-slate-200">kW</th>
                        <th className="text-left p-2 text-slate-200">Flow Rate</th>
                        <th className="text-left p-2 text-slate-200">Warranty</th>
                        <th className="text-left p-2 text-slate-200">Price</th>
                        <th className="text-left p-2 text-slate-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {boilers.map((boiler, index) => (
                        <tr key={index} className="border-b border-slate-700">
                          <td className="p-2 text-white">
                            <div className="font-medium">{boiler.make}</div>
                            <div className="text-sm text-slate-300">{boiler.model}</div>
                          </td>
                          <td className="p-2 text-slate-200">{boiler.boiler_type}</td>
                          <td className="p-2">
                            <Badge className={getTierColor(boiler.tier)}>{boiler.tier}</Badge>
                          </td>
                          <td className="p-2 text-slate-200">{boiler.dwh_kw}kW</td>
                          <td className="p-2 text-slate-200">{boiler.flow_rate_lpm}L/min</td>
                          <td className="p-2 text-slate-200">{boiler.warranty_years}y</td>
                          <td className="p-2">
                            {editingBoiler === index ? (
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  defaultValue={boiler.supply_price / 100}
                                  className="w-24 bg-slate-800 text-white"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      updateBoilerPrice(index, (e.target as HTMLInputElement).value);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const input = document.querySelector(`input[type="number"]`) as HTMLInputElement;
                                    updateBoilerPrice(index, input.value);
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingBoiler(null)}
                                  className="bg-gray-600 hover:bg-gray-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-green-400 font-medium">{formatPrice(boiler.supply_price)}</span>
                            )}
                          </td>
                          <td className="p-2">
                            {editingBoiler !== index && (
                              <Button
                                size="sm"
                                onClick={() => setEditingBoiler(index)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="labour">
            <Card className="glass-card border-red-500/50">
              <CardHeader>
                <CardTitle className="text-white">Labour Cost Management</CardTitle>
                <CardDescription className="text-slate-300">
                  Manage installation labour costs by job type and location
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left p-2 text-slate-200">Job Type</th>
                        <th className="text-left p-2 text-slate-200">Tier</th>
                        <th className="text-left p-2 text-slate-200">Location</th>
                        <th className="text-left p-2 text-slate-200">Price</th>
                        <th className="text-left p-2 text-slate-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {labour.map((job, index) => (
                        <tr key={index} className="border-b border-slate-700">
                          <td className="p-2 text-white font-medium">{job.job_type}</td>
                          <td className="p-2">
                            <Badge className={getTierColor(job.tier)}>{job.tier}</Badge>
                          </td>
                          <td className="p-2 text-slate-200">{job.city}</td>
                          <td className="p-2">
                            {editingLabour === index ? (
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  defaultValue={job.price / 100}
                                  className="w-24 bg-slate-800 text-white"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      updateLabourPrice(index, (e.target as HTMLInputElement).value);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const input = document.querySelector(`input[type="number"]`) as HTMLInputElement;
                                    updateLabourPrice(index, input.value);
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingLabour(null)}
                                  className="bg-gray-600 hover:bg-gray-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-green-400 font-medium">{formatPrice(job.price)}</span>
                            )}
                          </td>
                          <td className="p-2">
                            {editingLabour !== index && (
                              <Button
                                size="sm"
                                onClick={() => setEditingLabour(index)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sundries">
            <Card className="glass-card border-red-500/50">
              <CardHeader>
                <CardTitle className="text-white">Sundries & Components</CardTitle>
                <CardDescription className="text-slate-300">
                  Manage additional components and system accessories pricing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-600">
                        <th className="text-left p-2 text-slate-200">Item Name</th>
                        <th className="text-left p-2 text-slate-200">Category</th>
                        <th className="text-left p-2 text-slate-200">Price</th>
                        <th className="text-left p-2 text-slate-200">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sundries.map((item, index) => (
                        <tr key={index} className="border-b border-slate-700">
                          <td className="p-2 text-white font-medium">{item.item_name}</td>
                          <td className="p-2 text-slate-200">{item.tier}</td>
                          <td className="p-2">
                            {editingSundries === index ? (
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  defaultValue={item.price / 100}
                                  className="w-24 bg-slate-800 text-white"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      updateSundriesPrice(index, (e.target as HTMLInputElement).value);
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    const input = document.querySelector(`input[type="number"]`) as HTMLInputElement;
                                    updateSundriesPrice(index, input.value);
                                  }}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Save className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => setEditingSundries(null)}
                                  className="bg-gray-600 hover:bg-gray-700"
                                >
                                  <X className="h-3 w-3" />
                                </Button>
                              </div>
                            ) : (
                              <span className="text-green-400 font-medium">{formatPrice(item.price)}</span>
                            )}
                          </td>
                          <td className="p-2">
                            {editingSundries !== index && (
                              <Button
                                size="sm"
                                onClick={() => setEditingSundries(index)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 text-center">
          <div className="bg-slate-800/50 rounded-lg p-4 border border-red-500/50">
            <p className="text-slate-300 text-sm">
              ⚠️ Emergency Admin Mode: Changes are stored locally. Database connectivity will restore full functionality.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}