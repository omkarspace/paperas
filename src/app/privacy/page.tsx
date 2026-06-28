import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-20">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
            <h1 className="font-serif text-4xl font-bold text-primary-foreground">Privacy Policy</h1>
            <p className="mt-4 text-primary-foreground/80">
              Last updated: January 2026
            </p>
          </div>
        </section>
        <section className="py-20">
          <div className="container mx-auto max-w-3xl px-4 md:px-6">
            <Card>
              <CardContent className="pt-6 space-y-6">
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">Information We Collect</h2>
                  <p className="text-muted-foreground">
                    We collect information you provide directly, including your name, email address,
                    institutional affiliation, and academic credentials when you create an account.
                    We also collect manuscripts you submit and peer review data.
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">How We Use Your Information</h2>
                  <p className="text-muted-foreground">
                    Your information is used to manage your account, process manuscript submissions,
                    facilitate peer review, communicate about your submissions, and improve our services.
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">Data Sharing</h2>
                  <p className="text-muted-foreground">
                    We do not sell your personal information. Manuscript data is shared only with
                    assigned reviewers and editors during the peer review process. We may share
                    anonymized data for academic research purposes.
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">Data Security</h2>
                  <p className="text-muted-foreground">
                    We implement industry-standard security measures to protect your personal
                    information and manuscript data. All data is encrypted in transit and at rest.
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">Contact Us</h2>
                  <p className="text-muted-foreground">
                    For questions about this privacy policy, contact us at{" "}
                    <span className="text-primary">editor@paperas.in</span>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
