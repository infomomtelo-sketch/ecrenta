import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Text, Button, Hr, Section, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "ecrenta"

interface TenantInviteProps {
  inviteUrl?: string
  landlordName?: string
  recipientName?: string
  unitAddress?: string
}

const TenantInviteEmail = ({ inviteUrl, landlordName, recipientName, unitAddress }: TenantInviteProps) => {
  const from = landlordName || 'Your landlord'
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{`${from} invited you to the ${SITE_NAME} tenant portal`}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>{SITE_NAME}</Heading>
          <Hr style={hr} />
          <Heading style={h1}>You're invited to your tenant portal</Heading>
          <Text style={text}>{recipientName ? `Hi ${recipientName},` : 'Hello,'}</Text>
          <Text style={text}>
            {from} has invited you to join {SITE_NAME} to manage your rental
            {unitAddress ? ` at ${unitAddress}` : ''}. From the portal you can pay rent, send messages,
            and request repairs.
          </Text>
          {inviteUrl && (
            <Section style={ctaWrap}>
              <Button style={button} href={inviteUrl}>Accept invite</Button>
              <Text style={fallback}>
                Button not working? Copy and paste this link:<br />
                <Link href={inviteUrl} style={link}>{inviteUrl}</Link>
              </Text>
            </Section>
          )}
          <Hr style={hr} />
          <Text style={footer}>If you weren't expecting this, you can safely ignore this email.</Text>
        </Container>
      </Body>
    </Html>
  )
}

export const template = {
  component: TenantInviteEmail,
  subject: (data: Record<string, any>) =>
    `${data.landlordName || 'Your landlord'} invited you to ${SITE_NAME}`,
  displayName: 'Tenant portal invite',
  previewData: {
    inviteUrl: 'https://example.com/tenant/accept-invite/abc',
    landlordName: 'Alex',
    recipientName: 'Jordan',
    unitAddress: '123 Main St, Unit 2',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: "'Plus Jakarta Sans', Arial, sans-serif" }
const container = { padding: '40px 24px', maxWidth: '560px', margin: '0 auto' }
const logo = { fontSize: '18px', fontWeight: '800' as const, color: '#1a8a4a', margin: '0 0 20px' }
const hr = { borderColor: '#e8e2d9', margin: '24px 0' }
const h1 = { fontSize: '22px', fontWeight: '700' as const, color: '#1a3a22', margin: '0 0 16px', lineHeight: '1.3' }
const text = { fontSize: '15px', color: '#374151', lineHeight: '1.6', margin: '0 0 14px' }
const ctaWrap = { textAlign: 'center' as const, margin: '8px 0 24px' }
const button = { backgroundColor: '#1a8a4a', color: '#ffffff', padding: '14px 28px', borderRadius: '10px', fontSize: '15px', fontWeight: 'bold' as const, textDecoration: 'none', display: 'inline-block' }
const fallback = { fontSize: '12px', color: '#6b7280', margin: '16px 0 0', lineHeight: '1.5' }
const link = { color: '#1a8a4a', wordBreak: 'break-all' as const, fontSize: '12px' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: '0', lineHeight: '1.5' }
