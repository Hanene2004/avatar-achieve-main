import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DemoCredentialsProps {
  onFillCredentials: (email: string, password: string) => void;
}

export const DemoCredentials: React.FC<DemoCredentialsProps> = ({ onFillCredentials }) => {
  const { toast } = useToast();

  const demoEmail = "demo@liferpg.com";
  const demoPassword = "demo123";

  const handleCopyCredentials = () => {
    navigator.clipboard.writeText(`Email: ${demoEmail}\nPassword: ${demoPassword}`);
    toast({
      title: "Identifiants copiés !",
      description: "Les identifiants de démonstration ont été copiés dans le presse-papiers.",
    });
  };

  const handleFillDemo = () => {
    onFillCredentials(demoEmail, demoPassword);
    toast({
      title: "Identifiants remplis !",
      description: "Vous pouvez maintenant vous connecter avec le compte de démonstration.",
    });
  };

  return (
    <Card className="card-rpg border-accent/30 bg-accent/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <User className="w-4 h-4 text-accent" />
          Compte de démonstration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Email:</strong> {demoEmail}</p>
          <p><strong>Mot de passe:</strong> {demoPassword}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleFillDemo}
            className="flex-1 text-xs"
          >
            Remplir
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyCredentials}
            className="px-3"
          >
            <Copy className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};