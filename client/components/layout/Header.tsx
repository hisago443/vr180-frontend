import { Link, NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, Play, User, LogOut, Settings } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export default function Header() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition",
          isActive && "text-foreground"
        )
      }
    >
      {children}
    </NavLink>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-gradient-to-br from-primary to-accent grid place-items-center">
              <Play className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-extrabold tracking-tight text-foreground">VeroVR</span>
          </Link>
          <nav className="hidden md:flex items-center ml-8">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/how-it-works">How It Works</NavItem>
            <NavItem to="/library">Library</NavItem>
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          {!loggedIn ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/auth")}>Login</Button>
              <Button onClick={() => navigate("/dashboard")}>Start Converting</Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="size-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/dashboard")}>Dashboard</DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLoggedIn(false)} className="text-destructive">
                  <LogOut className="mr-2 size-4" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" aria-label="Toggle menu">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="mt-8 flex flex-col gap-1">
                <NavLink to="/" className="px-3 py-2 text-base rounded hover:bg-accent/10">Home</NavLink>
                <NavLink to="/how-it-works" className="px-3 py-2 text-base rounded hover:bg-accent/10">How It Works</NavLink>
                <NavLink to="/library" className="px-3 py-2 text-base rounded hover:bg-accent/10">Library</NavLink>
                <div className="h-px bg-border my-3" />
                <Button variant="ghost" className="justify-start" onClick={() => navigate("/auth")}>Login</Button>
                <Button onClick={() => navigate("/dashboard")}>Start Converting</Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
