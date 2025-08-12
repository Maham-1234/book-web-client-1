import { Calendar } from "lucide-react";

export const WelcomePanel = () => {
  return (
    <aside className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
      <div className="absolute inset-0 hero-gradient"></div>
      <div className="relative z-10 flex flex-col justify-center items-center p-12 text-white">
        <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center mb-8 backdrop-blur-sm">
          <Calendar className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold mb-4 text-center">
          Welcome Back to Book Web
        </h1>
        <p className="text-xl text-center opacity-90 max-w-md">
          Discover your next favorite read and find all the supplies you need to
          spark creativity and stay organized. Happy shopping!
        </p>
      </div>
      <img
        src="./bookstore-1.jpg?height=800&width=600"
        alt="Book Store"
        className="absolute inset-0 object-cover opacity-20 w-full h-full"
      />
    </aside>
  );
};
