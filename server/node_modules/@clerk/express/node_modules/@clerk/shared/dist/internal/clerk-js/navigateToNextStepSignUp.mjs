import { completeSignUpFlow } from "./completeSignUpFlow.mjs";

//#region src/internal/clerk-js/navigateToNextStepSignUp.ts
/**
* Routes a sign-up that's still in `missing_requirements` to the appropriate
* next step:
*
* - If the sign-up is protect-gated, go to the protect-check challenge.
* - Otherwise, if there are missing fields, go straight to the continue page so
*   the user can fill them in.
* - Otherwise, hand off to `completeSignUpFlow` which routes unverified email
*   or phone identifications to their respective verify pages.
*
* Used by both the OAuth callback handler and the sign-in `signUpIfMissing`
* transfer flow so they stay in lockstep.
*
* @internal
*/
const navigateToNextStepSignUp = ({ signUp, continueSignUpUrl, verifyEmailAddressUrl, verifyPhoneNumberUrl, signUpProtectCheckUrl, navigate }) => {
	if (signUp.protectCheck || signUp.missingFields.includes("protect_check")) return navigate(signUpProtectCheckUrl);
	if (signUp.missingFields.length) return navigate(continueSignUpUrl);
	return completeSignUpFlow({
		signUp,
		verifyEmailPath: verifyEmailAddressUrl,
		verifyPhonePath: verifyPhoneNumberUrl,
		protectCheckPath: signUpProtectCheckUrl,
		navigate
	});
};

//#endregion
export { navigateToNextStepSignUp };
//# sourceMappingURL=navigateToNextStepSignUp.mjs.map