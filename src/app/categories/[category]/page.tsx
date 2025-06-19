import { MainLayout } from '@/components/layout/main-layout'
import { ResponsiveBreadcrumb } from '@/components/navigation/breadcrumb'
import { notFound } from 'next/navigation'
import { getProductsByCategory } from '@/lib/mockData'
import { ProductCategory } from '@/types'
import { CategoryPageClient } from './category-page-client'

const categoryInfo: Record<string, { name: string; description: string }> = {
  'tops': {
    name: 'Tops',
    description: 'Performance tops, t-shirts, tank tops, and athletic wear for your active lifestyle.'
  },
  'bottoms': {
    name: 'Bottoms',
    description: 'Athletic shorts, leggings, joggers, and performance bottoms for any workout.'
  },
  'outerwear': {
    name: 'Outerwear',
    description: 'Hoodies, jackets, and athletic outerwear to keep you comfortable in any weather.'
  },
  'accessories': {
    name: 'Accessories',
    description: 'Essential gym accessories, bags, hats, and gear to complete your athletic setup.'
  }
}

interface CategoryPageProps {
  params: {
    category: string
  }
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = params
  const categoryData = categoryInfo[category]

  if (!categoryData) {
    notFound()
  }

  // Get initial products
  const initialProducts = getProductsByCategory(category as ProductCategory)

  return (
    <MainLayout padded>
      <ResponsiveBreadcrumb className="mb-6" />
      
      <CategoryPageClient 
        category={category as ProductCategory}
        categoryData={categoryData}
        initialProducts={initialProducts}
      />
    </MainLayout>
  )
}

export function generateStaticParams() {
  return [
    { category: 'tops' },
    { category: 'bottoms' },
    { category: 'outerwear' },
    { category: 'accessories' }
  ]
} 