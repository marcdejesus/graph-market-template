import { Product, ProductCategory } from '@/types'

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Performance Training T-Shirt',
    description: 'Lightweight, moisture-wicking training shirt perfect for intense workouts.',
    price: 29.99,
    compareAtPrice: 39.99,
    category: 'tops' as ProductCategory,
    images: [
      {
        id: '1',
        url: '/images/products/training-tshirt-black.jpg',
        altText: 'Performance Training T-Shirt in Athletic Black',
        width: 800,
        height: 800,
        position: 1
      }
    ],
    variants: [
      {
        id: '1-s',
        productId: '1',
        name: 'Size',
        value: 'S',
        type: 'size',
        stock: 15
      },
      {
        id: '1-m',
        productId: '1',
        name: 'Size',
        value: 'M',
        type: 'size',
        stock: 25
      },
      {
        id: '1-l',
        productId: '1',
        name: 'Size',
        value: 'L',
        type: 'size',
        stock: 20
      },
      {
        id: '1-xl',
        productId: '1',
        name: 'Size',
        value: 'XL',
        type: 'size',
        stock: 10
      }
    ],
    inStock: true,
    stock: 70,
    tags: ['new', 'performance', 'moisture-wicking'],
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '2',
    name: 'Athletic Performance Leggings',
    description: 'High-waisted leggings with compression technology for ultimate comfort and support.',
    price: 69.99,
    compareAtPrice: 89.99,
    category: 'bottoms' as ProductCategory,
    images: [
      {
        id: '2',
        url: '/images/products/performance-leggings-black.jpg',
        altText: 'Athletic Performance Leggings in Athletic Black',
        width: 800,
        height: 800,
        position: 1
      }
    ],
    variants: [
      {
        id: '2-xs',
        productId: '2',
        name: 'Size',
        value: 'XS',
        type: 'size',
        stock: 8
      },
      {
        id: '2-s',
        productId: '2',
        name: 'Size',
        value: 'S',
        type: 'size',
        stock: 12
      },
      {
        id: '2-m',
        productId: '2',
        name: 'Size',
        value: 'M',
        type: 'size',
        stock: 18
      },
      {
        id: '2-l',
        productId: '2',
        name: 'Size',
        value: 'L',
        type: 'size',
        stock: 15
      }
    ],
    inStock: true,
    stock: 53,
    tags: ['bestseller', 'compression', 'high-waisted'],
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-10T00:00:00Z'
  },
  {
    id: '3',
    name: 'Athletic Zip-Up Hoodie',
    description: 'Comfortable zip-up hoodie with moisture-wicking fabric and athletic fit.',
    price: 89.99,
    category: 'outerwear' as ProductCategory,
    images: [
      {
        id: '3',
        url: '/images/products/zip-hoodie-steel.jpg',
        altText: 'Athletic Zip-Up Hoodie in Steel Gray',
        width: 800,
        height: 800,
        position: 1
      }
    ],
    variants: [
      {
        id: '3-s',
        productId: '3',
        name: 'Size',
        value: 'S',
        type: 'size',
        stock: 10
      },
      {
        id: '3-m',
        productId: '3',
        name: 'Size',
        value: 'M',
        type: 'size',
        stock: 15
      },
      {
        id: '3-l',
        productId: '3',
        name: 'Size',
        value: 'L',
        type: 'size',
        stock: 12
      },
      {
        id: '3-xl',
        productId: '3',
        name: 'Size',
        value: 'XL',
        type: 'size',
        stock: 8
      }
    ],
    inStock: true,
    stock: 45,
    tags: ['zip-up', 'hoodie', 'comfort'],
    createdAt: '2024-01-12T00:00:00Z',
    updatedAt: '2024-01-12T00:00:00Z'
  },
  {
    id: '4',
    name: 'Performance Gym Shorts',
    description: 'Lightweight shorts with 7-inch inseam and built-in compression liner.',
    price: 39.99,
    compareAtPrice: 49.99,
    category: 'bottoms' as ProductCategory,
    images: [
      {
        id: '4',
        url: '/images/products/gym-shorts-black.jpg',
        altText: 'Performance Gym Shorts in Athletic Black',
        width: 800,
        height: 800,
        position: 1
      }
    ],
    variants: [
      {
        id: '4-s',
        productId: '4',
        name: 'Size',
        value: 'S',
        type: 'size',
        stock: 20
      },
      {
        id: '4-m',
        productId: '4',
        name: 'Size',
        value: 'M',
        type: 'size',
        stock: 25
      },
      {
        id: '4-l',
        productId: '4',
        name: 'Size',
        value: 'L',
        type: 'size',
        stock: 18
      },
      {
        id: '4-xl',
        productId: '4',
        name: 'Size',
        value: 'XL',
        type: 'size',
        stock: 12
      }
    ],
    inStock: true,
    stock: 75,
    tags: ['shorts', 'compression', 'lightweight'],
    createdAt: '2024-01-08T00:00:00Z',
    updatedAt: '2024-01-08T00:00:00Z'
  },
  {
    id: '5',
    name: 'Athletic Tank Top',
    description: 'Breathable tank top with racerback design for maximum movement.',
    price: 24.99,
    category: 'tops' as ProductCategory,
    images: [
      {
        id: '5',
        url: '/images/products/tank-top-red.jpg',
        altText: 'Athletic Tank Top in Performance Red',
        width: 800,
        height: 800,
        position: 1
      }
    ],
    variants: [
      {
        id: '5-xs',
        productId: '5',
        name: 'Size',
        value: 'XS',
        type: 'size',
        stock: 15
      },
      {
        id: '5-s',
        productId: '5',
        name: 'Size',
        value: 'S',
        type: 'size',
        stock: 20
      },
      {
        id: '5-m',
        productId: '5',
        name: 'Size',
        value: 'M',
        type: 'size',
        stock: 22
      },
      {
        id: '5-l',
        productId: '5',
        name: 'Size',
        value: 'L',
        type: 'size',
        stock: 18
      }
    ],
    inStock: true,
    stock: 75,
    tags: ['tank', 'racerback', 'breathable'],
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-05T00:00:00Z'
  },
  {
    id: '6',
    name: 'Gym Duffle Bag',
    description: 'Spacious duffle bag with separate shoe compartment and water-resistant exterior.',
    price: 79.99,
    category: 'accessories' as ProductCategory,
    images: [
      {
        id: '6',
        url: '/images/products/duffle-bag-black.jpg',
        altText: 'Gym Duffle Bag in Athletic Black',
        width: 800,
        height: 800,
        position: 1
      }
    ],
    variants: [
      {
        id: '6-one',
        productId: '6',
        name: 'Size',
        value: 'One Size',
        type: 'size',
        stock: 30
      }
    ],
    inStock: true,
    stock: 30,
    tags: ['bag', 'duffle', 'water-resistant'],
    createdAt: '2024-01-03T00:00:00Z',
    updatedAt: '2024-01-03T00:00:00Z'
  },
  {
    id: '7',
    name: 'Performance Windbreaker',
    description: 'Lightweight windbreaker jacket with packable design and reflective details.',
    price: 119.99,
    category: 'outerwear' as ProductCategory,
    images: [
      {
        id: '7',
        url: '/images/products/windbreaker-steel.jpg',
        altText: 'Performance Windbreaker in Steel Gray',
        width: 800,
        height: 800,
        position: 1
      }
    ],
    variants: [
      {
        id: '7-s',
        productId: '7',
        name: 'Size',
        value: 'S',
        type: 'size',
        stock: 8
      },
      {
        id: '7-m',
        productId: '7',
        name: 'Size',
        value: 'M',
        type: 'size',
        stock: 12
      },
      {
        id: '7-l',
        productId: '7',
        name: 'Size',
        value: 'L',
        type: 'size',
        stock: 10
      },
      {
        id: '7-xl',
        productId: '7',
        name: 'Size',
        value: 'XL',
        type: 'size',
        stock: 6
      }
    ],
    inStock: true,
    stock: 36,
    tags: ['windbreaker', 'packable', 'reflective'],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: 'Wireless Workout Earbuds',
    description: 'Sweat-resistant wireless earbuds with 8-hour battery life and secure fit.',
    price: 129.99,
    compareAtPrice: 159.99,
    category: 'accessories' as ProductCategory,
    images: [
      {
        id: '8',
        url: '/images/products/earbuds-black.jpg',
        altText: 'Wireless Workout Earbuds in Athletic Black',
        width: 800,
        height: 800,
        position: 1
      }
    ],
    variants: [
      {
        id: '8-one',
        productId: '8',
        name: 'Color',
        value: 'Black',
        type: 'color',
        stock: 25
      }
    ],
    inStock: true,
    stock: 25,
    tags: ['earbuds', 'wireless', 'sweat-resistant'],
    createdAt: '2023-12-28T00:00:00Z',
    updatedAt: '2023-12-28T00:00:00Z'
  }
]

// Helper functions to filter products
export const getProductsByCategory = (category: ProductCategory): Product[] => {
  return mockProducts.filter(product => product.category === category)
}

export const getFeaturedProducts = (): Product[] => {
  return mockProducts.filter(product => product.tags.includes('bestseller') || product.compareAtPrice)
}

export const getNewProducts = (): Product[] => {
  return mockProducts.filter(product => product.tags.includes('new'))
}

export const getProductById = (id: string): Product | undefined => {
  return mockProducts.find(product => product.id === id)
} 