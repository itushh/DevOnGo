import CheckHelaConnection from "../components/interactive/CheckHelaConnection"

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <CheckHelaConnection />
    </div>
  )
}

export default Home