import { logo } from '../assets'; // Import logo dari folder assets

const Hero = () => {
  return (
    // Header section
    <header className=" w-full flex justify-center items-center flex-col"> 
        {/* Navigation section */}
        <nav className="flex justify-between items-center w-full mb-10 pt-3"> 
            <img src={logo} alt="sumz_logo" className="w-28 object-contain" /> {/* Menampilkan logo */}
            <button
                type="button"
                className="bg-black text-white px-5 py-2 rounded-full"
                onClick={() => window.open('https://github.com/defrijay/Summarify')} 
            >
                Github
            </button>
        </nav>
        {/* Main title */}
        <h1 className="head_text">
            Summarize Articles with <br className="max-md:hidden" />
            <span className="orange_gradient">OpenAI GPT-4</span> 
        </h1>
        {/* Description */}
        <h2 className="desc">
            Simplify your reading with Summize, an open-source article Summarizer that transforms lengthy articles into clear and concise Summaries
        </h2>
    </header>
  )
}

export default Hero
