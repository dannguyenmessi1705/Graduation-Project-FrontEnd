"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loading } from "@/components/Loading";

export function AIChatButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const apiResponse = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ input }),
      });

      if (!apiResponse.ok) {
        throw new Error("Failed to generate AI response");
      }

      const data = await apiResponse.json();
      setResponse(data.response);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <motion.div
        className="fixed bottom-20 right-10 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="size-16 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        >
          <Sparkles className="size-6 text-primary-foreground" />
        </Button>
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md rounded-lg bg-card p-6 shadow-lg"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.3 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => setIsOpen(false)}
              >
                <X className="size-4" />
              </Button>
              <h2 className="mb-4 text-2xl font-bold text-foreground">
                Chat with AI
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="min-h-[100px] text-foreground"
                  required
                />
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loading size={16} color="primary-foreground" />
                  ) : (
                    "Send"
                  )}
                </Button>
              </form>
              {response && (
                <div className="mt-4 rounded-lg bg-muted p-4">
                  <h3 className="mb-2 font-semibold text-foreground">
                    AI Response:
                  </h3>
                  <p className="whitespace-pre-wrap text-sm text-foreground">
                    {response}
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
