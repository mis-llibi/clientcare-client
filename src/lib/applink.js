const isProd = process.env.NODE_ENV === 'production'

export const applink = isProd
  ? process.env.NEXT_PUBLIC_DEPLOYED_FRONTEND
  : process.env.NEXT_PUBLIC_FRONTEND
