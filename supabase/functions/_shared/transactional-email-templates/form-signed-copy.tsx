/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr, Img, Section,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "EC Rental Property Management LLC"

interface FormSignedCopyProps {
  title?: string
  formType?: string
  signerName?: string
  signedAt?: string
  signatureDataUrl?: string
  recipientRole?: 'signer' | 'landlord' | 'archive'
  documentUrl?: string
  summaryLines?: string[]
}

const FormSignedCopyEmail = ({
  title, formType, signerName, signedAt, signatureDataUrl, recipientRole, documentUrl, summaryLines,
}: FormSignedCopyProps) => {
  const heading =
    recipientRole === 'signer' ? 'Your signed copy'
    : recipientRole === 'landlord' ? 'A document was signed'
    : 'Signed document — archive copy'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{heading}: {title || 'Rental document'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>{SITE_NAME}</Heading>
          <Hr style={hr} />
          <Heading style={h1}>{heading}</Heading>
          <Text style={text}>
            <strong>Document:</strong> {title || 'Rental document'}<br />
            {formType && <><strong>Type:</strong> {formType.replace(/_/g, ' ')}<br /></>}
            {signerName && <><strong>Signed by:</strong> {signerName}<br /></>}
            {signedAt && <><strong>Signed at:</strong> {new Date(signedAt).toLocaleString()}</>}
          </Text>

          {summaryLines && summaryLines.length > 0 && (
            <Section style={box}>
              {summaryLines.map((l, i) => (
                <Text key={i} style={boxLine}>{l}</Text>
              ))}
            </Section>
          )}

          {signatureDataUrl && (
            <Section style={sigBox}>
              <Text style={sigLabel}>Signature</Text>
              <Img src={signatureDataUrl} alt="Signature" width="280" style={sigImg} />
            </Section>
          )}

          {documentUrl && (
            <Text style={text}>
              <a href={documentUrl} style={link}>View the document online</a>
            </Text>
          )}

          <Text style={footer}>
            This electronic signature is legally binding under the ESIGN Act and UETA.<br />
            — {SITE_NAME}
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: FormSignedCopyEmail,
  subject: (data: Record<string, any>) => {
    const role = data.recipientRole
    const title = data.title || 'Rental document'
    if (role === 'signer') return `Your signed copy: ${title}`
    if (role === 'landlord') return `Signed: ${title}${data.signerName ? ` — ${data.signerName}` : ''}`
    return `[Archive] Signed: ${title}`
  },
  displayName: 'Form signed — copy',
  previewData: {
    title: 'Lease Agreement — 123 Main St',
    formType: 'lease_agreement',
    signerName: 'Jane Doe',
    signedAt: new Date().toISOString(),
    recipientRole: 'signer',
    summaryLines: ['Property: 123 Main St', 'Monthly Rent: $1,800', 'Term: 2026-01-01 to 2027-01-01'],
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '40px 24px', maxWidth: '560px', margin: '0 auto' }
const logo = { fontSize: '18px', fontWeight: '800' as const, color: '#1a8a4a', margin: '0 0 20px' }
const hr = { borderColor: '#e8e2d9', margin: '0 0 24px' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#1a3a22', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#55575d', lineHeight: '1.6', margin: '0 0 16px' }
const box = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '14px 16px', margin: '0 0 20px' }
const boxLine = { fontSize: '13px', color: '#1a3a22', margin: '4px 0' }
const sigBox = { border: '1px solid #e2e8f0', borderRadius: '8px', padding: '12px', margin: '0 0 20px', textAlign: 'center' as const }
const sigLabel = { fontSize: '11px', color: '#9ca3af', margin: '0 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.04em' }
const sigImg = { display: 'block', margin: '0 auto', maxWidth: '100%' }
const link = { color: '#1a8a4a', fontWeight: 600 as const }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '28px 0 0', lineHeight: '1.5' }
