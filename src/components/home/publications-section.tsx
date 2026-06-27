import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const publications = [
  {
    id: "1",
    title: "Machine Learning Approaches for Agricultural Crop Prediction in Semi-Arid Regions",
    authors: "Priya Sharma, Rajesh Kumar, Ananya Patel",
    abstract: "This study presents a novel ensemble approach combining random forests and gradient boosting for crop yield prediction...",
    doi: "10.1234/rvj.2026.0001",
    category: "Computer Science",
  },
  {
    id: "2",
    title: "Sustainable Water Resource Management in Urban Indian Cities",
    authors: "Amit Verma, Sneha Reddy",
    abstract: "An integrated framework for water resource management incorporating IoT sensors and predictive analytics...",
    doi: "10.1234/rvj.2026.0002",
    category: "Environmental Science",
  },
  {
    id: "3",
    title: "Traditional Medicine and Modern Pharmacology: A Systematic Review",
    authors: "Deepak Gupta, Meera Nair",
    abstract: "A comprehensive review of Ayurvedic formulations with demonstrated pharmacological activity...",
    doi: "10.1234/rvj.2026.0003",
    category: "Pharmacology",
  },
];

export function PublicationsSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-serif text-3xl font-semibold text-primary">
            Latest Publications
          </h2>
          <Button variant="outline" asChild>
            <Link href="/research">View All</Link>
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {publications.map((pub) => (
            <Card key={pub.id} className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className="text-xs border-secondary text-secondary">
                    {pub.category}
                  </Badge>
                </div>
                <CardTitle className="font-serif text-lg leading-snug group-hover:text-secondary transition-colors">
                  <Link href={`/research/${pub.id}`}>{pub.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">{pub.authors}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{pub.abstract}</p>
                <p className="mt-4 font-mono text-xs text-muted-foreground">DOI: {pub.doi}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
