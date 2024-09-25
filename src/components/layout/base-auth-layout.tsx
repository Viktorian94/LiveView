type Props = {
  form: React.ReactNode;
  title: string;
  subtitle: string;
};

export default function BaseAuthLayout(props: Props) {
  return (
    <>
      <div className="flex h-screen items-center bg-slate-300 lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 rounded-xl bg-white  p-8 shadow-lg sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              {props.title}
            </h1>
            <p className="text-sm text-muted-foreground">{props.subtitle}</p>
          </div>

          {/* Form rendering here */}
          {props.form}
        </div>
      </div>
    </>
  );
}
