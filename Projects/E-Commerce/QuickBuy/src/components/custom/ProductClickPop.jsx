import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FaStar, FaUserCircle } from "react-icons/fa";
import { Button } from "../ui/button";
import { Star } from "lucide-react";
import React, { useState } from "react";
import { CarausolImg } from "./Carausol";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export function ProductClickPop({ product, open, setOpen }) {
  const [comment, setComment] = useState(false);
  const navigate = useNavigate();
  // const User = JSON.parse(localStorage.getItem("UserData"));
  const UserData = JSON.parse(localStorage.getItem("UserData") || "null");
  if (!product) return null;
  const {
    title,
    brand,
    category,
    images = [],
    price,
    discountPercentage,
    rating,
    reviews = [],
    description,
    availabilityStatus,
    stock,
    warrantyInformation,
    returnPolicy,
    shippingInformation,
    sku,
    tags = [],
  } = product;

  function BuyHandle() {
    if (!UserData) {
      setOpen(false);
      toast.warning("Please login to proceed with buying.");
    } else {
      const existingCart = JSON.parse(localStorage.getItem("BuyData")) || [];
      existingCart.push(product);
      localStorage.setItem("BuyData", JSON.stringify(existingCart));
      setOpen(false);
      navigate("/Buy-now");
    }
  }
  function AddToCart() {
    if (!UserData) {
      setOpen(false);
      toast.warning("Please login to add items to cart.");
    } else {
      const existingCart = JSON.parse(localStorage.getItem("MyCart")) || [];
      existingCart.push(product);
      localStorage.setItem("MyCart", JSON.stringify(existingCart));
      toast.success("Product added to cart!");
      setOpen(false);
      setTimeout(() => {
        navigate(0);
      }, 1000);
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[70%] h-auto  bg-white p-0 shadow-2xl">
          {/* ================= HEADER ================= */}
          <DialogHeader className="border-b p-4">
            <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
            <DialogDescription className="text-sm text-gray-500">
              {brand} • {category}
            </DialogDescription>
          </DialogHeader>

          {/* ================= BODY ================= */}
          <div className="p-6">
            <CarausolImg images={images} />
            <div>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{Math.round(price)}
                </span>

                {discountPercentage && (
                  <span className="rounded bg-green-100 px-2 py-1 text-sm font-semibold text-green-700">
                    {Math.round(discountPercentage)}% OFF
                  </span>
                )}
              </div>

              {/* RATING */}
              <div
                onClick={() => setComment((prev) => !prev)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <span className="flex items-center gap-1 rounded bg-green-600 px-2 py-1 text-sm text-white">
                  {rating} <Star size={14} />
                </span>
                <span className="text-sm text-gray-500 hover:underline hover:text-blue-800">
                  {reviews.length} Reviews
                </span>
              </div>

              {/* ================= REVIEWS ================= */}
              <div className="overflow-y-auto max-h-[17vh]">
                {comment ? (
                  reviews.length > 0 && (
                    <div className="py-3">
                      <h3 className="mb-3 text-lg font-semibold">
                        Top reviews from Customers
                      </h3>
                      <div className="grid grid-cols-3 gap-4">
                        {reviews.map((review, index) => (
                          <div key={index}>
                            <div className="flex items-center justify-start gap-2 ">
                              <div className="flex items-center gap-2 ">
                                <p className="text-3xl text-gray-400">
                                  <FaUserCircle />
                                </p>
                                <p className="text-lg font-medium text-gray-600  ">
                                  {review.reviewerName}
                                </p>
                              </div>
                              <p className="text-xs font-medium text-gray-600">
                                {review.date.split("T")[0]}
                              </p>
                            </div>
                            <div className="flex justify-start items-center gap-6 py-4">
                              <p className="text-lg font-medium text-gray-900">
                                {review.comment}
                              </p>
                              <span className="text-md font-bold text-green-600 flex items-center gap-1">
                                <span className="text-xl">
                                  <FaStar />
                                </span>
                                {review.rating}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                ) : (
                  <>
                    <p className="text-gray-700 leading-relaxed py-2">
                      {description}
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-md">
                      <Info label="Availability" value={availabilityStatus} />
                      <Info label="Stock" value={`${stock} units`} />
                      <Info label="Warranty" value={warrantyInformation} />
                      <Info label="Return Policy" value={returnPolicy} />
                      <Info label="Shipping" value={shippingInformation} />
                      <Info label="SKU" value={sku} />
                      {tags.length > 0 && (
                        <div className="flex gap-2 flex-wrap">
                          {tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-blue-200 px-3 py-1 text-xs font-medium text-black"
                            >
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-4 pt-4">
                <Button
                  onClick={AddToCart}
                  className="flex-1 bg-yellow-400 text-black transition-all duration-700  hover:bg-white hover:text-yellow-400 hover:border hover:border-yellow-400"
                >
                  Add to Cart
                </Button>
                <Button
                  onClick={BuyHandle}
                  className="flex-1 bg-orange-500 hover:bg-white hover:text-orange-500 hover:border hover:border-orange-600 transition-all duration-700"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
function Info({ label, value }) {
  return (
    <div>
      <p className="text-gray-500">{label}</p>
      <p className="font-bold text-gray-800">{value}</p>
    </div>
  );
}
