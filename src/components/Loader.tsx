import { BounceLoader } from "react-spinners";

export default function Loader() {
  return (
    <div className="absolute top-[50vh] left-[50vw] z-50">
      <BounceLoader color="#24b585" />
    </div>
  );
}
