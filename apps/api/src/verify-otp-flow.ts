import { UserService } from "./features/user/user.service";
import { InMemoryUserRepository } from "./features/user/user.repository";
import { InMemoryOtpRepository } from "./otp/in-memory-otp.repository";

async function main() {
  console.log("🚀 Starting OTP Flow Verification...");

  // 1. Setup Dependencies
  const userRepository = new InMemoryUserRepository();
  const otpRepository = new InMemoryOtpRepository();
  const userService = new UserService(userRepository, otpRepository);

  const mobileNumber = "+1234567890";

  try {
    // 2. Test Send OTP
    console.log(`\n📲 Sending OTP to ${mobileNumber}...`);
    const sendResult = await userService.sendOtp(mobileNumber);
    console.log("✅ Send OTP Result:", sendResult);

    if (!sendResult.code) {
      console.error("❌ OTP code not returned in development mode!");
      process.exit(1);
    }

    const otpCode = sendResult.code;

    // 3. Test Verify OTP
    console.log(`\n🔐 Verifying OTP ${otpCode} for ${mobileNumber}...`);
    const verifyResult = await userService.verifyOtp(mobileNumber, otpCode);
    console.log("✅ Verify OTP Result:", {
      token: verifyResult.token ? "JWT Token Generated" : "No Token",
      user: verifyResult.user,
    });

    // 4. Verify User Creation
    const user = await userRepository.findByMobileNumber(mobileNumber);
    if (user) {
      console.log(`\n👤 User found in DB: ${user.mobileNumber} (${user.role})`);
    } else {
      console.error("❌ User not found in DB after verification!");
    }

    console.log("\n✨ OTP Flow Verification Completed Successfully!");
  } catch (error) {
    console.error("\n❌ Verification Failed:", error);
    process.exit(1);
  }
}

main();
