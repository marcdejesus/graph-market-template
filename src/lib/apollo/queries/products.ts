import { gql } from '@apollo/client'

// Fragment definitions for reusable parts
export const PRODUCT_IMAGE_FRAGMENT = gql`
  fragment ProductImageFragment on ProductImage {
    id
    url
    alt
    width
    height
    isMain
    sortOrder
    thumbnailUrl
    mediumUrl
    largeUrl
  }
`

export const PRODUCT_SIZE_FRAGMENT = gql`
  fragment ProductSizeFragment on ProductSize {
    id
    name
    label
    sortOrder
    measurements {
      chest
      waist
      hips
      length
      inseam
    }
  }
`

export const PRODUCT_COLOR_FRAGMENT = gql`
  fragment ProductColorFragment on ProductColor {
    id
    name
    label
    hexCode
    imageUrl
    sortOrder
  }
`

export const PRODUCT_CATEGORY_FRAGMENT = gql`
  fragment ProductCategoryFragment on ProductCategory {
    id
    name
    slug
    description
    imageUrl
    isActive
    sortOrder
    parentId
  }
`

export const PRODUCT_SUBCATEGORY_FRAGMENT = gql`
  fragment ProductSubcategoryFragment on ProductSubcategory {
    id
    name
    slug
    description
    categoryId
    category {
      ...ProductCategoryFragment
    }
    isActive
    sortOrder
  }
  ${PRODUCT_CATEGORY_FRAGMENT}
`

export const PRODUCT_VARIANT_FRAGMENT = gql`
  fragment ProductVariantFragment on ProductVariant {
    id
    productId
    sku
    size {
      ...ProductSizeFragment
    }
    color {
      ...ProductColorFragment
    }
    price
    originalPrice
    inStock
    stockQuantity
    images {
      ...ProductImageFragment
    }
    weight
    dimensions {
      length
      width
      height
      unit
    }
  }
  ${PRODUCT_SIZE_FRAGMENT}
  ${PRODUCT_COLOR_FRAGMENT}
  ${PRODUCT_IMAGE_FRAGMENT}
`

export const PRODUCT_BASIC_FRAGMENT = gql`
  fragment ProductBasicFragment on Product {
    id
    name
    shortDescription
    slug
    sku
    price
    originalPrice
    isOnSale
    salePercentage
    inStock
    stockQuantity
    isActive
    isFeatured
    rating
    reviewCount
    createdAt
    updatedAt
    brand
    tags
    featuredImage {
      ...ProductImageFragment
    }
    category {
      ...ProductCategoryFragment
    }
    subcategory {
      ...ProductSubcategoryFragment
    }
  }
  ${PRODUCT_IMAGE_FRAGMENT}
  ${PRODUCT_CATEGORY_FRAGMENT}
  ${PRODUCT_SUBCATEGORY_FRAGMENT}
`

export const PRODUCT_FULL_FRAGMENT = gql`
  fragment ProductFullFragment on Product {
    ...ProductBasicFragment
    description
    metaTitle
    metaDescription
    images {
      ...ProductImageFragment
    }
    variants {
      ...ProductVariantFragment
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PRODUCT_VARIANT_FRAGMENT}
`

export const PAGE_INFO_FRAGMENT = gql`
  fragment PageInfoFragment on PageInfo {
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
  }
`

// Main product queries
export const GET_PRODUCTS = gql`
  query GetProducts(
    $first: Int
    $after: String
    $last: Int
    $before: String
    $filters: ProductFiltersInput
    $sort: ProductSortInput
    $search: String
  ) {
    products(
      first: $first
      after: $after
      last: $last
      before: $before
      filters: $filters
      sort: $sort
      search: $search
    ) {
      edges {
        node {
          ...ProductBasicFragment
        }
        cursor
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`

export const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    product(id: $id) {
      ...ProductFullFragment
    }
  }
  ${PRODUCT_FULL_FRAGMENT}
`

export const GET_PRODUCT_BY_SLUG = gql`
  query GetProductBySlug($slug: String!) {
    productBySlug(slug: $slug) {
      ...ProductFullFragment
    }
  }
  ${PRODUCT_FULL_FRAGMENT}
`

export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory(
    $categorySlug: String!
    $first: Int
    $after: String
    $filters: ProductFiltersInput
    $sort: ProductSortInput
  ) {
    productsByCategory(
      categorySlug: $categorySlug
      first: $first
      after: $after
      filters: $filters
      sort: $sort
    ) {
      edges {
        node {
          ...ProductBasicFragment
        }
        cursor
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`

export const GET_PRODUCTS_BY_COLLECTION = gql`
  query GetProductsByCollection(
    $collectionSlug: String!
    $first: Int
    $after: String
    $sort: ProductSortInput
  ) {
    productsByCollection(
      collectionSlug: $collectionSlug
      first: $first
      after: $after
      sort: $sort
    ) {
      edges {
        node {
          ...ProductBasicFragment
        }
        cursor
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`

