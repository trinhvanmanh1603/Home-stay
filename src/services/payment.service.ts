import { mainApiService } from './api.service'
import type { Payment } from '@/types'

export class PaymentService {
  private apiService = mainApiService

  async processPayment(
    bookingId: string,
    amount: number,
    type: Payment['type'],
    method: Payment['method'],
    description: string
  ): Promise<Payment> {
    const payment: Omit<Payment, 'id'> = {
      bookingId,
      amount,
      type,
      method,
      status: 'pending',
      createdAt: new Date().toISOString(),
      description
    }

    const createdPayment = await this.apiService.post<Payment>('/payments', {
      ...payment,
      id: Date.now().toString()
    })

    await this.simulatePaymentProcessing()

    const completedPayment: Payment = {
      ...createdPayment,
      status: 'completed',
      processedAt: new Date().toISOString(),
      transactionId: this.generateTransactionId(type)
    }

    return await this.apiService.put<Payment>(`/payments/${createdPayment.id}`, completedPayment)
  }

  async processDeposit(
    bookingId: string,
    amount: number,
    method: Payment['method']
  ): Promise<Payment> {
    return this.processPayment(
      bookingId,
      amount,
      'deposit',
      method,
      `Đặt cọc cho booking #${bookingId}`
    )
  }

  async processRemainingPayment(
    bookingId: string,
    amount: number,
    method: Payment['method']
  ): Promise<Payment> {
    return this.processPayment(
      bookingId,
      amount,
      'remaining',
      method,
      `Thanh toán số tiền còn lại cho booking #${bookingId}`
    )
  }

  async processRefund(
    bookingId: string,
    amount: number,
    reason: string
  ): Promise<Payment> {
    return this.processPayment(
      bookingId,
      amount,
      'refund',
      'bank_transfer',
      `Hoàn tiền cho booking #${bookingId}: ${reason}`
    )
  }

  async getPaymentHistory(bookingId: string): Promise<Payment[]> {
    return this.apiService.get<Payment[]>(`/payments?bookingId=${bookingId}`)
  }

  calculateDepositAmount(totalPrice: number, percentage: number = 30): number {
    return Math.round(totalPrice * (percentage / 100))
  }

  calculatePaymentAmount(totalPrice: number, percentage: 50 | 100): number {
    return Math.round(totalPrice * (percentage / 100))
  }

  private async simulatePaymentProcessing(): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 2000))
  }

  private generateTransactionId(type: Payment['type']): string {
    const prefix = type === 'refund' ? 'REFUND' : 'TXN'
    return `${prefix}_${Date.now()}`
  }

  getPaymentMethods() {
    try {
      const { mainApiService } = require('./api.service')
      if (mainApiService) {
      }
    } catch (e) {
    }

    return [
      {
        id: 'bank_transfer',
        name: 'Chuyển khoản ngân hàng',
        icon: 'bank',
        description: 'Chuyển khoản qua ngân hàng trong nước',
        processingTime: '5-10 phút'
      },
      {
        id: 'credit_card',
        name: 'Thẻ tín dụng',
        icon: 'credit-card',
        description: 'Visa, Mastercard, JCB',
        processingTime: 'Tức thì'
      },
      {
        id: 'paypal',
        name: 'PayPal',
        icon: 'paypal',
        description: 'Thanh toán qua PayPal',
        processingTime: 'Tức thì'
      }
    ]
  }
}

export const paymentService = new PaymentService()
