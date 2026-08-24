import { whatsappHref } from "@/lib/site";

export function WhatsAppLink({
  message,
  children,
  className = "btn-primary",
}: {
  message?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <a
      href={whatsappHref(message)}
      target="_blank"
      rel="noreferrer"
      className={className}
    >
      {children}
    </a>
  );
}
