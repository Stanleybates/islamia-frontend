import { Link } from "react-router-dom";
import { Shield, MapPin, Lock, Eye, Trash2, Users, Mail, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPolicy = () => {
  const lastUpdated = "January 2026";

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8" />
            <h1 className="text-4xl font-bold">Privacy Policy</h1>
          </div>
          <p className="text-lg opacity-90">Allāhul Musta'ān Institute</p>
          <p className="text-sm opacity-75 mt-2">Last updated: {lastUpdated}</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-0 bg-background/95 backdrop-blur border-b border-border z-40 py-3 px-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <Link to="/">
            <Button variant="ghost" size="sm">← Back to Home</Button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 pb-12">
        {/* Introduction */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              Our Commitment to Your Privacy
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Allāhul Musta'ān Institute ("we," "us," "our," or "Institute") is committed to protecting your personal data and respecting your privacy rights. This Privacy Policy explains how we collect, use, disclose, and otherwise process personal data in connection with our platform and services.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              This policy complies with the Data Protection Act, 2012 (Act 843) of Ghana and is informed by the principles established by the Ghana Data Protection Commission (DPC).
            </p>
          </div>
        </section>

        {/* 1. What Personal Data We Collect */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">1. What Personal Data We Collect</h2>

            <div className="space-y-6">
              {/* Admission Form Data */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Admission Application Data
                </h3>
                <p className="text-muted-foreground mb-3">
                  When you submit an admission application, we collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                  <li><strong>Identity Information:</strong> Full name, date of birth, gender</li>
                  <li><strong>Contact Information:</strong> Email address, phone number, WhatsApp number, city, country</li>
                  <li><strong>Educational Background:</strong> Previous education level</li>
                  <li><strong>Program Preferences:</strong> Preferred semester, language proficiency, Arabic level</li>
                  <li><strong>Application Details:</strong> Motivation for enrollment</li>
                </ul>
              </div>

              {/* Student Account Data */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-primary" />
                  Student Account Data
                </h3>
                <p className="text-muted-foreground mb-3">
                  When you create a student account, we collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                  <li><strong>Authentication Data:</strong> Index number, password (encrypted)</li>
                  <li><strong>Contact Information:</strong> Phone number (for account recovery)</li>
                  <li><strong>Session Information:</strong> Login activity and authentication tokens</li>
                </ul>
              </div>

              {/* Admin Account Data */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Admin & Staff Account Data</h3>
                <p className="text-muted-foreground mb-3">
                  When you create an admin or staff account, we collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                  <li><strong>Identity & Contact:</strong> Username, email, phone number</li>
                  <li><strong>Authentication:</strong> Password (encrypted)</li>
                  <li><strong>Role & Permissions:</strong> Admin role, assigned courses/departments</li>
                  <li><strong>Account Status:</strong> Approval status and date</li>
                </ul>
              </div>

              {/* Payment Data */}
              <div>
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-primary" />
                  Payment Information
                </h3>
                <p className="text-muted-foreground mb-3">
                  When you make a payment, we collect:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                  <li><strong>Payment Details:</strong> Transaction ID, payment amount, payment method (Mobile Money, Card, Bank Transfer), payment status</li>
                  <li><strong>Contact for Payment:</strong> Email and phone number associated with payment</li>
                  <li><strong>Note:</strong> We do not store full credit card numbers or bank account details. Payment processing is handled by Paystack, our third-party payment processor, which maintains its own security standards.</li>
                </ul>
              </div>

              {/* Automatically Collected Data */}
              <div>
                <h3 className="text-lg font-semibold mb-2">Automatically Collected Data</h3>
                <p className="text-muted-foreground mb-3">
                  We automatically collect certain information about your device and usage:
                </p>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2">
                  <li>IP address and browser type</li>
                  <li>Pages visited and time spent</li>
                  <li>Referral source</li>
                  <li>Device information (operating system, screen resolution)</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 2. How We Use Your Data */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Personal Data</h2>

            <p className="text-muted-foreground mb-6">
              We use your personal data for the following purposes:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Admission & Enrollment</h3>
                <p className="text-muted-foreground">Process your application, assign registration numbers, verify eligibility, and communicate admission decisions.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Account Management</h3>
                <p className="text-muted-foreground">Create and manage your account, process login requests, and handle password resets and account recovery.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Payment Processing</h3>
                <p className="text-muted-foreground">Process admission fees, verify payment status, generate receipts, and manage payment disputes.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Communication</h3>
                <p className="text-muted-foreground">Send you updates about your application status, admission decisions, payment confirmations, and important announcements via email, phone, or WhatsApp.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Course & Program Management</h3>
                <p className="text-muted-foreground">Assign you to courses, track enrollment, manage course schedules, and administer your educational experience.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Compliance & Legal Obligations</h3>
                <p className="text-muted-foreground">Comply with applicable laws (including Ghana's Data Protection Act, 2012), respond to legal requests, and maintain records for regulatory purposes.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Service Improvement</h3>
                <p className="text-muted-foreground">Analyze usage patterns, troubleshoot technical issues, improve platform functionality, and enhance user experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Legal Basis for Processing */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">3. Legal Basis for Processing</h2>

            <p className="text-muted-foreground mb-6">
              Under Ghana's Data Protection Act, 2012, we process your personal data based on the following legal grounds:
            </p>

            <div className="space-y-3">
              <div className="bg-muted/50 p-4 rounded border border-border">
                <p className="text-sm"><strong>Consent:</strong> We obtain your explicit consent when you submit the admission form or create an account.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded border border-border">
                <p className="text-sm"><strong>Contract:</strong> Processing is necessary to fulfill our educational services and enrollment agreements with you.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded border border-border">
                <p className="text-sm"><strong>Legal Obligation:</strong> We process data to comply with applicable laws, regulations, and court orders.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded border border-border">
                <p className="text-sm"><strong>Legitimate Interest:</strong> We process data to operate, maintain, and improve our platform and services.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Who We Share Your Data With */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">4. Who We Share Your Data With</h2>

            <p className="text-muted-foreground mb-6">
              We may share your personal data with the following recipients:
            </p>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Third-Party Service Providers</h3>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li><strong>Paystack:</strong> Payment processor. Data shared: email, phone, transaction details. (See their privacy policy at paystack.com)</li>
                  <li><strong>Supabase:</strong> Database and authentication provider. Data shared: user accounts, course information.</li>
                  <li><strong>Email & Communication Services:</strong> For sending notifications and announcements.</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Internal Staff</h3>
                <p className="text-muted-foreground">Admin staff and educators within the Institute who need access to process admissions, manage courses, and provide support.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Legal & Regulatory Authorities</h3>
                <p className="text-muted-foreground">Government agencies, the Ghana Data Protection Commission, or courts when required by law.</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">We Do NOT Sell Your Data</h3>
                <p className="text-muted-foreground">
                  We do not sell, rent, or trade your personal information to third parties for marketing or commercial purposes.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Data Storage & Security */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Shield className="w-6 h-6 text-primary" />
              5. Data Storage & Security
            </h2>

            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Where We Store Your Data</h3>
                <p className="text-muted-foreground mb-3">
                  Your personal data is stored on secure servers hosted by Supabase. The data may be stored in multiple geographic locations depending on Supabase's infrastructure. By using our platform, you consent to your data being processed and stored in these locations.
                </p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Security Measures</h3>
                <p className="text-muted-foreground mb-3">
                  We implement industry-standard security measures to protect your data, including:
                </p>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground ml-2">
                  <li>Encryption of sensitive data (passwords, payment information) using secure protocols (HTTPS/TLS)</li>
                  <li>Access controls limiting employee access to personal data</li>
                  <li>Regular security assessments and updates</li>
                  <li>Secure authentication tokens for session management</li>
                </ul>
              </div>

              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded">
                <p className="text-sm text-amber-900 dark:text-amber-100">
                  <strong>Important:</strong> While we implement robust security measures, no system is 100% secure. We cannot guarantee absolute security of your data. You are responsible for maintaining the confidentiality of your login credentials.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Data Retention */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">6. How Long We Keep Your Data</h2>

            <p className="text-muted-foreground mb-6">
              We retain your personal data for as long as necessary to fulfill the purposes for which it was collected:
            </p>

            <div className="space-y-3">
              <div className="bg-muted/50 p-4 rounded border border-border">
                <p className="text-sm"><strong>Admission & Account Data:</strong> Retained for the duration of your enrollment and for 3 years after program completion for record-keeping and compliance purposes.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded border border-border">
                <p className="text-sm"><strong>Payment Records:</strong> Retained for at least 3 years to comply with tax and financial regulations.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded border border-border">
                <p className="text-sm"><strong>Usage Analytics:</strong> Non-personally identifiable usage data may be retained indefinitely for service improvement.</p>
              </div>
              <div className="bg-muted/50 p-4 rounded border border-border">
                <p className="text-sm"><strong>Legal Holds:</strong> If required by law or for legal disputes, data may be retained longer than normal retention periods.</p>
              </div>
            </div>

            <p className="text-muted-foreground mt-6">
              After the retention period expires, we will securely delete or anonymize your data, unless we are required by law to retain it longer.
            </p>
          </div>
        </section>

        {/* 7. Your Privacy Rights */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Eye className="w-6 h-6 text-primary" />
              7. Your Privacy Rights
            </h2>

            <p className="text-muted-foreground mb-6">
              Under Ghana's Data Protection Act, 2012, you have the following rights:
            </p>

            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Right to Access</h3>
                <p className="text-muted-foreground">You have the right to request a copy of your personal data and information about how we process it.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Right to Correction</h3>
                <p className="text-muted-foreground">You can request that we correct inaccurate or incomplete personal data.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Right to Erasure (Right to Be Forgotten)</h3>
                <p className="text-muted-foreground">In certain circumstances, you can request deletion of your personal data, subject to legal and contractual obligations.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Right to Object</h3>
                <p className="text-muted-foreground">You can object to certain types of data processing, including processing based on legitimate interests.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Right to Data Portability</h3>
                <p className="text-muted-foreground">You can request your data in a structured, machine-readable format and request its transfer to another organization.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Right to Withdraw Consent</h3>
                <p className="text-muted-foreground">If processing is based on your consent, you can withdraw it at any time. This does not affect the legality of processing before withdrawal.</p>
              </div>

              <div className="border-l-4 border-primary pl-4 py-2">
                <h3 className="font-semibold mb-1">Right to Lodge a Complaint</h3>
                <p className="text-muted-foreground">You have the right to lodge a complaint with the Ghana Data Protection Commission.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 8. How to Exercise Your Rights */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Mail className="w-6 h-6 text-primary" />
              8. How to Exercise Your Privacy Rights
            </h2>

            <p className="text-muted-foreground mb-6">
              To exercise any of your privacy rights, please contact us using the information below:
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Mail className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Email</p>
                    <p className="text-muted-foreground text-sm">allahulmustaaninstitute@gmail.com</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Phone className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Phone</p>
                    <p className="text-muted-foreground text-sm">+233 550 545 403</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">Mailing Address</p>
                    <p className="text-muted-foreground text-sm">
                      Allāhul Musta'ān Institute<br />
                      Ghana
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-muted-foreground">
              When you submit a request, please include sufficient information to identify you and clearly state your request. We will respond to your request within 30 days, in compliance with the Data Protection Act, 2012.
            </p>
          </div>
        </section>

        {/* 9. Ghana Data Protection Commission */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">9. Ghana Data Protection Commission</h2>

            <p className="text-muted-foreground mb-4">
              If you have concerns about how we handle your personal data or if you believe we have violated your privacy rights, you can lodge a complaint with the Ghana Data Protection Commission:
            </p>

            <div className="bg-muted/50 p-4 rounded border border-border">
              <p className="font-semibold mb-2">Ghana Data Protection Commission</p>
              <p className="text-sm text-muted-foreground mb-2">
                Website: <a href="https://dataprotection.gov.gh" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">www.dataprotection.gov.gh</a>
              </p>
              <p className="text-sm text-muted-foreground">
                The DPC oversees compliance with Ghana's Data Protection Act, 2012, and can investigate complaints about data protection breaches.
              </p>
            </div>
          </div>
        </section>

        {/* 10. Cookies & Tracking */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">10. Cookies & Similar Technologies</h2>

            <p className="text-muted-foreground mb-6">
              Our platform may use cookies and similar tracking technologies to:
            </p>

            <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6 ml-2">
              <li>Maintain your login session</li>
              <li>Remember your preferences and settings</li>
              <li>Understand how users interact with our platform</li>
              <li>Improve platform functionality and user experience</li>
              <li>Detect and prevent fraud or security issues</li>
            </ul>

            <p className="text-muted-foreground mb-4">
              Most browsers allow you to control cookies through your settings. However, disabling certain cookies may limit your ability to use some features of our platform.
            </p>

            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 p-4 rounded">
              <p className="text-sm text-amber-900 dark:text-amber-100">
                We currently do not use third-party analytics or advertising cookies. Our cookie usage is limited to essential authentication and session management.
              </p>
            </div>
          </div>
        </section>

        {/* 11. Changes to Privacy Policy */}
        <section className="mb-12">
          <div className="bg-card border border-border rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">11. Changes to This Privacy Policy</h2>

            <p className="text-muted-foreground mb-4">
              We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make material changes, we will:
            </p>

            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-2 mb-6">
              <li>Update the "Last updated" date at the top of this policy</li>
              <li>Notify you by email or prominent notice on our platform</li>
              <li>Require your renewed consent if the changes materially expand data collection or use</li>
            </ul>

            <p className="text-muted-foreground">
              Your continued use of our platform after changes constitutes your acceptance of the updated Privacy Policy.
            </p>
          </div>
        </section>

        {/* 12. Contact Us */}
        <section className="mb-12">
          <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Phone className="w-6 h-6 text-primary" />
              12. Contact Us
            </h2>

            <p className="text-muted-foreground mb-6">
              If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">Data Protection & Privacy</h3>
                <p className="text-muted-foreground text-sm mb-1">Email: allahulmustaaninstitute@gmail.com</p>
                <p className="text-muted-foreground text-sm mb-1">Phone: +233 550 545 403</p>
              </div>

              <div>
                <h3 className="font-semibold mb-2">General Inquiries</h3>
                <p className="text-muted-foreground text-sm mb-1">Email: info@islamia.edu.gh</p>
                <p className="text-muted-foreground text-sm">WhatsApp: +233 550 545 403</p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-primary/20">
              <p className="text-muted-foreground text-sm">
                <strong>Response Time:</strong> We aim to respond to all privacy requests within 30 days, in accordance with Ghana's Data Protection Act, 2012.
              </p>
            </div>
          </div>
        </section>

        {/* Footer Note */}
        <section className="text-center py-8 border-t border-border mt-12">
          <p className="text-muted-foreground text-sm mb-4">
            This Privacy Policy is effective as of {lastUpdated}
          </p>
          <Link to="/">
            <Button variant="outline">Return to Home</Button>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
