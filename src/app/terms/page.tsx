import { Navbar } from "@/components/shared/navbar";
import { Footer } from "@/components/shared/footer";
import { Card, CardContent } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <section className="bg-primary py-20">
          <div className="container mx-auto max-w-7xl px-4 md:px-6 text-center">
            <h1 className="font-serif text-4xl font-bold text-primary-foreground">Terms of Service</h1>
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
                  <h2 className="font-serif text-xl font-semibold mb-2">Acceptance of Terms</h2>
                  <p className="text-muted-foreground">
                    By accessing or using Paperas, you agree to be bound by these Terms of Service.
                    If you do not agree, please do not use our platform.
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">Account Responsibilities</h2>
                  <p className="text-muted-foreground">
                    You are responsible for maintaining the confidentiality of your account credentials
                    and for all activities under your account. You must provide accurate information
                    during registration.
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">Submission Guidelines</h2>
                  <p className="text-muted-foreground">
                    By submitting a manuscript, you warrant that it is original, not published
                    elsewhere, and does not infringe any third-party rights. You retain copyright
                    of your work and grant Paperas a non-exclusive license to publish.
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">Peer Review</h2>
                  <p className="text-muted-foreground">
                    Reviewers agree to provide objective, constructive feedback within agreed
                    timelines. All review content is confidential. Reviewers must disclose any
                    conflicts of interest.
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">Open Access</h2>
                  <p className="text-muted-foreground">
                    Published articles are made available under open access terms. Authors and
                    readers may share, distribute, and adapt published content in accordance
                    with the stated license.
                  </p>
                </div>
                <div>
                  <h2 className="font-serif text-xl font-semibold mb-2">Contact</h2>
                  <p className="text-muted-foreground">
                    For questions about these terms, contact us at{" "}
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
