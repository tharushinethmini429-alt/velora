import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LockKeyhole, Mail, LoaderCircle } from "lucide-react";

function AdminLogin() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setErrorMessage("");
        setIsLoading(true);
        
        try {
            const response = await fetch(
                "http://localhost:5000/api/admin/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password,
                    }),
                }
            );
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || "Login failed.");
            }
            if (!data.token) {
                throw new Error("Authentication token was not received.");
            }
            sessionStorage.setItem("velora_admin_token", data.token);
            navigate("/admin/dashboard");
            } catch (error) {
                setErrorMessage(
                    error instanceof Error
                    ? error.message
                    : "Something went wrong. Please try again."
                );
            } finally {
                setIsLoading(false);
            }
        };
        
        return (
        <div className="min-h-screen w-full bg-gradient-to-br from-[#FBF8F2] via-[#F3EDE4] to-[#E9DFD2] flex flex-col items-center justify-center px-5 py-12">
            <div className="w-full max-w-[560px] mx-auto">
                <div className="text-center mb-9">
                    <h1 className="font-serif text-5xl tracking-wide text-[#302721]">Velora<span className="text-[#B18A60]">.</span></h1>
                    <p className="mt-3 text-sm tracking-[0.2em] uppercase text-[#9A8574]">Administration Portal</p>
                </div>
                
                <div className="bg-white/55 backdrop-blur-xl border border-white/80 rounded-[28px] p-8 sm:p-14 shadow-[10px_10px_30px_rgba(166,150,130,0.22),-10px_-10px_30px_rgba(255,255,255,0.85)]">
                    <div className="mb-8">
                        <h2 className="font-serif text-3xl text-[#302721]">Welcome back</h2>
                        <p className="text-sm text-[#51483F] mt-2">Sign in to manage your Velora store.</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label htmlFor="admin-email" className="block text-sm font-medium text-[#4A4038] mb-2">Email Address</label>
                            
                            <div className="relative">
                                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18F80]"/>
                                <input id="admin-email" type="email" value={email}
                                onChange={(event) => setEmail(event.target.value)}
                                placeholder="Enter your admin email" required autoComplete="username"
                                className="w-full min-w-0 border border-[#E0D8CE] bg-[#F9F7F3] py-4 pl-11 pr-4 text-sm text-[#2D2D2D] placeholder:text-[#6B625A] rounded-xl outline-none shadow-[inset_2px_2px_5px_rgba(100,85,65,0.08)] focus:border-[#B18A60] focus:ring-2 focus:ring-[#B18A60]/20 transition-all duration-300"/>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="admin-password" className="block text-sm font-medium text-[#4A4038] mb-2">Password</label>
                            <div className="relative">
                                <LockKeyhole size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A18F80]"/>
                                <input id="admin-password" type={showPassword ? "text" : "password"} value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                placeholder="Enter your password" required autoComplete="current-password"
                                className="w-full min-w-0 border border-[#E0D8CE] bg-[#F9F7F3] py-4 pl-11 pr-12 text-sm text-[#2D2D2D] placeholder:text-[#6B625A] rounded-xl outline-none shadow-[inset_2px_2px_5px_rgba(100,85,65,0.08)] focus:border-[#B18A60] focus:ring-2 focus:ring-[#B18A60]/20 transition-all duration-300"/>

                                <button type="button" onClick={() => setShowPassword(!showPassword)} 
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A18F80]" aria-label={showPassword ? "Hide password" : "Show password"}>
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {errorMessage && (
                            <p className="text-sm text-red-600 bg-red-50 border border-red-100 p-3">
                                {errorMessage}
                            </p>
                        )}
                        <button type="submit" disabled={isLoading}
                        className="w-full bg-[#252321] text-white py-5 text-base tracking-[0.18em] uppercase rounded-sm shadow-[0_5px_0_#171513,0_10px_20px_rgba(0,0,0,0.18)] hover:bg-[#493B30] hover:-translate-y-0.5 hover:shadow-[0_7px_0_#171513,0_14px_24px_rgba(0,0,0,0.2)] active:translate-y-1 active:shadow-none transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed">
                            {isLoading ? (
                                <>
                                <LoaderCircle size={18} className="animate-spin" />
                                <span>Signing in...</span>
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>
                    </form>
                </div>
                <p className="w-full text-center text-sm text-[#51483F] mt-8">&copy; {new Date().getFullYear()} Velora. Admin Access Only.</p>
            </div>
        </div>
    );
}

export default AdminLogin;
