import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { OWNER_PHONE, openWhatsApp } from '@/lib/whatsapp';

interface MessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  propertyTitle?: string;
}

const MessageModal = ({ isOpen, onClose, propertyTitle }: MessageModalProps) => {
  const [message, setMessage] = useState('');
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() || !senderName.trim() || !senderPhone.trim()) {
      toast({ title: 'Missing Information', description: 'Please fill in all fields.', variant: 'destructive' });
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from('inquiries').insert({
        user_id: user.id,
        inquiry_type: 'message',
        property_title: propertyTitle ?? 'General Inquiry',
        message,
        sender_name: senderName,
        sender_phone: senderPhone,
      });
    }

    const text = encodeURIComponent(
      `New inquiry from Nearby Estate Service:\n\nName: ${senderName}\nPhone: ${senderPhone}\n\nProperty: ${propertyTitle || 'General Inquiry'}\n\nMessage: ${message}`
    );
    window.open(`https://wa.me/91${OWNER_PHONE}?text=${text}`, '_blank');

    toast({ title: 'Message Sent!', description: 'Redirecting to WhatsApp…' });
    setMessage(''); setSenderName(''); setSenderPhone('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" /> Send Message
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {propertyTitle && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <Label className="text-sm font-medium">Property:</Label>
              <p className="text-sm text-gray-700">{propertyTitle}</p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Your Name *</Label>
            <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Your Phone *</Label>
            <Input value={senderPhone} onChange={(e) => setSenderPhone(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Message *</Label>
            <Textarea rows={4} value={message} onChange={(e) => setMessage(e.target.value)} />
          </div>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            📱 Message will be sent to: +91 {OWNER_PHONE} via WhatsApp
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">Cancel</Button>
            <Button onClick={handleSendMessage} className="flex-1">
              <Send className="h-4 w-4 mr-2" /> Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
