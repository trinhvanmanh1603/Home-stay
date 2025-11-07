import { mainApiService } from './api.service'

export class SiteService {
  async getPaymentMethods() {
    const res = await mainApiService.get<any>('/paymentMethods')
    return res.data
  }

  async getFeatures() {
    const res = await mainApiService.get<any>('/features')
    return res.data
  }
}

export const siteService = new SiteService()

export type SiteFeature = {
  id: string
  title: string
  description: string
  icon?: string
  bg?: string
}

export type PaymentMethod = {
  id: string
  label: string
  description?: string
  icon?: string
}
