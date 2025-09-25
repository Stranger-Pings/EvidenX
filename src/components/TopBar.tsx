import React, { useState } from "react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { ScrollArea } from "./ui/scroll-area";
import {
  Bell,
  User,
  Settings,
  LogOut,
  AlertCircle,
  Clock,
  FileText,
  Video,
  Headphones,
} from "lucide-react";

interface Notification {
  id: string;
  type: "success" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: React.ReactNode;
}

interface TopBarProps {
  investigatorName?: string;
  investigatorRole?: string;
  investigatorImage?: string;
}

export function TopBar({
  investigatorName = "Inspector Sarah Williams",
  investigatorRole = "Senior Investigating Officer",
  investigatorImage,
}: TopBarProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Video Analysis Complete",
      message:
        "CCTV footage analysis has been completed. 3 suspects identified with facial recognition.",
      timestamp: "2 minutes ago",
      read: false,
      icon: <Video className="h-4 w-4" />,
    },
    {
      id: "2",
      type: "info",
      title: "Follow-up Questions Generated",
      message:
        "AI has generated 5 potential follow-up questions based on witness testimony analysis.",
      timestamp: "15 minutes ago",
      read: false,
      icon: <FileText className="h-4 w-4" />,
    },
    {
      id: "3",
      type: "success",
      title: "Audio Processing Complete",
      message:
        "Transcript generated for witness statement. Ready for comparison analysis.",
      timestamp: "1 hour ago",
      read: true,
      icon: <Headphones className="h-4 w-4" />,
    },
    {
      id: "4",
      type: "warning",
      title: "Case Update Required",
      message:
        "FIR/2024/001 requires status update. Evidence review deadline approaching.",
      timestamp: "2 hours ago",
      read: true,
      icon: <AlertCircle className="h-4 w-4" />,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "text-green-400";
      case "warning":
        return "text-yellow-400";
      case "info":
        return "text-blue-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="h-14 border-b border-border bg-card px-6 flex items-center justify-between">
      {/* Logo/Brand */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <img
            src="/src/components/images/logo.png"
            alt="EvidenX Logo"
            className="h-12 w-12"
          />
          <h1 className="text-2xl font-bold">
            Eviden<span className="text-[#00a4db]">X</span>
          </h1>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-destructive">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Notifications</h4>
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs"
                  >
                    Mark all read
                  </Button>
                )}
              </div>
            </div>
            <ScrollArea className="h-96">
              <div className="p-2">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors hover:bg-muted/50 ${
                      !notification.read ? "bg-muted/30" : ""
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div className={getNotificationColor(notification.type)}>
                        {notification.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {notification.timestamp}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </PopoverContent>
        </Popover>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 px-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={investigatorImage} />
                <AvatarFallback>
                  <User className="h-4 w-4" />
                </AvatarFallback>
              </Avatar>
              <div className="text-left hidden md:block">
                <div className="text-sm font-medium">{investigatorName}</div>
                <div className="text-xs text-muted-foreground">
                  {investigatorRole}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <div className="px-2 py-2 border-b border-border">
              <div className="flex items-center gap-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={investigatorImage} />
                  <AvatarFallback>
                    <User className="h-5 w-5" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium text-sm">{investigatorName}</div>
                  <div className="text-xs text-muted-foreground">
                    {investigatorRole}
                  </div>
                </div>
              </div>
            </div>
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings className="mr-2 h-4 w-4" />
              Change Password
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
