import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm() {
  return (
    <div className={"flex flex-col gap-6"} >
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Enter Bookmark</h1>
                <p className="text-muted-foreground text-balance">
                  Paste your bookmark url here!
                </p>
              </div>
              <div className="grid gap-3">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  type="string"
                  placeholder="https://example.com"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Submit
              </Button>
            </div>
          </form>
          <div className="bg-muted relative hidden md:block">
            <img
              src="https://images.unsplash.com/photo-1541269676894-e7edc07ec4b1"
              alt="Image"
              className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
            />
          </div>
        </CardContent>
      </Card>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking submit, you agree to our <a href="#">Terms of Service</a>{" "}
        and <a href="#">Privacy Policy</a>.
      </div>
    </div>
  )
}
