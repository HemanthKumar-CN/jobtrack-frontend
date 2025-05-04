import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import CalendarLogo from "../assets/whiteLogo.png";
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
    <div
      className="h-screen w-full flex justify-center items-center bg-cover bg-center bg-neutral-300"
      // style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="flex h-3/4 w-2/3 m-auto">
        {/* Left Section */}
        <div
          className="flex flex-col justify-center rounded-l-4xl w-1/2
         bg-[#3255F0] text-white relative p-8 pl-13 "
        >
          {/* <div
          className="flex flex-col justify-center rounded-l-4xl w-1/2 opacity-80
         bg-[#3255F0] text-white relative p-8 pl-13 "
        > */}
          <h1 className="text-3xl font-bold mb-2 flex justify-between w-64">
            <img src={CalendarLogo} alt="" className="" />
          </h1>
          <div className="flex gap-4 mt-4">
            {/* <button className=" text-white py-2 rounded">
              <img src={GooglePlaystore} alt="" />
            </button>
            <button className=" text-white px-4 py-2 rounded">
              <img src={Appstore} alt="" />
            </button> */}
          </div>
        </div>

        {/* Right Section */}
        <div className="w-1/2 flex justify-center items-center bg-white shadow-lg rounded-r-4xl p-8">
          <div className="w-full max-w-sm">
            <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-500 mb-6">Please sign in to continue</p>

            {/* Email Input */}
            <div className="mb-4 relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                placeholder="Enter your email here"
                className="w-full pl-10 p-3 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Password Input */}
            <div className="mb-4 relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full pl-10 p-3 border border-gray-300 rounded-4xl focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="flex justify-between items-center mb-6">
              <label className="flex items-center text-gray-600  font-semibold">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                />
                Remember me
              </label>
              <a href="#" className="text-[#3255F0] text-sm font-semibold">
                Forgot password?
              </a>
            </div>

            {/* Login Button */}
            <button
              onClick={handleLogin}
              className="w-full cursor-pointer bg-[#3255F0] text-white p-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
