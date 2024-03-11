export default function SignInPageLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <main id="top" className="flex flex-1 flex-col ">
      <div className="absolute top-0 left-10 z-50 mt-4 mr-2"></div>
      <section>
        <div className="relative flex flex-1">
          <div className="relative z-10 flex px-4 h-screen w-screen">
            <div className="flex flex-1 flex-col justify-center">
              <div className="flex justify-around flex-wrap">
                {/* Main component on the left */}

                <div className="xl:grid xl:h-fit xl:w-max xl:grid-cols-1 xl:gap-2 mt-10 md:mt-0 slideUpFadeIn">
                  {/* Children component */}
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
