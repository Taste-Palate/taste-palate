const MainTemplate = ({children}) => {
  return (
    <div className='MainTemplate'>
      <div className='TopBar'>{children}</div>
    </div>
  )
}

export default MainTemplate;