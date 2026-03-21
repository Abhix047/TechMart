import { useParams, Link } from "react-router-dom";

export default function Order() {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      
      {/* Premium Card Container */}
      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 max-w-lg w-full text-center relative overflow-hidden">
        
        {/* Top Green Accent Line */}
        <div className="absolute top-0 left-0 w-full h-2 bg-green-500"></div>

        {/* Success Checkmark Icon */}
        <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-green-100">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>

        {/* Headings */}
        <h1 className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight">
          Order Successful! 🎉
        </h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          Thank you for shopping with Tech Mart. We've received your order and are getting it ready for dispatch.
        </p>

        {/* Highlighted Order ID Box */}
        <div className="bg-gray-50 border border-gray-200 border-dashed rounded-2xl p-5 mb-8">
          <p className="text-sm text-gray-500 mb-1 font-medium">Your Order ID</p>
          <p className="font-mono text-lg font-bold text-gray-900 tracking-wider break-all">
            {id}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/orders"
            className="flex-1 bg-black text-white px-6 py-4 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
          >
            Track Order
          </Link>
          <Link
            to="/"
            className="flex-1 bg-white text-gray-900 border border-gray-200 px-6 py-4 rounded-xl font-bold hover:bg-gray-50 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}