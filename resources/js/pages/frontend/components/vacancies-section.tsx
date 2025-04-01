import { Link } from '@inertiajs/react';
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building, Clock, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function JobsSection() {
    // Sample vacancies data
    const vacancies = [
        {
            id: 1,
            title: "Senior Frontend Developer",
            company: "TechCorp",
            location: "San Francisco, CA",
            type: "Remote",
            salaryRange: "$120,000 - $150,000",
            postedDate: "2 days ago",
            languages: ["React", "TypeScript", "Next.js"],
        },
        {
            id: 2,
            title: "Backend Engineer",
            company: "DataSystems",
            location: "New York, NY",
            type: "Hybrid",
            salaryRange: "$130,000 - $160,000",
            postedDate: "1 week ago",
            languages: ["Python", "Django", "PostgreSQL"],
        },
        {
            id: 3,
            title: "Full Stack Developer",
            company: "InnovateTech",
            location: "Austin, TX",
            type: "On-site",
            salaryRange: "$110,000 - $140,000",
            postedDate: "3 days ago",
            languages: ["JavaScript", "Node.js", "React", "MongoDB"],
        },
    ]

    // Job type badge variants
    const typeVariants = {
        Remote: "default",
        Hybrid: "secondary",
        "On-site": "outline",
    }

    return (
        <section id="vacancies" className="w-full py-12 md:py-24 bg-background">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Job Opportunities</h2>
                        <p className="max-w-[700px] text-muted-foreground">
                            Find your next career opportunity in tech with companies looking for talented professionals like you.
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <Link
                            href="/vacancies"
                            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            View All Jobs
                        </Link>
                        <Link
                            href="/post-vacancy"
                            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                            Post a Job
                        </Link>
                    </div>
                </div>

                <div className="mt-8 space-y-4">
                    {vacancies.map((vacancy) => (
                        <Card key={vacancy.id} className="overflow-hidden transition-all hover:shadow-md">
                            <CardHeader>
                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                    <div>
                                        <CardTitle className="text-xl">{vacancy.title}</CardTitle>
                                        <div className="mt-1 flex items-center gap-2 text-muted-foreground">
                                            <Building className="h-4 w-4" />
                                            <span>{vacancy.company}</span>
                                        </div>
                                    </div>
                                    <Badge
                                        variant={typeVariants[vacancy.type] as "default" | "secondary" | "outline"}
                                        className="mt-2 sm:mt-0"
                                    >
                                        {vacancy.type}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="flex items-center gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-muted-foreground" />
                                        <span>{vacancy.location}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm">
                                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                                        <span>{vacancy.salaryRange}</span>
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    {vacancy.languages.map((lang) => (
                                        <Badge key={lang} variant="secondary">
                                            {lang}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                            <CardFooter className="flex items-center justify-between border-t bg-muted/20 px-6 py-3">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Clock className="h-4 w-4" />
                                    <span>Posted {vacancy.postedDate}</span>
                                </div>
                                <Button size="sm">Apply Now</Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                <div className="mt-8 flex justify-center">
                    <Link href="/vacancies">
                        <Button variant="outline">Browse All Job Listings</Button>
                    </Link>
                </div>
            </div>
        </section>
    )
}

