// import React from "react";
// import { useEffect } from "react";
import {
  FaUserAlt,
  FaEnvelope,
  FaPhone,
  //   FaPassport,
  FaMapMarkerAlt,
  FaFileAlt,
  // FaIdCard,
} from "react-icons/fa";
import { IoLanguage } from "react-icons/io5";
import { useLocation } from "react-router-dom";

export const Profile = () => {
  const location = useLocation();
  const AllData = location.state;
  console.log(AllData, ">>>>>>>");

  const today = new Date();
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-blue-100 to-blue-200 flex items-center justify-center py-16 px-8 relative overflow-hidden">
      {/* Decorative Glows */}
      <div className="absolute top-[-120px] left-[-120px] w-80 h-80 bg-blue-300/40 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-150px] right-[-150px] w-96 h-96 bg-blue-400/30 rounded-full blur-3xl animate-pulse"></div>

      <div className="relative z-10 max-w-6xl w-full bg-white/70 backdrop-blur-2xl rounded-3xl shadow-2xl border border-blue-100 overflow-hidden">
        {/* Header */}
        <div className="bg-linear-to-r from-blue-800 to-blue-600 py-10 text-center text-white shadow-inner">
          <h1 className="text-5xl font-extrabold tracking-tight drop-shadow-md">
            Visa Applicant Profile
          </h1>
          <p className="text-blue-200 mt-2 text-lg font-medium">
            A detailed view of your submitted information
          </p>
        </div>

        {/* Body */}
        <div className="p-10 grid md:grid-cols-2 gap-10">
          {/* Personal Information */}
          <div className="relative group bg-white/90 backdrop-blur-lg border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute top-[-30px] right-[-30px] w-20 h-20 bg-blue-200/40 rounded-full blur-2xl group-hover:bg-blue-300/50 transition-all"></div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <FaUserAlt className="text-blue-600" /> Personal Information
            </h2>
            <ul className="text-gray-700 text-base space-y-3">
              <li>
                <span className="font-semibold text-gray-900">
                  Full Name :{" "}
                </span>
                {AllData ? AllData.PersData.Students_Fullname : "Numaan"}
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  Date of Birth : {""}
                </span>

                {AllData ? AllData.PersData.Date_of_Birth : "14-05-2004"}
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  Gender : {""}
                </span>

                {AllData ? AllData.PersData.Students_gender : "Male"}
              </li>
              <li>
                <span className="font-semibold text-gray-900">
                  Nationality : {""}
                </span>
                {AllData ? AllData.PersData.Nationality : "Indian"}
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="relative group bg-white/90 backdrop-blur-lg border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.02]">
            <div className="absolute bottom-[-30px] left-[-30px] w-20 h-20 bg-blue-200/40 rounded-full blur-2xl group-hover:bg-blue-300/50 transition-all"></div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3">
              <FaPhone className="text-blue-600" /> Contact Information
            </h2>
            <ul className="text-gray-700 text-base space-y-3">
              <li className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />{" "}
                {AllData ? AllData.ConInfo.Email : "numaankazi145@gmail.com"}
              </li>
              <li className="flex items-center gap-2">
                <FaPhone className="text-blue-500" />{" "}
                {AllData ? AllData.ConInfo.Mobile_Number : "9156538381"}
              </li>
              <li className="flex items-center gap-2">
                <FaMapMarkerAlt className="text-blue-500" />{" "}
                {AllData ? AllData.ConInfo.City : "Pune"}
              </li>
              <li className="flex items-center gap-2">
                <IoLanguage className="text-blue-500" /> Language:{" "}
                {AllData ? AllData.ConInfo.Communication_Language : "English"}
              </li>
            </ul>
          </div>

          {/* Document Verification */}
          <div className="md:col-span-2 relative group bg-white/90 backdrop-blur-lg border border-blue-100 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-500 hover:scale-[1.01]">
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl transition-all"></div>
            <h2 className="text-2xl font-bold text-blue-900 mb-6 flex items-center gap-3 relative z-10">
              <FaFileAlt className="text-blue-600" /> Document Verification
            </h2>

            <div className="grid md:grid-cols-2 gap-6 relative z-10">
              <ul className="text-gray-700 text-base space-y-3">
                <li>
                  <span className="font-semibold text-gray-900">
                    Previous Passport Number:
                  </span>{" "}
                  {AllData
                    ? AllData.documentData.Previous_Passports
                    : "XXXX XXXX XXXX 1234"}
                </li>
                <li>
                  <span className="font-semibold text-gray-900">
                    Bookings Details :
                  </span>{" "}
                  {AllData
                    ? AllData.documentData.Bookings_Details
                    : "XXXX XXXX XXXX 1234"}
                </li>
                <li>
                  <span className="font-semibold text-gray-900">
                    Visa Application ID:
                  </span>{" "}
                  {AllData
                    ? AllData.documentData.Visa_Application
                    : "XXXX XXXX XXXX CE34"}
                </li>
              </ul>
              <ul className="text-gray-700 text-base space-y-3">
                <li>
                  <span className="font-semibold text-gray-900">
                    Image Scan:
                  </span>{" "}
                  Successfully ✅
                </li>
                <li>
                  <span className="font-semibold text-gray-900">
                    Submission Date:
                  </span>{" "}
                  {today.toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </li>
                <li>
                  <span className="font-semibold text-gray-900">
                    Documents Approved :
                  </span>{" "}
                  {AllData ? AllData.documentData.Documents_Approved : "Yes"}
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-linear-to-r from-blue-100 to-blue-50 p-6 text-center border-t border-blue-200">
          <p className="text-gray-600 text-sm tracking-wide">
            © {new Date().getFullYear()} Visa Immigration Portal — All Rights
            Reserved
          </p>
        </div>
      </div>
    </div>
  );
};
