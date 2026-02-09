import { Leaf, Mail, ExternalLink } from "lucide-react";

const footerLinks = [
  { name: "Home", href: "#home" },
  { name: "Crop Recommendation", href: "#crop-recommendation" },
  { name: "About", href: "#about" },
];

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="bg-forest-dark text-primary-foreground"
    >
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">

          {/* ===================== BRAND ===================== */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">SmartCrop AI</span>
            </div>

            <p className="text-primary-foreground/70 max-w-md leading-relaxed">
              An AI-powered crop recommendation system that helps farmers make
              informed decisions by analyzing soil health and location-based
              insights.
            </p>
          </div>

          {/* ===================== QUICK LINKS ===================== */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              {footerLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-primary-foreground/70 hover:text-primary-foreground transition-colors flex items-center gap-2 group"
                  >
                    <span>{link.name}</span>
                    <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* ===================== CONTACT ===================== */}
          <div className="flex flex-col gap-4">
            <h3 className="font-semibold">Contact</h3>

            <a
              href="mailto:smartcrop.ai@gmail.com"
              className="inline-flex items-center gap-2 rounded-md bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/90 transition-colors w-fit"
            >
              <Mail className="w-4 h-4" />
              Email Us
            </a>

            <span className="text-sm text-primary-foreground/60">
              smartcrop.ai@gmail.com
            </span>
          </div>
        </div>

        {/* ===================== BOTTOM BAR ===================== */}
        <div className="mt-12 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-primary-foreground/60 text-sm">
            © {new Date().getFullYear()} SmartCrop AI. All rights reserved.
          </p>
          <p className="text-primary-foreground/60 text-sm">
            Made with 🌱 for Indian Farmers
          </p>
        </div>
      </div>
    </footer>
  );
};
