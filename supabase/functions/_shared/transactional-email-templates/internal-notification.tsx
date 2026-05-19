import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Hr, Link,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface InternalNotificationProps {
  eventType?: string
  title?: string
  summaryLines?: string[]
  message?: string
  actionUrl?: string
  actionLabel?: string
}

const InternalNotificationEmail = ({
  eventType = 'Notification',
  title = 'New activity on ecrenta',
  summaryLines = [],
  message,
  actionUrl,
  actionLabel = 'Open in dashboard',
}: InternalNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{title}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={tag}>{eventType.toUpperCase()}</Text>
        <Heading style={h1}>{title}</Heading>
        {summaryLines.length > 0 && (
          <Section style={card}>
            {summaryLines.map((line, i) => (
              <Text key={i} style={lineStyle}>{line}</Text>
            ))}
          </Section>
        )}
        {message && (
          <Section style={card}>
            <Text style={lineStyle}>{message}</Text>
          </Section>
        )}
        {actionUrl && (
          <Text style={text}>
            <Link href={actionUrl} style={link}>{actionLabel} →</Link>
          </Text>
        )}
        <Hr style={hr} />
        <Text style={footer}>ecrenta · Internal notification</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: InternalNotificationEmail,
  subject: (d: Record<string, any>) =>
    `[ecrenta] ${d.eventType || 'Notification'}: ${d.title || 'New activity'}`,
  displayName: 'Internal notification',
  previewData: {
    eventType: 'Contact form',
    title: 'New message from Jane Doe',
    summaryLines: ['From: jane@example.com', 'Phone: —'],
    message: 'Hi, I have a question about the apartment on Main St.',
    actionUrl: 'https://ecrenta.space/admin',
    actionLabel: 'Open admin',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { padding: '24px', maxWidth: '560px' }
const tag = { fontSize: '11px', fontWeight: 'bold' as const, letterSpacing: '1px', color: '#16A34A', margin: '0 0 8px' }
const h1 = { fontSize: '22px', fontWeight: 'bold' as const, color: '#0a0a0a', margin: '0 0 16px' }
const card = { backgroundColor: '#f8f7f2', borderRadius: '10px', padding: '16px 18px', margin: '12px 0' }
const lineStyle = { fontSize: '14px', color: '#1f2937', lineHeight: '1.5', margin: '4px 0' }
const text = { fontSize: '14px', color: '#1f2937', margin: '16px 0' }
const link = { color: '#16A34A', fontWeight: 'bold' as const }
const hr = { borderColor: '#e5e7eb', margin: '24px 0 12px' }
const footer = { fontSize: '12px', color: '#9ca3af', margin: 0 }
