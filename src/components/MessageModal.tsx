
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MessageCircle, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

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

  const handleSendMessage = () => {
    if (!message.trim() || !senderName.trim() || !senderPhone.trim()) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields before sending the message.",
        variant: "destructive",
      });
      return;
    }

    // Simulate sending message to WhatsApp
    const whatsappNumber = "919123281797";
    const encodedMessage = encodeURIComponent(
      `New inquiry from EstateHub:\n\nName: ${senderName}\nPhone: ${senderPhone}\n\nProperty: ${propertyTitle || 'General Inquiry'}\n\nMessage: ${message}`
    );
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "Message Sent!",
      description: "Your message has been sent via WhatsApp. You will be redirected to WhatsApp to complete the conversation.",
    });
    
    // Reset form
    setMessage('');
    setSenderName('');
    setSenderPhone('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Send Message
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
            <Label htmlFor="sender-name">Your Name *</Label>
            <Input
              id="sender-name"
              placeholder="Enter your full name"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sender-phone">Your Phone Number *</Label>
            <Input
              id="sender-phone"
              placeholder="Enter your phone number"
              value={senderPhone}
              onChange={(e) => setSenderPhone(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              placeholder="Type your message here..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>
          
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p>📱 Your message will be sent to: +91 9123281797 via WhatsApp</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSendMessage} className="flex-1">
              <Send className="h-4 w-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageModal;
