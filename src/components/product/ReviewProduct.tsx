import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

const CustomStar = ({ filled, onClick, className }: { filled: boolean; onClick: () => void; className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 20 20"
    fill="currentColor"
    className={`w-6 h-6 cursor-pointer transition-colors ${filled ? 'text-foreground' : 'text-muted-foreground/30'} ${className}`}
    onClick={onClick}
  >
    <path
      fillRule="evenodd"
      d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z"
      clipRule="evenodd"
    />
  </svg>
);

interface ReviewProductProps {
  onSubmitted?: () => void;
}

const ReviewProduct = ({ onSubmitted }: ReviewProductProps) => {
  const [rating, setRating] = useState(0);
  const [description, setDescription] = useState("");
  const [fullName, setFullName] = useState("");
  const [profile, setProfile] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ name: string; avatar: string } | null>(null);

  // Detect Google-authenticated user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const user = data?.user;
      if (user) {
        const meta: any = user.user_metadata || {};
        const name = meta.full_name || meta.name || user.email || "";
        const avatar = meta.avatar_url || meta.picture || "";
        if (name) {
          setGoogleUser({ name, avatar });
          setFullName(name);
          setProfile(avatar);
        }
      }
    });
  }, [isOpen]);

  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.href },
    });
  };

  const submitReview = async () => {
    if (rating === 0 || description.trim() === "") return;
    setSubmitting(true);
    const { error } = await (supabase as any).from("Reviews").insert({
      FullName: fullName.trim() || "Anonymous",
      star: rating,
      profile: profile.trim() || null,
      description: description.trim(),
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Could not submit review", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Thank you!", description: "Your review has been posted." });
    setIsOpen(false);
    setRating(0);
    setDescription("");
    if (!googleUser) {
      setFullName("");
      setProfile("");
    }
    onSubmitted?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full h-12 font-light rounded-none border-foreground text-foreground hover:bg-foreground hover:text-background"
        >
          Write a review
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md !rounded-none">
        <DialogHeader>
          <DialogTitle className="font-light text-xl">Write a review</DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          {!googleUser && (
            <Button
              type="button"
              variant="outline"
              onClick={signInWithGoogle}
              className="w-full h-11 rounded-none font-light gap-2"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.83z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z"/>
              </svg>
              Continue with Google
            </Button>
          )}

          {googleUser && (
            <div className="flex items-center gap-3 p-3 border border-border">
              {googleUser.avatar ? (
                <img src={googleUser.avatar} alt={googleUser.name} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-sm font-light">
                  {googleUser.name.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <p className="text-sm font-light">{googleUser.name}</p>
                <p className="text-xs text-muted-foreground">Signed in with Google</p>
              </div>
            </div>
          )}

          {!googleUser && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">Full name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  maxLength={100}
                  className="rounded-none font-light"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-light text-foreground">Profile picture URL (optional)</label>
                <Input
                  value={profile}
                  onChange={(e) => setProfile(e.target.value)}
                  placeholder="https://..."
                  className="rounded-none font-light"
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-light text-foreground">Rating</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <CustomStar
                  key={star}
                  filled={star <= rating}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-light text-foreground">Your review</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Share your thoughts about this product..."
              maxLength={1000}
              className="min-h-24 resize-none rounded-none font-light"
            />
          </div>

          <Button
            onClick={submitReview}
            disabled={rating === 0 || description.trim() === "" || submitting}
            className="w-full h-12 bg-foreground text-background hover:bg-foreground/90 font-light rounded-none"
          >
            {submitting ? "Submitting..." : "Submit review"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewProduct;
