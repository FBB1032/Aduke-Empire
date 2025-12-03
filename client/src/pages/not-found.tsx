import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-secondary/5 p-4">
      <Card className="w-full max-w-md border-primary/10 shadow-2xl shadow-primary/5 rounded-4xl bg-white/80 backdrop-blur-xl">
        <CardContent className="pt-12 pb-12 px-8 text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-destructive/5 flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-10 w-10 text-destructive/60" />
          </div>
          
          <div className="space-y-2">
            <h1 className="font-brand text-5xl text-primary">Page Not Found</h1>
            <p className="text-muted-foreground text-lg font-light">
              The page you are looking for doesn't exist or has been moved.
            </p>
          </div>

          <div className="pt-6">
            <Link href="/">
              <Button className="rounded-full px-8 h-12 text-base shadow-lg hover:shadow-xl transition-all duration-300">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
