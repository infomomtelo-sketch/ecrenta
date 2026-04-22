import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "EC Rental Property Management LLC"

interface FormSignRequestProps {
  title?: string
  signUrl?: string
  companyName?: string
  recipientName?: string
}

const FormSignRequestEmail = ({ title, signUrl, companyName, recipientName }: FormSignRequestProps) => {
  const company = companyName || SITE_NAME
  const docTitle = title || 'Rental Agreement'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`Action required: sign "${docTitle}" from ${company}`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>{company}</Heading>
          <Hr style={hr} />

          <Heading style={h1}>Document ready for your signature</Heading>
          <Text style={text}>
            {recipientName ? `Hi ${recipientName},` : 'Hello,'}
          </Text>
          <Text style={text}>
            {company} has sent you a document to review and sign electronically.
          </Text>

          <Section style={docBox}>
            <Text style={docLabel}>Document</Text>
            <Text style={docTitleStyle}>{docTitle}</Text>
          </Section>

          {signUrl && (
            <Section style={ctaWrap}>
              <Button style={button} href={signUrl}>
                Review &amp; Sign Document
              </Button>
              <Text style={fallback}>
                Button not working? Copy and paste this link:<br />
                <Link href={signUrl} style={link}>{signUrl}</Link>
              </Text>
            </Section>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            This is a legally binding electronic signature request from {company}.<br />
            Signatures collected through this link comply with the ESIGN Act and UETA.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: FormSignRequestEmail,
  subject: (data: Record<string, any>) => `Please sign: ${data.title || 'Rental Agreement'}`,
  displayName: 'Form sign request',
  previewData: {
    title: 'Lease Agreement - 123 Main St',
    signUrl: 'https://example.com/sign/abc',
    companyName: 'EC Rental Property Management LLC',
    recipientName: 'Jane',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '40px 24px', maxWidth: '560px', margin: '0 auto' }
const logo = { fontSize: '18px', fontWeight: '800' as const, color: '#1a8a4a', margin: '0 0 20px' }
const hr = { borderColor: '#e8e2d9', margin: '24px 0' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#1a3a22', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 14px' }
const docBox = { backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '16px 18px', margin: '20px 0 28px' }
const docLabel = { fontSize: '11px', color: '#1a8a4a', margin: '0 0 4px', textTransform: 'uppercase' as const, letterSpacing: '0.06em', fontWeight: 700 as const }
const docTitleStyle = { fontSize: '16px', fontWeight: '700' as const, color: '#1a3a22', margin: 0 }
const ctaWrap = { textAlign: 'center' as const, margin: '0 0 24px' }
const button = { backgroundColor: '#1a8a4a', color: '#ffffff', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold' as const, textDecoration: 'none', display: 'inline-block' }
const fallback = { fontSize: '12px', color: '#6b7280', margin: '16px 0 0', lineHeight: '1.5' }
const link = { color: '#1a8a4a', wordBreak: 'break-all' as const, fontSize: '12px' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '0', lineHeight: '1.5' }
