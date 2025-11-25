import React from "react";
import { Link } from "react-router-dom";
import Button from "../components/UI/Button";
import Lottie from "lottie-react";
import notFoundAnim from "../assets/404error.json";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 gap-6 px-4">
      <div className="max-w-lg">
        <Lottie animationData={notFoundAnim} loop />
      </div>

      <h1 className="text-4xl font-bold">404</h1>
      <p className="text-lg mb-0">Page not found.</p>

      <Link to="/">
        <Button className="mt-0" variant="default" size="default">
          Go back home
        </Button>
      </Link>
    </div>
  );
}
