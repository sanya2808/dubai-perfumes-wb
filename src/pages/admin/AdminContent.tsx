export const AdminContent = () => {
  return (
    <div className="space-y-6">
      <h2 className="font-display text-xl font-bold text-foreground">Website Content</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { title: 'Hero Section', fields: ['Headline', 'Subheadline', 'CTA Text'] },
          { title: 'Announcements', fields: ['Banner Text', 'Badge Text'] },
          { title: 'Offers Section', fields: ['Section Title', 'Offer Description'] },
          { title: 'Store Info', fields: ['Address', 'Phone', 'Hours'] },
        ].map(section => (
          <div key={section.title} className="bg-card rounded-xl p-6 border border-border shadow-luxury-card space-y-4">
            <h3 className="font-display text-sm font-bold uppercase tracking-wider text-foreground">{section.title}</h3>
            {section.fields.map(f => (
              <div key={f}>
                <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1 block">{f}</label>
                <input className="w-full px-3 py-2.5 bg-muted border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder={f} />
              </div>
            ))}
            <button className="btn-premium px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wider rounded-lg">Save</button>
          </div>
        ))}
      </div>
    </div>
  );
};
