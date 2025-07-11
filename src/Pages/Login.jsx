import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import LoginPageLogo from "../assets/loginPageLogo.svg";
import GooglePlaystore from "../assets/googlePlaystore.svg";
import Appstore from "../assets/appStore.svg";
import BackgroundImage from "../assets/loginBackground.svg";
import { loginUser } from "../redux/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { auth, roleName, isLoading, error } = useSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (roleName) {
      navigate(roleName === "ADMIN" ? "/dashboard" : "/mySchedule");
    }
  }, [roleName]);

  const handleLogin = async () => {
    const response = await dispatch(loginUser({ email, password }));

    if (response.meta.requestStatus === "fulfilled") {
      // ✅ Redirect based on role
    }
  };

  return (
    <div className="relative w-full h-screen bg-[#003570] overflow-hidden">
      {/* Top-left glowing circle with stroke */}
      <div className="absolute w-[500px] h-[500px] top-[-250px] left-[-250px] rounded-full border border-white/30 bg-white/5 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)]" />

      {/* Bottom-right glowing circle with stroke */}
      <div className="absolute w-[500px] h-[500px] bottom-[-250px] right-[-250px] rounded-full border border-white/30 bg-white/5 shadow-[inset_0_0_100px_rgba(255,255,255,0.1)]" />

      {/* Login Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        <div className="w-lg flex flex-col justify-center items-center bg-white shadow-lg rounded-2xl p-8 ">
          <img src={LoginPageLogo} alt="" className="w-40 pb-8" />
          <div className="w-full ">
            <h2 className="text-3xl font-semibold mb-2 text-center">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-6 text-center">
              Sign in with social account or enter your details.
            </p>

            {/* Email Input */}
            <div className="mb-4 relative">
              {/* <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}
              <label htmlFor="" className="ml-1 font-semibold">
                Email
              </label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 mt-2 rounded-xl focus:outline-none focus:ring-2 bg-[#F5F6F7] focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <label htmlFor="" className="ml-1 font-semibold ">
              Password
            </label>
            <div className="mb-4 relative">
              {/* <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" /> */}

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full mt-2  p-3 bg-[#F5F6F7] border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <IoEyeOutline className="cursor-pointer hover:text-blue-700" />
                ) : (
                  <IoEyeOffOutline className="cursor-pointer hover:text-blue-700" />
                )}
              </button>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center mb-6 ">
              <label className="flex items-center text-gray-600  font-semibold">
                <input
                  type="checkbox"
                  className="mr-2 w-5 h-5 accent-[#008CC8]"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <a href="#" className="underline text-sm font-semibold">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full cursor-pointer bg-[#008CC8] text-white p-3 rounded-lg font-semibold hover:bg-[#008cc8e4] transition-colors disabled:opacity-50"
            >
              Log in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
