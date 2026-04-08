import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "EC Rental Property Management LLC"

interface FormSignRequestProps {
  title?: string
  signUrl?: string
  companyName?: string
}

const FormSignRequestEmail = ({ title, signUrl, companyName }: FormSignRequestProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You have a document to sign from {companyName || SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{companyName || SITE_NAME}</Heading>
        <Text style={text}>
          You have been sent a document for your electronic signature:
        </Text>
        <Text style={titleStyle}>{title || 'Rental Agreement'}</Text>
        <Text style={text}>
          Please review the document and sign it at your earliest convenience.
        </Text>
        {signUrl && (
          <Button style={button} href={signUrl}>
            Review & Sign Document
          </Button>
        )}
        <Text style={footer}>
          This is a legally binding electronic signature request from {companyName || SITE_NAME}.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: FormSignRequestEmail,
  subject: (data: Record<string, any>) => `Document for signature: ${data.title || 'Rental Agreement'}`,
  displayName: 'Form sign request',
  previewData: { title: 'Lease Agreement - 123 Main St', signUrl: 'https://example.com/sign/abc', companyName: 'EC Rental Property Management LLC' },
} satisfies TemplateEntry
const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '20px 25px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#1a3a22', margin: '0 0 20px', fontFamily: "'Outfit', Arial, sans-serif" }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.5', margin: '0 0 20px' }
const titleStyle = { fontSize: '16px', fontWeight: 'bold' as const, color: '#1a3a22', margin: '0 0 20px', padding: '12px 16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }
const button = { backgroundColor: '#1a8a4a', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontSize: '14px', fontWeight: 'bold' as const, textDecoration: 'none' }
const footer = { fontSize: '12px', color: '#999999', margin: '30px 0 0' }
