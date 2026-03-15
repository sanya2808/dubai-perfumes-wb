import { useState } from 'react';
import { Search, Plus, X, Camera, Star, Trash2, Edit, Check } from 'lucide-react';
import { allProducts, Product, ProductCategory } from '@/data/products';

export const AdminProducts = ({ inventory }: { inventory: any[] }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [isDesignerAttar, setIsDesignerAttar] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '', category: 'Perfume', gender: 'Unisex', description: '',
    fragranceNotes: { top: [], middle: [], base: [] }, sizes: [], images: [],
    isBestSeller: false, isNew: false, tags: [],
  });

  const getDefaultSizes = (category: string, isDesigner: boolean) => {
    if (isDesigner && category === 'attar') return [{ size: '', price: 0 }];
    switch (category) {
      case 'Perfume': return [{ size: '8 ml', price: 0 }, { size: '20 ml', price: 0 }, { size: '50 ml', price: 0 }, { size: '100 ml', price: 0 }];
      case 'attar': return [{ size: '3 ml', price: 0 }, { size: '6 ml', price: 0 }, { size: '12 ml', price: 0 }, { size: '15 ml', price: 0 }, { size: '18 ml', price: 0 }, { size: '20 ml', price: 0 }];
      case 'Car & Home Fragrance':
      case 'Candles':
      case 'Bakhoor':
      case 'Aroma Oils': return [{ size: '1 piece', price: 0 }, { size: '2 pieces', price: 0 }, { size: '5 pieces', price: 0 }];
      default: return [{ size: '50 ml', price: 0 }];
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file, index) => ({
        url: URL.createObjectURL(file), // create temporary preview URL
        isMain: productForm.images?.length === 0 && index === 0, // make first image main if none exist
        file
      }));
      setProductForm(prev => ({ ...prev, images: [...(prev.images || []), ...newImages] }));
    }
  };

  const setMainImage = (index: number) => {
    setProductForm(prev => {
      const newImages = (prev.images || []).map((img, i) => ({ ...img, isMain: i === index }));
      return { ...prev, images: newImages };
    });
  };

  const removeImage = (index: number) => {
    setProductForm(prev => {
      const newImages = [...(prev.images || [])];
      newImages.splice(index, 1);
      if (newImages.length > 0 && !newImages.some(i => i.isMain)) {
        newImages[0].isMain = true;
      }
      return { ...prev, images: newImages };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto flex-1">
          <div className="relative w-full sm:w-80">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by ID or Name..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted-foreground" />
          </div>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option value="All">All Categories</option>
            <option value="Perfume">Perfume</option>
            <option value="attar">Attar</option>
            <option value="Car & Home Fragrance">Car & Home Fragrance</option>
            <option value="Candles">Candles</option>
            <option value="Bakhoor">Bakhoor</option>
            <option value="Aroma Oils">Aroma Oils</option>
          </select>
        </div>
        <button onClick={() => { 
            setEditingProduct(null); 
            setProductForm({
              name: '', category: 'Perfume', gender: 'Unisex', description: '',
              fragranceNotes: { top: [], middle: [], base: [] }, 
              sizes: getDefaultSizes('Perfume', false), images: [],
              isBestSeller: false, isNew: false, tags: [],
            });
            setIsDesignerAttar(false);
            setShowProductForm(true); 
          }}
          className="btn-premium flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-lg">
          <Plus size={14} /> Add Product
        </button>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <div className="bg-card rounded-xl p-6 border border-primary/20 shadow-luxury-card space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-foreground">{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <button onClick={() => setShowProductForm(false)} className="text-muted-foreground hover:text-foreground"><X size={18} /></button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Perfume Name</label>
              <input value={productForm.name} onChange={e => setProductForm({...productForm, name: e.target.value})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Name" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Category</label>
              <select value={productForm.category} onChange={e => {
                const newCat = e.target.value as ProductCategory;
                setProductForm({...productForm, category: newCat, sizes: getDefaultSizes(newCat, isDesignerAttar)});
              }} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="Perfume">Perfume</option>
                <option value="attar">Attar</option>
                <option value="Car & Home Fragrance">Car & Home Fragrance</option>
                <option value="Candles">Candles</option>
                <option value="Bakhoor">Bakhoor</option>
                <option value="Aroma Oils">Aroma Oils</option>
                <option value="inspired">Inspired</option>
                <option value="international">International</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Gender</label>
              <select value={productForm.gender} onChange={e => setProductForm({...productForm, gender: e.target.value as any})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="Men">Men</option><option value="Women">Women</option><option value="Unisex">Unisex</option>
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Inspired By (Optional)</label>
              <input value={productForm.inspiredBy || ''} onChange={e => setProductForm({...productForm, inspiredBy: e.target.value})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. Baccarat Rouge 540" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Longevity</label>
              <input value={productForm.longevity || ''} onChange={e => setProductForm({...productForm, longevity: e.target.value})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="e.g. 8-10 hours" />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Sillage</label>
              <select value={productForm.sillage} onChange={e => setProductForm({...productForm, sillage: e.target.value as any})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30">
                <option value="Soft">Soft</option><option value="Moderate">Moderate</option><option value="Strong">Strong</option><option value="Beast Mode">Beast Mode</option>
              </select>
            </div>
            <div className="md:col-span-2 lg:col-span-3">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">Description</label>
              <input value={productForm.description} onChange={e => setProductForm({...productForm, description: e.target.value})} className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Product description" />
            </div>
          </div>

          {/* Fragrance Notes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['top', 'middle', 'base'].map((noteType) => (
              <div key={noteType}>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-primary mb-1 block">{noteType} Notes</label>
                <input 
                  value={productForm.fragranceNotes?.[noteType as keyof typeof productForm.fragranceNotes]?.join(', ') || ''} 
                  onChange={e => {
                    const arr = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                    setProductForm({
                      ...productForm, 
                      fragranceNotes: { ...productForm.fragranceNotes!, [noteType]: arr }
                    });
                  }}
                  className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" 
                  placeholder="Comma-separated" 
                />
              </div>
            ))}
          </div>

          {/* Sizes & Price */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold uppercase tracking-wider text-foreground block">Pricing & Sizes</label>
              {productForm.category === 'attar' && (
                <label className="flex items-center gap-2 text-sm text-accent cursor-pointer border border-accent/20 bg-accent/5 px-3 py-1.5 rounded-lg">
                  <input 
                    type="checkbox" 
                    checked={isDesignerAttar}
                    onChange={e => {
                      setIsDesignerAttar(e.target.checked);
                      setProductForm({...productForm, sizes: getDefaultSizes(productForm.category || 'attar', e.target.checked)});
                    }} 
                    className="w-4 h-4 rounded border-border text-accent focus:ring-accent/30" 
                  /> 
                  Designer Bottle Sizing
                </label>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {productForm.sizes?.map((sizeObj, i) => (
                <div key={i} className="flex items-center gap-2 bg-muted p-2 rounded-lg border border-border">
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground px-1 block mb-0.5">Size/Qty</label>
                    <input 
                      value={sizeObj.size} 
                      disabled={!isDesignerAttar && productForm.category !== 'Aroma Oils'}
                      onChange={e => {
                        const newSizes = [...(productForm.sizes || [])];
                        newSizes[i].size = e.target.value;
                        setProductForm({...productForm, sizes: newSizes});
                      }}
                      className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground disabled:opacity-70" 
                      placeholder="Size"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="text-[9px] uppercase tracking-wider text-muted-foreground px-1 block mb-0.5">Price (₹)</label>
                    <input 
                      type="number" 
                      value={sizeObj.price || ''}
                      onChange={e => {
                        const newSizes = [...(productForm.sizes || [])];
                        newSizes[i].price = Number(e.target.value);
                        setProductForm({...productForm, sizes: newSizes});
                      }}
                      className="w-full px-2 py-1.5 bg-background border border-border rounded text-sm text-foreground" 
                      placeholder="0"
                    />
                  </div>
                  {isDesignerAttar && (
                    <button onClick={() => {
                      const newSizes = [...(productForm.sizes || [])];
                      newSizes.splice(i, 1);
                      setProductForm({...productForm, sizes: newSizes});
                    }} className="p-2 mt-4 text-muted-foreground hover:text-destructive"><X size={14}/></button>
                  )}
                </div>
              ))}
            </div>
            {isDesignerAttar && (
              <button onClick={() => setProductForm({...productForm, sizes: [...(productForm.sizes || []), {size: '', price: 0}]})} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
                <Plus size={12}/> Add Custom Size
              </button>
            )}
          </div>

          {/* Image upload */}
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground block mb-2">Product Images</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {productForm.images?.map((img, i) => (
                <div key={i} className={`relative group aspect-square rounded-lg border-2 overflow-hidden ${img.isMain ? 'border-primary' : 'border-border'}`}>
                  <img src={img.url} className="w-full h-full object-cover" alt="Product upload preview" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                    {!img.isMain && (
                      <button onClick={() => setMainImage(i)} className="text-[10px] bg-primary text-black px-2 py-1 rounded-full font-bold shadow-lg">Set Main</button>
                    )}
                    <button onClick={() => removeImage(i)} className="text-[10px] bg-destructive text-white px-2 py-1 rounded-full font-bold shadow-lg"><Trash2 size={12}/></button>
                  </div>
                  {img.isMain && <div className="absolute top-1 right-1 bg-primary text-black p-1 rounded-full shadow-lg"><Star size={10} className="fill-black" /></div>}
                </div>
              ))}
              <label className="border-2 border-dashed border-border hover:border-primary hover:bg-primary/5 transition-colors rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer text-muted-foreground hover:text-primary">
                <Camera size={24} className="mb-2" />
                <span className="text-[10px] font-semibold uppercase">Upload</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>

          {/* Tags */}
          <div className="pt-4 border-t border-border">
            <label className="text-xs font-semibold uppercase tracking-wider text-foreground block mb-3">Product Tags</label>
            <div className="flex flex-wrap gap-4">
              {['Bestseller', 'New Arrival', 'Limited Edition', 'Trending', 'Exclusive', 'Sale'].map(tag => (
                <label key={tag} className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={productForm.tags?.includes(tag) || false} 
                    onChange={e => {
                      const currentTags = productForm.tags || [];
                      if (e.target.checked) {
                        setProductForm({...productForm, tags: [...currentTags, tag]});
                      } else {
                        setProductForm({...productForm, tags: currentTags.filter(t => t !== tag)});
                      }
                    }} 
                    className="w-4 h-4 rounded border-border text-primary focus:ring-primary/30" 
                  /> {tag}
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button onClick={() => setShowProductForm(false)} className="btn-premium px-6 py-3 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-lg">
              {editingProduct ? 'Save Product Changes' : 'Publish Product'}
            </button>
            <button onClick={() => setShowProductForm(false)} className="px-6 py-3 border border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider rounded-lg hover:text-foreground hover:bg-muted transition-colors">
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Products Table */}
      <div className="bg-card rounded-xl shadow-luxury-card overflow-hidden border border-border">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/50">
                {['Product', 'Category', 'Available Sizes', 'Price Range', 'Stock', 'Best Seller', 'Actions'].map(h => (
                  <th key={h} className="text-left p-4 text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allProducts
                .filter(p => {
                  const q = searchQuery.toLowerCase();
                  const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
                  const matchesCategory = categoryFilter === 'All' || p.category.toLowerCase() === categoryFilter.toLowerCase();
                  return matchesSearch && matchesCategory;
                })
                .map(p => {
                  const inv = inventory.find(i => i.id === p.id);
                  return (
                    <tr key={p.id} className="border-b border-border/30 hover:bg-secondary/30 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={p.images?.find(i => i.isMain)?.url || p.images?.[0]?.url || p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-border" />
                          <div>
                            <p className="font-semibold text-foreground">{p.name}</p>
                            <p className="text-[10px] font-mono text-muted-foreground">{p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground capitalize">{p.category}</td>
                      <td className="p-4 text-xs text-muted-foreground">
                        <div className="flex flex-wrap gap-1">
                          {p.sizes.map(s => <span key={s.size} className="bg-muted px-1.5 py-0.5 rounded border border-border">{s.size}</span>)}
                        </div>
                      </td>
                      <td className="p-4 text-foreground font-semibold">
                        {p.sizes.length > 1 
                          ? `₹${Math.min(...p.sizes.map(s => s.price))} - ₹${Math.max(...p.sizes.map(s => s.price))}`
                          : `₹${p.sizes[0]?.price || 0}`
                        }
                      </td>
                      <td className="p-4">
                        <span className={`text-xs font-bold ${(inv?.stock || 0) < 10 ? 'text-destructive' : 'text-primary'}`}>
                          {inv?.stock || 0}
                        </span>
                      </td>
                      <td className="p-4">{(p.tags?.includes('Bestseller') || p.isBestSeller) ? <Check size={14} className="text-primary" /> : <span className="text-muted-foreground/30">—</span>}</td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <button onClick={() => { 
                            setEditingProduct(p); 
                            setProductForm({ ...p, sizes: [...p.sizes] });
                            setIsDesignerAttar(false); // Can infer later if needed
                            setShowProductForm(true); 
                          }} className="p-1.5 rounded border border-border hover:border-primary text-muted-foreground hover:text-primary transition-colors"><Edit size={13} /></button>
                          <button className="p-1.5 rounded border border-border hover:border-destructive text-muted-foreground hover:text-destructive transition-colors"><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
