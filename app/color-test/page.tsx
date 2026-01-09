'use client';

export default function ColorTestPage() {
  const brandColors = [
    { name: 'Brand Orange', hex: '#f78e2c', description: 'Primary brand color' },
    { name: 'Deep Slate Blue', hex: '#0b1219', description: 'Main background' },
    { name: 'Dark Slate', hex: '#15222e', description: 'Section backgrounds' },
    { name: 'Darker Slate', hex: '#080d11', description: 'FAQ background' },
    { name: 'White', hex: '#ffffff', description: 'Text on dark' },
    { name: 'Black', hex: '#000000', description: 'Text on orange' },
    { name: 'Gray 200', hex: '#e5e7eb', description: 'Light gray text' },
    { name: 'Gray 300', hex: '#d1d5db', description: 'Medium gray text' },
    { name: 'Gray 400', hex: '#9ca3af', description: 'Secondary text' },
    { name: 'Amber 500', hex: '#f59e0b', description: 'Gradient accent' },
  ];

  return (
    <div className="min-h-screen bg-[#0b1219] p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Color Test Page</h1>
        <p className="text-gray-400 mb-8">
          This page displays solid hex color blocks to verify consistent rendering across devices.
          All colors are solid (no opacity, gradients, or filters).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brandColors.map((color) => (
            <div
              key={color.hex}
              className="bg-white/5 border border-white/10 rounded-lg overflow-hidden"
            >
              <div
                className="h-32 w-full"
                style={{ backgroundColor: color.hex }}
              />
              <div className="p-4">
                <h3 className="text-white font-semibold mb-1">{color.name}</h3>
                <p className="text-gray-400 text-sm mb-2">{color.description}</p>
                <div className="flex items-center gap-2">
                  <code className="text-[#f78e2c] font-mono text-sm">{color.hex}</code>
                  <div
                    className="w-6 h-6 rounded border border-white/20"
                    style={{ backgroundColor: color.hex }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-white/5 border border-white/10 rounded-lg">
          <h2 className="text-2xl font-bold text-white mb-4">Testing Instructions</h2>
          <ul className="text-gray-300 space-y-2 list-disc list-inside">
            <li>View this page on different devices (iPhone, Android, desktop)</li>
            <li>Compare the Brand Orange (#f78e2c) block across devices</li>
            <li>Colors should appear identical or very close across all devices</li>
            <li>If colors look different, check image color profiles and ICC settings</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

