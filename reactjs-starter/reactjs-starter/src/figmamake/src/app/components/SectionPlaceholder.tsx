interface SectionPlaceholderProps {
  title: string;
}

export function SectionPlaceholder({ title }: SectionPlaceholderProps) {
  return (
    <section className="w-full px-6 py-8">
      <div className="border-2 border-dashed border-border rounded-lg p-8 bg-muted/30">
        <h2 className="text-center text-muted-foreground">{title}</h2>
      </div>
    </section>
  );
}
