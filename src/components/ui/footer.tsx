export default function Footer() {
  return (
    <footer className="md:w-2/4 w-full px-8 flex flex-col py-8 items-center mx-auto border-t">
      <div className="pb-4 w-full flex justify-center flex-col items-center">
        <h3 className="text-3xl font-bold">txt-viewer</h3>
        <p className="text-muted-foreground">
          Better way to view a bunch of txt files.
        </p>
      </div>
      <span className="text-sm text-muted-foreground">
        ©{new Date().getFullYear()} Seryjnyy
      </span>
    </footer>
  );
}
