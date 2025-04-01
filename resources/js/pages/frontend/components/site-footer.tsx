import { Link } from '@inertiajs/react';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Github, Twitter, Linkedin, Facebook } from "lucide-react"

export function SiteFooter() {
    return (
        <footer className="w-full border-t bg-background">
            <div className="container px-4 py-12 md:px-6 md:py-16 lg:py-20">
                <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5">
                    <div className="lg:col-span-2">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="inline-block h-6 w-6 rounded-full bg-primary"></span>
                            <span className="font-bold">TechHub</span>
                        </Link>
                        <p className="mt-4 max-w-xs text-sm text-muted-foreground">
                            Your gateway to tech resources, connecting developers with blogs, products, and job opportunities.
                        </p>
                        <div className="mt-6 flex space-x-4">
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                            <Link href="#" className="text-muted-foreground hover:text-foreground">
                                <Facebook className="h-5 w-5" />
                                <span className="sr-only">Facebook</span>
                            </Link>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">Resources</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="/products" className="text-muted-foreground hover:text-foreground">
                                    Products
                                </Link>
                            </li>
                            <li>
                                <Link href="/jobs" className="text-muted-foreground hover:text-foreground">
                                    Jobs
                                </Link>
                            </li>
                            <li>
                                <Link href="/community" className="text-muted-foreground hover:text-foreground">
                                    Community
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">Company</h3>
                        <ul className="mt-4 space-y-2 text-sm">
                            <li>
                                <Link href="/about" className="text-muted-foreground hover:text-foreground">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                                    Privacy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                                    Terms
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-sm font-medium">Subscribe</h3>
                        <p className="mt-4 text-sm text-muted-foreground">
                            Get the latest updates and news delivered to your inbox.
                        </p>
                        <form className="mt-4 flex flex-col gap-2">
                            <Input type="email" placeholder="Enter your email" />
                            <Button type="submit">Subscribe</Button>
                        </form>
                    </div>
                </div>
                <div className="mt-12 border-t pt-6">
                    <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                        <p className="text-center text-sm text-muted-foreground">
                            &copy; {new Date().getFullYear()} TechHub. All rights reserved.
                        </p>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                            <Link href="/privacy" className="hover:text-foreground">
                                Privacy Policy
                            </Link>
                            <Link href="/terms" className="hover:text-foreground">
                                Terms of Service
                            </Link>
                            <Link href="/cookies" className="hover:text-foreground">
                                Cookie Policy
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

