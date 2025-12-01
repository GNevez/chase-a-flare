import { Instagram, Mail } from "lucide-react";

interface HelpContactProps {
  message?: string;
}

export function HelpContact({ message = "Precisa de ajuda? Entre em contato conosco" }: HelpContactProps) {
  return (
    <div className="mt-8 text-center">
      <p className="text-sm text-neutral-600 mb-2">{message}</p>
      <div className="flex justify-center gap-4 text-sm">
        <a
          href="mailto:contato@chaseaflare.com.br"
          className="text-accent hover:underline flex items-center gap-1"
        >
          <Mail className="w-4 h-4" />
          contato@chaseaflare.com.br
        </a>
        <span className="text-neutral-300">|</span>
        <a
          href="https://www.instagram.com/chaseaflare/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline flex items-center gap-1"
        >
          <Instagram className="w-4 h-4" />
          @chaseaflare
        </a>
      </div>
    </div>
  );
}
