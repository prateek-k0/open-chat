import { Link } from "react-router-dom"
import IconError404 from "../../common/Icons/Icon404Error"

const Error404 = () => {
  return (
    <div className="h-full flex  items-center px-16 py-32 flex-col text-white">
      <IconError404 width="200" height="200" className="text-orange-600" />
      <p className="text-4xl font-mono font-semibold text-wrap text-center">Oops! Not sure what you&apos;re looking for...</p>
      <Link className="my-8 text-2xl text-slate-400 hover:text-slate-600 hover:underline underline-offset-4" to="/">Go back to homepage</Link>
    </div>
  )
}

export default Error404