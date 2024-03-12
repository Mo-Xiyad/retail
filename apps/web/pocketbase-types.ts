/**
* This file was @generated using pocketbase-typegen
*/

import type PocketBase from 'pocketbase'
import type { RecordService } from 'pocketbase'

export enum Collections {
	Categories = "categories",
	Company = "company",
	Deals = "deals",
	Language = "language",
	Posts = "posts",
	Products = "products",
	Restaurants = "restaurants",
	SubCategory = "sub_category",
	Users = "users",
}

// Alias types for improved usability
export type IsoDateString = string
export type RecordIdString = string
export type HTMLString = string

// System fields
export type BaseSystemFields<T = never> = {
	id: RecordIdString
	created: IsoDateString
	updated: IsoDateString
	collectionId: string
	collectionName: Collections
	expand?: T
}

export type AuthSystemFields<T = never> = {
	email: string
	emailVisibility: boolean
	username: string
	verified: boolean
} & BaseSystemFields<T>

// Record types for each collection

export type CategoriesRecord = {
	company: RecordIdString
	name: string
	restaurant: RecordIdString
}

export type CompanyRecord = {
	name?: string
	owner?: RecordIdString
}

export type DealsRecord = {
	company: RecordIdString
	description: string
	discounted_price?: number
	image?: string
	product?: RecordIdString[]
	restaurant: RecordIdString
	title: string
}

export type LanguageRecord = {
	flag?: string
	name: string
}

export type PostsRecord = {
	title?: string
}

export type ProductsRecord = {
	category?: RecordIdString[]
	company: RecordIdString
	description?: string
	discounted_price?: number
	image?: string
	is_deal?: boolean
	name: string
	price: number
	restaurant: RecordIdString
	sub_category?: RecordIdString[]
}

export type RestaurantsRecord = {
	address: string
	banner?: string
	city: string
	company: RecordIdString
	custom_domain?: string
	description?: string
	isDeleted?: boolean
	language?: RecordIdString[]
	logo?: string
	name: string
	phone_number?: string
	subdomain: string
	zip_code: string
}

export type SubCategoryRecord = {
	name?: string
	type?: string
	value?: string
}

export type UsersRecord = {
	avatar?: string
	company?: RecordIdString
	name?: string
}

// Response types include system fields and match responses from the PocketBase API
export type CategoriesResponse<Texpand = unknown> = Required<CategoriesRecord> & BaseSystemFields<Texpand>
export type CompanyResponse<Texpand = unknown> = Required<CompanyRecord> & BaseSystemFields<Texpand>
export type DealsResponse<Texpand = unknown> = Required<DealsRecord> & BaseSystemFields<Texpand>
export type LanguageResponse<Texpand = unknown> = Required<LanguageRecord> & BaseSystemFields<Texpand>
export type PostsResponse<Texpand = unknown> = Required<PostsRecord> & BaseSystemFields<Texpand>
export type ProductsResponse<Texpand = unknown> = Required<ProductsRecord> & BaseSystemFields<Texpand>
export type RestaurantsResponse<Texpand = unknown> = Required<RestaurantsRecord> & BaseSystemFields<Texpand>
export type SubCategoryResponse<Texpand = unknown> = Required<SubCategoryRecord> & BaseSystemFields<Texpand>
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
	categories: CategoriesRecord
	company: CompanyRecord
	deals: DealsRecord
	language: LanguageRecord
	posts: PostsRecord
	products: ProductsRecord
	restaurants: RestaurantsRecord
	sub_category: SubCategoryRecord
	users: UsersRecord
}

export type CollectionResponses = {
	categories: CategoriesResponse
	company: CompanyResponse
	deals: DealsResponse
	language: LanguageResponse
	posts: PostsResponse
	products: ProductsResponse
	restaurants: RestaurantsResponse
	sub_category: SubCategoryResponse
	users: UsersResponse
}

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
	collection(idOrName: 'categories'): RecordService<CategoriesResponse>
	collection(idOrName: 'company'): RecordService<CompanyResponse>
	collection(idOrName: 'deals'): RecordService<DealsResponse>
	collection(idOrName: 'language'): RecordService<LanguageResponse>
	collection(idOrName: 'posts'): RecordService<PostsResponse>
	collection(idOrName: 'products'): RecordService<ProductsResponse>
	collection(idOrName: 'restaurants'): RecordService<RestaurantsResponse>
	collection(idOrName: 'sub_category'): RecordService<SubCategoryResponse>
	collection(idOrName: 'users'): RecordService<UsersResponse>
}