export const SEARCH_PRODUCTS = gql`
  query SearchProducts(
    $query: String!
    $first: Int
    $after: String
    $filters: ProductFiltersInput
    $sort: ProductSortInput
  ) {
    searchProducts(
      query: $query
      first: $first
      after: $after
      filters: $filters
      sort: $sort
    ) {
      products {
        edges {
          node {
            ...ProductBasicFragment
          }
          cursor
        }
        pageInfo {
          ...PageInfoFragment
        }
        totalCount
      }
      filters {
        categories {
          value
          label
          count
        }
        subcategories {
          value
          label
          count
        }
        brands {
          value
          label
          count
        }
        sizes {
          value
          label
          count
        }
        colors {
          value
          label
          count
        }
        priceRange {
          min
          max
        }
      }
      suggestions {
        type
        value
        label
        count
      }
      totalResults
      searchTime
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`

export const GET_RELATED_PRODUCTS = gql`
  query GetRelatedProducts(
    $productId: ID!
    $categoryId: ID
    $limit: Int
    $excludeIds: [ID!]
  ) {
    relatedProducts(
      productId: $productId
      categoryId: $categoryId
      limit: $limit
      excludeIds: $excludeIds
    ) {
      ...ProductBasicFragment
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
`

export const GET_FEATURED_PRODUCTS = gql`
  query GetFeaturedProducts($limit: Int) {
    featuredProducts(limit: $limit) {
      ...ProductBasicFragment
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
`

export const GET_NEW_ARRIVALS = gql`
  query GetNewArrivals($limit: Int) {
    newArrivals(limit: $limit) {
      ...ProductBasicFragment
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
`

export const GET_SALE_PRODUCTS = gql`
  query GetSaleProducts(
    $first: Int
    $after: String
    $sort: ProductSortInput
  ) {
    saleProducts(first: $first, after: $after, sort: $sort) {
      edges {
        node {
          ...ProductBasicFragment
        }
        cursor
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
`

// Category and collection queries
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      ...ProductCategoryFragment
    }
  }
  ${PRODUCT_CATEGORY_FRAGMENT}
`

export const GET_CATEGORY_BY_SLUG = gql`
  query GetCategoryBySlug($slug: String!) {
    categoryBySlug(slug: $slug) {
      ...ProductCategoryFragment
      subcategories {
        ...ProductSubcategoryFragment
      }
    }
  }
  ${PRODUCT_CATEGORY_FRAGMENT}
  ${PRODUCT_SUBCATEGORY_FRAGMENT}
`

export const GET_COLLECTIONS = gql`
  query GetCollections {
    collections {
      id
      name
      slug
      description
      imageUrl
      isActive
      isFeatured
      productCount
      sortOrder
      createdAt
    }
  }
`

export const GET_COLLECTION_BY_SLUG = gql`
  query GetCollectionBySlug($slug: String!) {
    collectionBySlug(slug: $slug) {
      id
      name
      slug
      description
      imageUrl
      isActive
      isFeatured
      productCount
      sortOrder
      createdAt
      products {
        ...ProductBasicFragment
      }
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
`

// Filter and facet queries
export const GET_PRODUCT_FILTERS = gql`
  query GetProductFilters($categorySlug: String, $search: String) {
    productFilters(categorySlug: $categorySlug, search: $search) {
      categories {
        value
        label
        count
      }
      subcategories {
        value
        label
        count
      }
      brands {
        value
        label
        count
      }
      sizes {
        value
        label
        count
      }
      colors {
        value
        label
        count
      }
      priceRange {
        min
        max
      }
    }
  }
`

export const GET_SEARCH_SUGGESTIONS = gql`
  query GetSearchSuggestions($query: String!, $limit: Int) {
    searchSuggestions(query: $query, limit: $limit) {
      type
      value
      label
      count
    }
  }
`

// Product inventory and availability
export const CHECK_PRODUCT_AVAILABILITY = gql`
  query CheckProductAvailability($productId: ID!, $variantId: ID) {
    productAvailability(productId: $productId, variantId: $variantId) {
      inStock
      stockQuantity
      isBackordered
      estimatedRestockDate
      maxQuantityPerOrder
    }
  }
`

// Product reviews (for future implementation)
export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews(
    $productId: ID!
    $first: Int
    $after: String
    $sort: ReviewSortInput
  ) {
    productReviews(
      productId: $productId
      first: $first
      after: $after
      sort: $sort
    ) {
      edges {
        node {
          id
          userId
          userName
          rating
          title
          content
          isVerifiedPurchase
          helpfulCount
          createdAt
          updatedAt
        }
        cursor
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
  ${PAGE_INFO_FRAGMENT}
`

export const GET_PRODUCT_REVIEW_SUMMARY = gql`
  query GetProductReviewSummary($productId: ID!) {
    productReviewSummary(productId: $productId) {
      productId
      averageRating
      totalReviews
      ratingDistribution
    }
  }
`

// Recently viewed products
export const GET_RECENTLY_VIEWED = gql`
  query GetRecentlyViewed($limit: Int) {
    recentlyViewed(limit: $limit) {
      productId
      product {
        ...ProductBasicFragment
      }
      viewedAt
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
`

// Wishlist/favorites
export const GET_WISHLIST = gql`
  query GetWishlist($first: Int, $after: String) {
    wishlist(first: $first, after: $after) {
      edges {
        node {
          id
          productId
          product {
            ...ProductBasicFragment
          }
          createdAt
        }
        cursor
      }
      pageInfo {
        ...PageInfoFragment
      }
      totalCount
    }
  }
  ${PRODUCT_BASIC_FRAGMENT}
  ${PAGE_INFO_FRAGMENT}
` 