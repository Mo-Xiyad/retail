import { SignIn } from '@clerk/nextjs';
import SignInPageLayout from './SignInPageLayout';
export default function Page() {
  return (
    <SignInPageLayout>
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: {
              background: '#30AACE'
            },
            headerSubtitle: {
              display: 'none'
            },
            headerTitle: {
              textAlign: 'center',
              color: 'white',
              textShadow: '0 0 10px rgba(27, 39, 53, 0.8)'
            },
            formButtonSecondary: {
              color: 'white'
            },
            footerActionText: {
              display: 'none'
            },
            footerActionLink: {
              display: 'none'
            },
            dividerText: {
              fontSize: 20
            }
          },
          variables: {
            // shadowShimmer: '0 0 10px rgba(27, 39, 53, 0.8)'
            // colorBackground: 'transparent',
            // colorText: 'white'
          }
        }}
      />
    </SignInPageLayout>
  );
}
