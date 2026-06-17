export type ContactFormPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export function buildContactMailtoUrl(
  to: string,
  { name, email, subject, message }: ContactFormPayload,
): string {
  const body = [
    `Name: ${name.trim()}`,
    `Email: ${email.trim()}`,
    "",
    message.trim(),
  ].join("\n");

  const params = new URLSearchParams({
    subject: subject.trim(),
    body,
  });

  return `mailto:${to}?${params.toString()}`;
}
