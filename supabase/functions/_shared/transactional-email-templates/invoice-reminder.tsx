import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "EC Rental Property Management LLC"

interface InvoiceReminderProps {
  tenantName?: string
  invoiceNumber?: string
  amount?: number
  dueDate?: string
  companyName?: string
}

const InvoiceReminderEmail = ({ tenantName, invoiceNumber, amount, dueDate, companyName }: InvoiceReminderProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Payment reminder from {companyName || SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{companyName || SITE_NAME}</Heading>
        <Text style={text}>
          {tenantName ? `Dear ${tenantName},` : 'Dear Tenant,'}
        </Text>
        <Text style={text}>
          This is a payment reminder for the following invoice:
        </Text>
        <div style={invoiceBox}>
          <Text style={invoiceDetail}><strong>Invoice #:</strong> {invoiceNumber || '—'}</Text>
          <Text style={invoiceDetail}><strong>Amount Due:</strong> ${amount || 0}</Text>
          <Text style={invoiceDetail}><strong>Due Date:</strong> {dueDate || '—'}</Text>
        </div>
        <Text style={text}>
          Please ensure payment is made by the due date to avoid any late fees. If you have already made this payment, please disregard this notice.
        </Text>
        <Text style={footer}>
          Thank you,<br />
          {companyName || SITE_NAME}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InvoiceReminderEmail,
  subject: (data: Record<string, any>) => `Payment Reminder - Invoice ${data.invoiceNumber || ''}`,
  displayName: 'Invoice payment reminder',
  previewData: { tenantName: 'Jane Doe', invoiceNumber: 'INV-202601-0001', amount: 1200, dueDate: '2026-05-01', companyName: 'EC Rental Property Management LLC' },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '20px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a3a22', margin: '0 0 20px', fontFamily: "'Outfit', Arial, sans-serif" }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 20px' }
const invoiceBox = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px', margin: '0 0 20px' }
const invoiceDetail = { fontSize: '14px', color: '#1a3a22', margin: '4px 0' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
