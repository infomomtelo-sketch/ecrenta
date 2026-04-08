/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "ecrenta"

interface ContactConfirmationProps {
  name?: string
}

const ContactConfirmationEmail = ({ name }: ContactConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Thanks for reaching out to {SITE_NAME}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={logo}>{SITE_NAME}</Heading>
        <Hr style={hr} />
        <Heading style={h1}>
          {name ? `Hey ${name}, we got your message!` : 'We got your message!'}
        </Heading>
        <Text style={text}>
          Thanks for reaching out. Our team will review your message and get back to you within 24 hours.
        </Text>
        <Text style={text}>
          In the meantime, feel free to browse available rentals on our marketplace.
        </Text>
        <Text style={footer}>
          — The {SITE_NAME} team
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ContactConfirmationEmail,
  subject: 'Thanks for contacting ecrenta',
  displayName: 'Contact form confirmation',
  previewData: { name: 'Jane' },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: "'Plus Jakarta Sans', Arial, sans-serif",
}
const container = {
  padding: '40px 24px',
  maxWidth: '480px',
  margin: '0 auto',
}
const logo = {
  fontSize: '20px',
  fontWeight: '800' as const,
  color: '#2d9659',
  fontFamily: "'Outfit', Arial, sans-serif",
  margin: '0 0 24px',
}
const hr = {
  borderColor: '#e8e2d9',
  margin: '0 0 28px',
}
const h1 = {
  fontSize: '22px',
  fontWeight: '700' as const,
  color: '#1c2536',
  margin: '0 0 16px',
  fontFamily: "'Outfit', Arial, sans-serif",
}
const text = {
  fontSize: '15px',
  color: '#636872',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const footer = {
  fontSize: '13px',
  color: '#9ca3af',
  margin: '32px 0 0',
}
