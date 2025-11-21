export const SERVICES_DATA = [
  {
    id: 'interior',
    title: 'Interior Detail',
    price: 199,
    description: 'Deep cleaning and conditioning for seats, carpets, dashboard, and all interior surfaces.',
    duration: '2-3 hours',
    target: 'interior', // Camera target
    features: [
      'Deep vacuum & steam cleaning',
      'Leather conditioning & protection',
      'Dashboard & trim restoration',
      'Pet hair removal specialist'
    ],
    addOns: [
      { name: 'Leather Conditioning', price: 49, target: 'interior_detail' },
      { name: 'Carpet Shampoo', price: 89, target: 'interior_detail' },
      { name: 'Pet Hair Removal', price: 69, target: 'interior_detail' },
      { name: 'Rubber Floor Mat Restoration', price: 29, target: 'interior_detail' }
    ]
  },
  {
    id: 'exterior',
    title: 'Exterior Detail',
    price: 149,
    description: 'Complete exterior restoration and protection for your vehicle\'s paint, wheels, and trim.',
    duration: '1.5-2 hours',
    target: 'exterior',
    features: [
      'Premium hand wash & dry',
      'Clay bar paint decontamination',
      'High-quality wax protection',
      'Wheel & tire detailing'
    ],
    addOns: [
      { name: 'Clay Bar Treatment', price: 39, target: 'paint' },
      { name: 'Machine Ceramic Wax', price: 149, target: 'paint' },
      { name: 'Headlight Restoration', price: 99, target: 'front' },
      { name: 'Engine Bay Detail', price: 99, target: 'engine' }, // Target engine triggers hood open
      { name: 'Scratch Buffing', price: 75, target: 'paint' }
    ]
  },
  {
    id: 'premium',
    title: 'Premium Protection',
    price: 499,
    description: 'Advanced paint correction, ceramic coating, and specialty treatments for ultimate vehicle protection.',
    duration: '4-6 hours',
    target: 'paint',
    features: [
      'Multi-stage paint correction',
      'Professional ceramic coating',
      'Swirl & scratch removal',
      'UV & chemical resistance',
      'Long-term protection warranty'
    ],
    addOns: [
      { name: 'Paint Correction Polish', price: 199, target: 'paint_detail' },
      { name: 'Ceramic Coating Layer', price: 299, target: 'paint_detail' }
    ]
  }
];

